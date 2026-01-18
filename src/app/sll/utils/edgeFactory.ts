import { MarkerType, Edge, Node } from '@xyflow/react';
import { COLORS, EDGE_STYLE, NODE_IDS } from '../constants';

export const createListEdge = (sourceId: string, targetId: string, index: number): Edge => ({
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

export const createPointerEdge = (pointerId: string, targetNodeId: string, targetHandle: string): Edge => ({
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

export const createHeadPointerEdge = (targetNodeId: string): Edge =>
  createPointerEdge(NODE_IDS.POINTER_HEAD, targetNodeId, 'top');

export const createTailPointerEdge = (targetNodeId: string): Edge =>
  createPointerEdge(NODE_IDS.POINTER_TAIL, targetNodeId, 'bottom');

export const createEdgesForList = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push(createListEdge(nodes[i].id, nodes[i + 1].id, i));
  }
  return edges;
};
