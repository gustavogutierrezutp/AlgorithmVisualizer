import { LAYOUT, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createEdgesForList, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { Node, MarkerType } from '@xyflow/react';

/**
 * Inserts at tail O(1) - uses tail pointer directly
 * @param context - Component context with state and methods
 * @param value - Value to insert
 * @returns Promise<void>
 */
export async function insertAtTailO1(context: OperationContext, value: number): Promise<void> {
  const { state, setState, handlePointerHover } = context;
  const listNodes = getListNodes(state.nodes);
  const pointerNodes = getPointerNodes(state.nodes);

  // Create new node
  const newNodeId = `node-${Date.now()}`;
  let newNodeX = 50;
  let newNodeY = 100;

  const tailNode = listNodes[listNodes.length - 1];
  if (tailNode) {
    newNodeX = tailNode.position.x + LAYOUT.NODE_HORIZONTAL_SPACING;
    newNodeY = tailNode.position.y;
  }

  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor!,
    handlePointerHover
  );

  // Add new node
  const allNodes: Node[] = [...pointerNodes, ...listNodes, newNode];

  // Rebuild edges
  let edges = createEdgesForList(listNodes);
  edges.push({
    id: `edge-${tailNode?.id}-${newNodeId}`,
    source: tailNode?.id,
    sourceHandle: 'right',
    target: newNodeId,
    targetHandle: 'left',
    animated: true,
    type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 10,
      height: 10,
      color: '#333'
    },
    style: {
      strokeWidth: 2,
      stroke: '#333'
    }
  });

  // Update tail pointer
  const tailPointerIndex = allNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
  if (tailPointerIndex !== -1) {
    allNodes[tailPointerIndex] = {
      ...allNodes[tailPointerIndex],
      position: getTailPointerPosition(newNode)
    };
    edges.push(createTailPointerEdge(newNodeId));
  }

  // Keep head pointer edge
  const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
  if (headPointerEdge) {
    edges.push(headPointerEdge);
  }

  setState({ nodes: allNodes, edges });
  await sleep(state.speed);
}
