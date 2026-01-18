import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes } from '../utils/nodeFilters';
import { COLORS } from '../constants';

/**
 * Traverses the linked list from head to tail
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function traverseList(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length === 0) return;

  // Reset all node colors first
  const resetNodes = state.nodes.map((node) => {
    if (node.type === 'linkedListNode') {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
        }
      };
    }
    return node;
  });
  setState({ nodes: resetNodes });
  await sleep(state.speed / 2);

  // Highlight each node in sequence
  for (let i = 0; i < listNodes.length; i++) {
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          style: {
            ...node.style,
            background: listIndex <= i ? state.iterateColor : COLORS.NODE_DEFAULT,
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);
  }

  // Reset colors back to default after traversal completes
  const finalNodes = state.nodes.map((node) => {
    if (node.type === 'linkedListNode') {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
        }
      };
    }
    return node;
  });
  setState({ nodes: finalNodes });
}
