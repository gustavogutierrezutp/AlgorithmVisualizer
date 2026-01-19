import { NODE_IDS } from '../constants';
import { createEdgesForList } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { Node, MarkerType } from '@xyflow/react';

/**
 * Deletes node at tail O(n) - traverses to find tail
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function deleteAtTail(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  if (listNodes.length === 0) return;

  if (listNodes.length === 1) {
    // Single node - just delete it
    await deleteAtHead(context);
    return;
  }

  const pointerNodes = getPointerNodes(state.nodes);

  // Traverse to tail
  for (let i = 0; i < listNodes.length; i++) {
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

  // Remove last node (tail)
  const remainingListNodes = listNodes.slice(0, -1);
  const allNodes: Node[] = [...pointerNodes, ...remainingListNodes];

  // Rebuild edges
  let edges = createEdgesForList(remainingListNodes);

  // Update tail pointer to new tail
  const newTailNode = remainingListNodes[remainingListNodes.length - 1];
  const tailPointerIndex = allNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
  if (tailPointerIndex !== -1 && newTailNode) {
    allNodes[tailPointerIndex] = {
      ...allNodes[tailPointerIndex],
      position: getTailPointerPosition(newTailNode)
    };
    edges.push({
      id: `edge-${NODE_IDS.POINTER_TAIL}-${newTailNode.id}`,
      source: NODE_IDS.POINTER_TAIL,
      target: newTailNode.id,
      targetHandle: 'bottom',
      animated: true,
      style: {
        stroke: '#333',
        strokeWidth: 2
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: '#333'
      }
    });
  }

  // Keep head pointer edge
  const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
  if (headPointerEdge) {
    edges.push(headPointerEdge);
  }

  setState({ nodes: allNodes, edges });
  await sleep(state.speed);
}

import { deleteAtHead } from './deleteAtHead';
