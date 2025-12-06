import { COLORS } from '../constants';
import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Accesses the node at a specific position with sequential traversal animation
 * @param {Object} context - Component context with state and methods
 * @param {number} position - Zero-based index position to access
 * @returns {Promise<Object>} - Object with found status and value
 */
export async function accessNth(context, position) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  // Validate position
  if (position < 0 || position >= listNodes.length) {
    console.error(`Invalid position ${position}. Must be between 0 and ${listNodes.length - 1}`);
    return { found: false, value: null, position: -1 };
  }

  // Traverse from head to the target position
  for (let i = 0; i <= position; i++) {
    const currentNode = listNodes[i];

    // Highlight current node being traversed
    const highlightedNodes = state.nodes.map(node => {
      if (node.id === currentNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: state.iterateColor,
            border: `3px solid ${state.iterateColor}`,
          },
        };
      }
      return node;
    });

    setState({ nodes: highlightedNodes, edges: state.edges });

    // If this is the target position, hold the highlight longer
    if (i === position) {
      await sleep(state.speed * 2);
    } else {
      await sleep(state.speed);
    }

    // Reset node to default color
    const resetNodes = state.nodes.map(node => {
      if (node.id === currentNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: COLORS.NODE_DEFAULT,
            border: '2px solid #333',
          },
        };
      }
      return node;
    });

    setState({ nodes: resetNodes, edges: state.edges });
  }

  const value = parseInt(listNodes[position].data.label);
  console.log(`Accessed position ${position} with value ${value}`);
  return { found: true, value, position };
}
