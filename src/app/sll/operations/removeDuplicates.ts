import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { createEdgesForList } from '../utils/edgeFactory';
import { getHeadPointerPosition, getTailPointerPosition } from '../utils/pointerHelpers';
import { COLORS, NODE_IDS } from '../constants';
import { Node } from '@xyflow/react';
import { createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';

/**
 * Removes duplicate values from linked list
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function removeDuplicates(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  const pointerNodes = getPointerNodes(state.nodes);

  if (listNodes.length === 0) return;

  // Keep track of seen values
  const seen = new Set<number>();
  const toRemove: string[] = [];

  // Find duplicates
  for (let i = 0; i < listNodes.length; i++) {
    const value = parseInt(listNodes[i].data.label);
    if (seen.has(value)) {
      toRemove.push(listNodes[i].id);
    } else {
      seen.add(value);
    }

    // Highlight current node
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        const isCurrentNode = listIndex === i;
        const isDuplicate = toRemove.includes(node.id);

        return {
          ...node,
          style: {
            ...node.style,
            background: isCurrentNode ? state.iterateColor : (isDuplicate ? '#FF5252' : node.style?.background),
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);
  }

  // Remove duplicate nodes
  const filteredListNodes = listNodes.filter(node => !toRemove.includes(node.id));
  const allNodes: Node[] = [...pointerNodes, ...filteredListNodes];

  // Rebuild edges
  let edges = createEdgesForList(filteredListNodes);

  // Update pointers
  if (filteredListNodes.length > 0) {
    const headNode = filteredListNodes[0];
    const tailNode = filteredListNodes[filteredListNodes.length - 1];

    const headPointerIndex = allNodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
    const tailPointerIndex = allNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);

    if (headPointerIndex !== -1) {
      allNodes[headPointerIndex] = {
        ...allNodes[headPointerIndex],
        position: getHeadPointerPosition(headNode)
      };
      edges.push(createHeadPointerEdge(headNode.id));
    }

    if (tailPointerIndex !== -1 && tailNode) {
      allNodes[tailPointerIndex] = {
        ...allNodes[tailPointerIndex],
        position: getTailPointerPosition(tailNode)
      };
      edges.push(createTailPointerEdge(tailNode.id));
    }
  }

  setState({ nodes: allNodes, edges });
  await sleep(state.speed * 2);

  // Reset all node colors
  const resetNodes = allNodes.map((node) => {
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
}
