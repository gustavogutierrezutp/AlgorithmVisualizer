import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes } from '../utils/nodeFilters';
import { COLORS, NODE_STYLE } from '../constants';
import { Node } from '@xyflow/react';

/**
 * Accesses nth element by index
 * @param context - Component context with state and methods
 * @param position - Zero-based index
 * @returns Promise<Node | null>
 */
export async function accessNth(context: OperationContext, position: number): Promise<Node | null> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (position < 0 || position >= listNodes.length) {
    alert(`Invalid position. List size: ${listNodes.length}`);
    return null;
  }

  // Traverse to nth position
  for (let i = 0; i <= position; i++) {
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          style: {
            ...node.style,
            background: listIndex <= i ? state.iterateColor : COLORS.NODE_DEFAULT,
            border: listIndex === i ? NODE_STYLE.BORDER_HIGHLIGHTED : node.style?.border,
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);
  }

  const targetNode = listNodes[position];
  await sleep(state.speed * 2);

  // Reset all nodes
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

  return targetNode;
}
