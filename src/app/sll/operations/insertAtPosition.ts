import { LAYOUT } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';
import { OperationContext } from '../../../types/linked-list';
import { Node } from '@xyflow/react';
import { insertAtHead } from './insertAtHead';
import { insertAtTail } from './insertAtTail';

/**
 * Inserts a new node at specified position
 * @param context - Component context with state and methods
 * @param value - Value to insert
 * @param position - Zero-based index
 * @returns Promise<void>
 */
export async function insertAtPosition(context: OperationContext, value: number, position: number): Promise<void> {
  const { state, setState, handlePointerHover } = context;
  const listNodes = getListNodes(state.nodes);

  if (position < 0 || position > listNodes.length) {
    alert(`Invalid position. List size: ${listNodes.length}`);
    return;
  }

  // Insert at head
  if (position === 0) {
    await insertAtHead(context, value);
    return;
  }

  // Insert at tail
  if (position === listNodes.length) {
    await insertAtTail(context, value);
    return;
  }

  const pointerNodes = getPointerNodes(state.nodes);
  const _targetNode = listNodes[position];

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

  // Create new node
  const newNodeId = `node-${Date.now()}`;
  const newNodeX = _targetNode.position.x + LAYOUT.NODE_HORIZONTAL_SPACING / 2;
  const newNodeY = _targetNode.position.y;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor!,
    handlePointerHover
  );

  // Insert new node
  const allNodes: Node[] = [...pointerNodes];
  for (let i = 0; i <= listNodes.length; i++) {
    if (i === position) {
      allNodes.push(newNode);
    }
    if (i < listNodes.length) {
      allNodes.push(listNodes[i]);
    }
  }

  // Rebuild edges
  let edges = createEdgesForList(allNodes.filter(n => n.type === 'linkedListNode'));

  // Update head pointer
  edges.push(createHeadPointerEdge(listNodes[0].id));
  // Update tail pointer
  edges.push(createTailPointerEdge(allNodes.filter(n => n.type === 'linkedListNode').slice(-1)[0].id));

  setState({ nodes: allNodes, edges });
  await sleep(state.speed);
}
