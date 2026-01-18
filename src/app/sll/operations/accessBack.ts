import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes, getTailNode } from '../utils/nodeFilters';
import { COLORS } from '../constants';

/**
 * Accesses back (tail) element of the linked list
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function accessBack(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length === 0) return;

  const tailNode = getTailNode(listNodes);
  if (!tailNode) return;

  // Highlight tail node
  const highlightedNodes = state.nodes.map((node) => {
    if (node.id === tailNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          background: state.iterateColor,
          border: '3px solid #E64A19',
        }
      };
    }
    return node;
  });
  setState({ nodes: highlightedNodes });
  await sleep(state.speed * 2);

  // Reset styling
  const resetNodes = state.nodes.map((node) => {
    if (node.id === tailNode.id) {
      return {
        ...node,
        style: {
          ...node.style,
          background: COLORS.NODE_DEFAULT,
          border: node.style?.border || '2px solid #333',
        }
      };
    }
    return node;
  });
  setState({ nodes: resetNodes });
}
