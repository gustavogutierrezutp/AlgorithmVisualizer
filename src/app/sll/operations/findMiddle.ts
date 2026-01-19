import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes } from '../utils/nodeFilters';
import { COLORS, NODE_STYLE } from '../constants';
import { Node } from '@xyflow/react';

/**
 * Finds the middle node using fast/slow pointer technique
 * @param context - Component context with state and methods
 * @returns Promise<Node | null>
 */
export async function findMiddle(context: OperationContext): Promise<Node | null> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) {
    alert('List is empty');
    return null;
  }

  let slow = 0;
  let fast = 0;

  // Fast/slow pointer algorithm
  while (fast < listNodes.length) {
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        const isSlow = listIndex === slow;
        const isFast = listIndex === fast;
        const isVisited = listIndex < slow;

        return {
          ...node,
          style: {
            ...node.style,
            background: isSlow ? state.iterateColor : (isFast ? '#FFCDD2' : (isVisited ? '#FFF3E0' : COLORS.NODE_DEFAULT)),
            border: isSlow ? NODE_STYLE.BORDER_HIGHLIGHTED : node.style?.border,
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);

    // Move fast pointer
    fast += 2;
    // Move slow pointer
    slow += 1;
  }

  const middleNode = listNodes[slow - 1]; // slow stopped one ahead
  if (!middleNode) return null;

  // Highlight middle node
  const highlightedNodes = state.nodes.map((node) => {
    if (node.id === middleNode.id) {
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
  setState({ nodes: highlightedNodes });
  await sleep(state.speed * 2);

  // Reset
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

  return middleNode;
}
