import { COLORS } from '../constants';
import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Searches for a value in the linked list with animation
 * @param {Object} context - Component context with state and methods
 * @param {number} value - The value to search for
 * @returns {Promise<Object>} Object with found status and position
 */
export async function searchValue(context, value) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) {
    console.log('List is empty');
    return { found: false, position: -1 };
  }

  // Traverse and search for the value
  for (let i = 0; i < listNodes.length; i++) {
    const currentNode = listNodes[i];

    // Highlight current node being checked
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
    await sleep(state.speed);

    // Check if this is the node we're looking for
    if (parseInt(currentNode.data.label) === parseInt(value)) {
      // Found! Highlight in green with success indicator
      const foundNodes = state.nodes.map(node => {
        if (node.id === currentNode.id) {
          return {
            ...node,
            style: {
              ...node.style,
              background: '#22C55E', // Green-500
              border: '3px solid #16A34A', // Green-600
            },
            data: {
              ...node.data,
              label: `${node.data.label} ✓`
            }
          };
        }
        return node;
      });

      setState({ nodes: foundNodes, edges: state.edges });
      await sleep(state.speed * 2);

      // Reset the node
      const resetNodes = state.nodes.map(node => {
        if (node.id === currentNode.id) {
          return {
            ...node,
            style: {
              ...node.style,
              background: COLORS.NODE_DEFAULT,
              border: '2px solid #333',
            },
            data: {
              ...node.data,
              label: node.data.label.toString().replace(' ✓', '')
            }
          };
        }
        return node;
      });

      setState({ nodes: resetNodes, edges: state.edges });

      console.log(`Value ${value} found at position ${i}`);
      return { found: true, position: i };
    }

    // Not found yet, reset current node to default
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

  // Value not found in the list
  console.log(`Value ${value} not found`);
  return { found: false, position: -1 };
}
