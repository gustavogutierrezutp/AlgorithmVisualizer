import { COLORS } from '../constants';
import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Highlights the front (head) node of the linked list
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<void>}
 */
export async function accessFront(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) {
    console.log('List is empty');
    return;
  }

  const headNode = listNodes[0];

  // Highlight the head node with active color
  const highlightedNodes = state.nodes.map(node =>
    node.id === headNode.id
      ? {
          ...node,
          style: {
            ...node.style,
            background: state.iterateColor,
            border: `3px solid ${state.iterateColor}`,
          },
        }
      : node
  );

  setState({ nodes: highlightedNodes, edges: state.edges });
  await sleep(state.speed * 2);

  // Reset to default color
  const resetNodes = state.nodes.map(node =>
    node.id === headNode.id
      ? {
          ...node,
          style: {
            ...node.style,
            background: COLORS.NODE_DEFAULT,
            border: '2px solid #333',
          },
        }
      : node
  );

  setState({ nodes: resetNodes, edges: state.edges });
  await sleep(state.speed);
}
