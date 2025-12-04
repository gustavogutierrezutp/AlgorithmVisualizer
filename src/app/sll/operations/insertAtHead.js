import { LAYOUT, ANIMATION, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getHeadNode } from '../utils/nodeFilters';
import { getHeadPointerPosition, getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Inserts a new node at the head of the linked list
 * @param {Object} context - Component context with state and methods
 * @param {*} value - Value to insert
 * @returns {Promise<void>}
 */
export async function insertAtHead(context, value) {
  const { state, setState, reactFlowInstance, handlePointerHover } = context;
  const existingNodes = [...state.nodes];

  // Filter to get only linked list nodes
  const listNodes = getListNodes(existingNodes);
  const firstNode = getHeadNode(listNodes);
  const fixedDistance = LAYOUT.NODE_HORIZONTAL_SPACING;
  const newNodeX = firstNode ? firstNode.position.x - fixedDistance : 50;
  const newNodeY = firstNode ? firstNode.position.y : 100;

  const newNodeId = `node-${Date.now()}`;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor,
    handlePointerHover
  );

  // Insert new node at the beginning, maintaining pointer nodes at their positions
  const nodes = existingNodes.map(n => n);
  const firstListNodeIndex = nodes.findIndex(n => n.type === 'linkedListNode');
  if (firstListNodeIndex !== -1) {
    nodes.splice(firstListNodeIndex, 0, newNode);
  } else {
    nodes.push(newNode);
  }

  // Rebuild edges for linked list nodes only
  const updatedListNodes = getListNodes(nodes);
  let edges = createEdgesForList(updatedListNodes);

  // Update Head Pointer (always exists)
  const headPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
  if (headPointerIndex !== -1) {
    nodes[headPointerIndex] = {
      ...nodes[headPointerIndex],
      position: getHeadPointerPosition(newNode)
    };
    edges.push(createHeadPointerEdge(newNodeId));
  }

  // Update Tail Pointer if list was empty
  if (listNodes.length === 0) {
    const tailPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
    if (tailPointerIndex !== -1) {
      nodes[tailPointerIndex] = {
        ...nodes[tailPointerIndex],
        position: getTailPointerPosition(newNode)
      };
      edges.push(createTailPointerEdge(newNodeId));
    }
  } else {
    // Keep existing tail pointer edge
    const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
    if (tailPointerEdge) {
      edges.push(tailPointerEdge);
    }
  }

  setState({ nodes, edges }, () => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
      }, 100);
    }
  });
  await sleep(state.speed);
}
