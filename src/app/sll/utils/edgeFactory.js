import { MarkerType } from '@xyflow/react';
import { COLORS, EDGE_STYLE, NODE_IDS } from '../constants';

/**
 * Creates a standard edge between two list nodes
 */
export const createListEdge = (sourceId, targetId, index) => ({
  id: `edge-${index}`,
  source: sourceId,
  sourceHandle: 'right',
  target: targetId,
  targetHandle: 'left',
  animated: true,
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: EDGE_STYLE.MARKER_WIDTH,
    height: EDGE_STYLE.MARKER_HEIGHT,
    color: COLORS.EDGE_DEFAULT
  },
  style: {
    strokeWidth: EDGE_STYLE.STROKE_WIDTH_DEFAULT,
    stroke: COLORS.EDGE_DEFAULT
  }
});

/**
 * Creates an edge from a pointer node to a list node
 */
export const createPointerEdge = (pointerId, targetNodeId, targetHandle) => ({
  id: `edge-${pointerId}-${targetNodeId}`,
  source: pointerId,
  target: targetNodeId,
  targetHandle: targetHandle,
  animated: true,
  style: {
    stroke: COLORS.EDGE_DEFAULT,
    strokeWidth: EDGE_STYLE.STROKE_WIDTH_DEFAULT
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: EDGE_STYLE.MARKER_WIDTH,
    height: EDGE_STYLE.MARKER_HEIGHT,
    color: COLORS.EDGE_DEFAULT
  },
});

/**
 * Creates a head pointer edge
 */
export const createHeadPointerEdge = (targetNodeId) =>
  createPointerEdge(NODE_IDS.POINTER_HEAD, targetNodeId, 'top');

/**
 * Creates a tail pointer edge
 */
export const createTailPointerEdge = (targetNodeId) =>
  createPointerEdge(NODE_IDS.POINTER_TAIL, targetNodeId, 'bottom');

/**
 * Creates edges for all nodes in a list
 */
export const createEdgesForList = (nodes) => {
  const edges = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(createListEdge(nodes[i].id, nodes[i + 1].id, i));
  }
  return edges;
};
