import { NODE_IDS } from '../constants';
import { createEdgesForList, createHeadPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getHeadPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { Node } from '@xyflow/react';

/**
 * Deletes the node at the head of the linked list
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function deleteAtHead(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length === 0) return;

  // Remove first list node, keep pointer nodes
  const pointerNodes = getPointerNodes(state.nodes);
  const remainingListNodes = listNodes.slice(1);
  const nodes: Node[] = [...pointerNodes, ...remainingListNodes];

  // Rebuild edges for linked list nodes
  let edges = createEdgesForList(remainingListNodes);

  // Update Head Pointer
  const headPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
  if (headPointerIndex !== -1 && remainingListNodes.length > 0) {
    const newHead = remainingListNodes[0];
    nodes[headPointerIndex] = {
      ...nodes[headPointerIndex],
      position: getHeadPointerPosition(newHead)
    };

    edges.push(createHeadPointerEdge(newHead.id));
  }

  // Update Tail Pointer edge (tail stays the same unless list becomes empty)
  if (remainingListNodes.length > 0) {
    const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
    if (tailPointerEdge) {
      edges.push(tailPointerEdge);
    }
  }

  setState({ nodes, edges });
  await sleep(state.speed);
}
