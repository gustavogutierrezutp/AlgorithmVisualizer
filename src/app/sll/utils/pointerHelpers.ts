import { LAYOUT, NODE_IDS } from '../constants';
import { ListNode, Point2D } from '../../../types/linked-list';
import { Edge, Node } from '@xyflow/react';
import { createHeadPointerEdge, createTailPointerEdge } from './edgeFactory';

export const getHeadPointerPosition = (node: ListNode): Point2D => ({
  x: node.position.x,
  y: node.position.y - LAYOUT.POINTER_VERTICAL_OFFSET
});

export const getTailPointerPosition = (node: ListNode): Point2D => ({
  x: node.position.x,
  y: node.position.y + LAYOUT.POINTER_VERTICAL_OFFSET
});

export const updateHeadPointer = (nodes: Node[], targetNode: ListNode): Node[] => {
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

export const updateTailPointer = (nodes: Node[], targetNode: ListNode): Node[] => {
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

export const updatePointers = (nodes: Node[], headNode: ListNode | null, tailNode: ListNode | null): Node[] => {
  let updatedNodes = nodes;
  if (headNode) {
    updatedNodes = updateHeadPointer(updatedNodes, headNode);
  }
  if (tailNode) {
    updatedNodes = updateTailPointer(updatedNodes, tailNode);
  }
  return updatedNodes;
};

export const createPointerEdges = (listNodes: ListNode[]): Edge[] => {
  const edges: Edge[] = [];

  if (listNodes.length > 0) {
    edges.push(createHeadPointerEdge(listNodes[0].id));
    edges.push(createTailPointerEdge(listNodes[listNodes.length - 1].id));
  }

  return edges;
};

export const removePointerEdges = (edges: Edge[]): Edge[] =>
  edges.filter(edge =>
    !edge.id.includes(NODE_IDS.POINTER_HEAD) &&
    !edge.id.includes(NODE_IDS.POINTER_TAIL)
  );
