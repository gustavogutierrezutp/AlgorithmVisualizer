import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { Node } from '@xyflow/react';

/**
 * Deletes node at specified position
 * @param context - Component context with state and methods
 * @param position - Zero-based index
 * @returns Promise<void>
 */
export async function deleteAtPosition(context: OperationContext, position: number): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (position < 0 || position >= listNodes.length) {
    alert(`Invalid position. List size: ${listNodes.length}`);
    return;
  }

  // Delete at head
  if (position === 0) {
    const { deleteAtHead } = await import('./deleteAtHead');
    await deleteAtHead(context);
    return;
  }

  // Delete at tail
  if (position === listNodes.length - 1) {
    const { deleteAtTail } = await import('./deleteAtTail');
    await deleteAtTail(context);
    return;
  }

  const pointerNodes = getPointerNodes(state.nodes);

  // Delete at head
  if (position === 0) {
    const { deleteAtHead } = await import('./deleteAtHead');
    await deleteAtHead(context);
    return;
  }

  // Delete at tail
  if (position === listNodes.length - 1) {
    const { deleteAtTail } = await import('./deleteAtTail');
    await deleteAtTail(context);
    return;
  }

  // Traverse to position
  for (let i = 0; i <= position; i++) {
    const traversedNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          style: {
            ...node.style,
            background: listIndex === i ? state.iterateColor : node.style?.background,
          }
        };
      }
      return node;
    });
    setState({ nodes: traversedNodes });
    await sleep(state.speed);
  }

  // Remove node at position
  const remainingListNodes = listNodes.filter((_, i) => i !== position);
  const allNodes: Node[] = [...pointerNodes, ...remainingListNodes];

  // Rebuild edges
  let edges = createEdgesForList(remainingListNodes);

  // Update head pointer
  if (remainingListNodes.length > 0) {
    edges.push(createHeadPointerEdge(remainingListNodes[0].id));
  }

  // Update tail pointer
  const newTailNode = remainingListNodes[remainingListNodes.length - 1];
  const tailPointerIndex = allNodes.findIndex(n => n.id === 'pointer-tail');
  if (tailPointerIndex !== -1 && newTailNode) {
    allNodes[tailPointerIndex] = {
      ...allNodes[tailPointerIndex],
      position: getTailPointerPosition(newTailNode)
    };
    edges.push(createTailPointerEdge(newTailNode.id));
  }

  setState({ nodes: allNodes, edges });
  await sleep(state.speed);
}
