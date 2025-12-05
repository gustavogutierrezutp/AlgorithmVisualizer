import { COLORS } from '../constants';
import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Counts the number of nodes in the linked list with animation
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<number>} The length of the list
 */
export async function getLength(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) {
    console.log('List length: 0');
    return 0;
  }

  let count = 0;

  // Traverse and count each node
  for (let i = 0; i < listNodes.length; i++) {
    count++;
    const currentNode = listNodes[i];

    // Highlight current node being counted
    const highlightedNodes = state.nodes.map(node => {
      if (node.id === currentNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: state.iterateColor,
            border: `3px solid ${state.iterateColor}`,
          },
          data: {
            ...node.data,
            label: `${node.data.label} [${count}]`
          }
        };
      }
      return node;
    });

    setState({ nodes: highlightedNodes, edges: state.edges });
    await sleep(state.speed);
  }

  // Reset all nodes to default color but keep the count labels
  const finalNodes = state.nodes.map(node => {
    const listNode = listNodes.find(ln => ln.id === node.id);
    if (listNode) {
      const nodeIndex = listNodes.findIndex(ln => ln.id === node.id);
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: '2px solid #333',
        },
        data: {
          ...node.data,
          label: `${node.data.label.toString().split(' ')[0]} [${nodeIndex + 1}]`
        }
      };
    }
    return node;
  });

  setState({ nodes: finalNodes, edges: state.edges });
  await sleep(state.speed);

  // Reset labels back to original after showing count
  const resetNodes = state.nodes.map(node => {
    const listNode = listNodes.find(ln => ln.id === node.id);
    if (listNode) {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: '2px solid #333',
        },
        data: {
          ...node.data,
          label: node.data.label.toString().split(' ')[0]
        }
      };
    }
    return node;
  });

  setState({ nodes: resetNodes, edges: state.edges });

  console.log(`List length: ${count}`);
  return count;
}
