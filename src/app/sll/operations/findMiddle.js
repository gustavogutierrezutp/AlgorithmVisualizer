import { COLORS } from '../constants';
import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Finds the middle node of the linked list using the two-pointer technique
 * (tortoise and hare algorithm)
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<Object>} Object with middle node index and value
 */
export async function findMiddle(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) {
    console.log('List is empty');
    return { index: -1, value: null };
  }

  if (listNodes.length === 1) {
    // Single node is the middle
    const middleNode = listNodes[0];
    const highlightedNodes = state.nodes.map(node => {
      if (node.id === middleNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: '#22C55E', // Green
            border: '3px solid #16A34A',
          },
        };
      }
      return node;
    });

    setState({ nodes: highlightedNodes, edges: state.edges });
    await sleep(state.speed * 2);

    // Reset
    const resetNodes = state.nodes.map(node => {
      if (node.id === middleNode.id) {
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

    console.log(`Middle node at index 0: ${middleNode.data.label}`);
    return { index: 0, value: parseInt(middleNode.data.label) };
  }

  // Two-pointer technique: slow moves 1 step, fast moves 2 steps
  let slowIndex = 0;
  let fastIndex = 0;

  while (fastIndex < listNodes.length - 1) {
    // Move fast pointer 2 steps (or 1 if near end)
    const oldFastIndex = fastIndex;
    fastIndex = Math.min(fastIndex + 2, listNodes.length - 1);

    // If fast pointer moved, move slow pointer 1 step
    if (oldFastIndex !== fastIndex && fastIndex < listNodes.length - 1) {
      slowIndex = slowIndex + 1;
    }

    // Highlight both pointers
    const highlightedNodes = state.nodes.map(node => {
      const slowNode = listNodes[slowIndex];
      const fastNode = listNodes[fastIndex];

      if (node.id === slowNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: '#22C55E', // Green for slow pointer
            border: '3px solid #16A34A',
          },
          data: {
            ...node.data,
            label: `${node.data.label.toString().split(' ')[0]} 🐢`
          }
        };
      } else if (node.id === fastNode.id) {
        return {
          ...node,
          style: {
            ...node.style,
            background: state.iterateColor, // Orange/red for fast pointer
            border: `3px solid ${state.iterateColor}`,
          },
          data: {
            ...node.data,
            label: `${node.data.label.toString().split(' ')[0]} 🐰`
          }
        };
      }
      return node;
    });

    setState({ nodes: highlightedNodes, edges: state.edges });
    await sleep(state.speed);

    // Reset the labels
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
            label: node.data.label.toString().replace(' 🐢', '').replace(' 🐰', '')
          }
        };
      }
      return node;
    });

    setState({ nodes: resetNodes, edges: state.edges });
    await sleep(state.speed / 2);
  }

  // Highlight the final middle node
  const middleNode = listNodes[slowIndex];
  const finalNodes = state.nodes.map(node => {
    if (node.id === middleNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          background: '#22C55E', // Green
          border: '3px solid #16A34A',
        },
        data: {
          ...node.data,
          label: `${node.data.label.toString().split(' ')[0]} [MID]`
        }
      };
    }
    return node;
  });

  setState({ nodes: finalNodes, edges: state.edges });
  await sleep(state.speed * 2);

  // Reset to default
  const resetFinalNodes = state.nodes.map(node => {
    if (node.id === middleNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: '2px solid #333',
        },
        data: {
          ...node.data,
          label: node.data.label.toString().replace(' [MID]', '')
        }
      };
    }
    return node;
  });

  setState({ nodes: resetFinalNodes, edges: state.edges });

  console.log(`Middle node at index ${slowIndex}: ${middleNode.data.label}`);
  return { index: slowIndex, value: parseInt(middleNode.data.label) };
}
