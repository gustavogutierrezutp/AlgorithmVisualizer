import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes } from '../utils/nodeFilters';
import { COLORS } from '../constants';

/**
 * Gets the length of the linked list
 * @param context - Component context with state and methods
 * @returns Promise<number | void>
 */
export async function getLength(context: OperationContext): Promise<number | void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  // Traverse and count
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
    await sleep(state.speed / 2);
  }

  await sleep(state.speed * 2);

  // Reset all nodes
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

  return listNodes.length;
}
