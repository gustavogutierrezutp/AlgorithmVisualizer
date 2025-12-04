import { LAYOUT, NODE_IDS } from '../constants';
import { createHeadPointerEdge, createTailPointerEdge } from './edgeFactory';

/**
 * Calculates the position for a head pointer above a node
 */
export const getHeadPointerPosition = (node) => ({
  x: node.position.x,
  y: node.position.y - LAYOUT.POINTER_VERTICAL_OFFSET
});

/**
 * Calculates the position for a tail pointer below a node
 */
export const getTailPointerPosition = (node) => ({
  x: node.position.x,
  y: node.position.y + LAYOUT.POINTER_VERTICAL_OFFSET
});

/**
 * Updates the head pointer node to point to a specific target node
 */
export const updateHeadPointer = (nodes, targetNode) => {
  if (!targetNode) return nodes;

  return nodes.map(node => {
    if (node.id === NODE_IDS.POINTER_HEAD) {
      return {
        ...node,
        position: getHeadPointerPosition(targetNode)
      };
    }
    return node;
  });
};

/**
 * Updates the tail pointer node to point to a specific target node
 */
export const updateTailPointer = (nodes, targetNode) => {
  if (!targetNode) return nodes;

  return nodes.map(node => {
    if (node.id === NODE_IDS.POINTER_TAIL) {
      return {
        ...node,
        position: getTailPointerPosition(targetNode)
      };
    }
    return node;
  });
};

/**
 * Updates both head and tail pointers
 */
export const updatePointers = (nodes, headNode, tailNode) => {
  let updatedNodes = nodes;
  if (headNode) {
    updatedNodes = updateHeadPointer(updatedNodes, headNode);
  }
  if (tailNode) {
    updatedNodes = updateTailPointer(updatedNodes, tailNode);
  }
  return updatedNodes;
};

/**
 * Creates pointer edges for the current list state
 */
export const createPointerEdges = (listNodes) => {
  const edges = [];

  if (listNodes.length > 0) {
    // Head pointer points to first node
    edges.push(createHeadPointerEdge(listNodes[0].id));

    // Tail pointer points to last node
    edges.push(createTailPointerEdge(listNodes[listNodes.length - 1].id));
  }

  return edges;
};

/**
 * Removes all pointer-related edges from the edge list
 */
export const removePointerEdges = (edges) =>
  edges.filter(edge =>
    !edge.id.includes(NODE_IDS.POINTER_HEAD) &&
    !edge.id.includes(NODE_IDS.POINTER_TAIL)
  );
