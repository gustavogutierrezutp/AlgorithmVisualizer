import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes } from '../utils/nodeFilters';
import { COLORS, NODE_STYLE } from '../constants';

/**
 * Searches for a value in the linked list
 * @param context - Component context with state and methods
 * @param value - Value to search for
 * @returns Promise<{ found: boolean; position: number } | void>
 */
export async function searchValue(context: OperationContext, value: number): Promise<{ found: boolean; position: number } | void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  // Reset all node colors
  const resetNodes = state.nodes.map((node) => {
    if (node.type === 'linkedListNode') {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: node.style?.border || NODE_STYLE.BORDER,
        }
      };
    }
    return node;
  });
  setState({ nodes: resetNodes });
  await sleep(state.speed / 2);

  // Traverse and search
  for (let i = 0; i < listNodes.length; i++) {
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        const isCurrentNode = listIndex === i;
        const isVisited = listIndex < i;

        return {
          ...node,
          style: {
            ...node.style,
            background: isCurrentNode ? state.iterateColor : (isVisited ? '#FFCDD2' : COLORS.NODE_DEFAULT),
            border: isCurrentNode ? NODE_STYLE.BORDER_HIGHLIGHTED : node.style?.border,
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);

    // Check if current node has the value
    const currentNode = listNodes[i];
    if (parseInt(currentNode.data.label) === value) {
      // Found! Keep highlighting
      const foundNodes = state.nodes.map((node) => {
        if (node.id === currentNode.id) {
          return {
            ...node,
            style: {
              ...node.style,
              background: '#4CAF50', // Green for found
              border: '3px solid #2E7D32',
            }
          };
        }
        return node;
      });
      setState({ nodes: foundNodes });
      return { found: true, position: i };
    }
  }

  // Not found - reset all nodes
  const finalNodes = state.nodes.map((node) => {
    if (node.type === 'linkedListNode') {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: node.style?.border || NODE_STYLE.BORDER,
        }
      };
    }
    return node;
  });
  setState({ nodes: finalNodes });

  return { found: false, position: -1 };
}
