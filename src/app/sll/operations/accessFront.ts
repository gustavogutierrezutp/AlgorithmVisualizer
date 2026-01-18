import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes, getHeadNode } from '../utils/nodeFilters';
import { COLORS } from '../constants';

/**
 * Accesses front (head) element of the linked list
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function accessFront(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length === 0) return;

  const headNode = getHeadNode(listNodes);
  if (!headNode) return;

  // Highlight head node
  const highlightedNodes = state.nodes.map((node) => {
    if (node.id === headNode.id) {
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
    if (node.id === headNode.id) {
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
