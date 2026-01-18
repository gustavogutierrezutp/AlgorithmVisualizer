import { LAYOUT, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createEdgesForList, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes, getTailNode } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { Node } from '@xyflow/react';

/**
 * Inserts a new node at tail (O(n) - traverses to find tail)
 * @param context - Component context with state and methods
 * @param value - Value to insert
 * @returns Promise<void>
 */
export async function insertAtTail(context: OperationContext, value: number): Promise<void> {
  const { state, setState, handlePointerHover } = context;
  const listNodes = getListNodes(state.nodes);
  const pointerNodes = getPointerNodes(state.nodes);

  if (listNodes.length === 0) {
    // Empty list - insert at head
    await insertAtHead(context, value);
    return;
  }

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

  const tailNode = getTailNode(listNodes);
  if (!tailNode) return;

  // Create new node
  const newNodeId = `node-${Date.now()}`;
  const newNodeX = tailNode.position.x + LAYOUT.NODE_HORIZONTAL_SPACING;
  const newNodeY = tailNode.position.y;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor!,
    handlePointerHover
  );

  // Add new node to list
  const allNodes: Node[] = [...pointerNodes, ...listNodes, newNode];

  // Rebuild edges
  let edges = createEdgesForList(listNodes);
  edges.push({
    id: `edge-${tailNode.id}-${newNodeId}`,
    source: tailNode.id,
    sourceHandle: 'right',
    target: newNodeId,
    targetHandle: 'left',
    animated: true,
    type: 'smoothstep',
    markerEnd: {
      type: 'arrowclosed' as any,
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

// Import insertAtHead for empty list case
import { insertAtHead } from './insertAtHead';
