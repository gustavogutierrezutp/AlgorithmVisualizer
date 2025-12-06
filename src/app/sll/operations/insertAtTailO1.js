import { LAYOUT, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createListEdge, createTailPointerEdge, createHeadPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getTailNode } from '../utils/nodeFilters';
import { getTailPointerPosition, getHeadPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Inserts a new node at the tail of the linked list (O(1) with tail pointer)
 * @param {Object} context - Component context with state and methods
 * @param {*} value - Value to insert
 * @returns {Promise<void>}
 */
export async function insertAtTailO1(context, value) {
  const { state, setState, handlePointerHover } = context;
  const nodes = [...state.nodes];
  let edges = [...state.edges];

  // No traversal loop here - O(1) behavior

  // Add new node at same Y as last node, fixed distance in X
  // Filter out pointer nodes to find the actual last list node
  const listNodes = getListNodes(nodes);
  const lastNode = getTailNode(listNodes);

  const fixedDistance = LAYOUT.NODE_HORIZONTAL_SPACING;
  const newNodeX = lastNode ? lastNode.position.x + fixedDistance : 50;
  const newNodeY = lastNode ? lastNode.position.y : 100;

  const newNodeId = `node-${Date.now()}`;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor,
    handlePointerHover
  );

  const newNodes = [...nodes, newNode];

  // Add edge if list was not empty
  if (lastNode) {
    edges.push(createListEdge(lastNode.id, newNodeId, `${lastNode.id}-${newNodeId}`));
  }

  // Update Tail Pointer Position
  const tailPointerIndex = newNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
  if (tailPointerIndex !== -1) {
    newNodes[tailPointerIndex] = {
      ...newNodes[tailPointerIndex],
      position: getTailPointerPosition(newNode)
    };

    // Update or create pointer edge
    const pointerEdgeIndex = edges.findIndex(e => e.source === NODE_IDS.POINTER_TAIL);
    if (pointerEdgeIndex !== -1) {
      edges[pointerEdgeIndex] = {
        ...edges[pointerEdgeIndex],
        target: newNodeId
      };
    } else {
      edges.push(createTailPointerEdge(newNodeId));
    }
  }

  // Also handle Head pointer if list was empty
  if (listNodes.length === 0) {
    const headPointerIndex = newNodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
    if (headPointerIndex !== -1) {
      newNodes[headPointerIndex] = {
        ...newNodes[headPointerIndex],
        position: getHeadPointerPosition(newNode)
      };
      edges.push(createHeadPointerEdge(newNodeId));
    }
  }

  setState({ nodes: newNodes, edges });
  await sleep(state.speed);
}
