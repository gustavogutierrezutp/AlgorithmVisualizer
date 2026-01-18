import { Node } from '@xyflow/react';

export interface ListNodeConfig {
  id: string;
  value: string | number;
  x: number;
  y: number;
  backgroundColor: string;
  onPointerHover: (nodeId: string | null) => void;
}

export interface CircleNodeConfig {
  id: string;
  label: string;
  x: number;
  y: number;
  onPointerHover: (nodeId: string | null) => void;
  onLabelChange: (nodeId: string, newLabel: string) => void;
}

export interface EdgeConfig {
  sourceId: string;
  targetId: string;
  index: number;
}

export interface PointerEdgeConfig {
  pointerId: string;
  targetNodeId: string;
  targetHandle: string;
}

export interface ListResult {
  nodes: Node[];
  edges: import('@xyflow/react').Edge[];
}
