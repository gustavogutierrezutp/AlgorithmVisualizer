import { Node, Edge, ReactFlowInstance } from '@xyflow/react';

// Data Interfaces
export interface ListNodeData {
  label: string;
  nodeId: string;
  onPointerHover: (nodeId: string | null) => void;
}

export interface CircleNodeData {
  label: string;
  nodeId: string;
  onPointerHover: (nodeId: string | null) => void;
  onLabelChange: (nodeId: string, newLabel: string) => void;
}

// Node Types
export interface ListNode extends Node {
  type: 'linkedListNode';
  data: ListNodeData & Record<string, unknown>;
}

export interface CircleNode extends Node {
  type: 'circleNode';
  data: CircleNodeData & Record<string, unknown>;
}

// Operation Context
export interface OperationContext {
  state: OperationState;
  setState: (updates: NodeEdgeUpdate | StateUpdater, callback?: () => void) => void;
  reactFlowInstance?: ReactFlowInstance;
  handlePointerHover: (nodeId: string | null) => void;
}

export interface OperationState {
  nodes: Node[];
  edges: Edge[];
  speed: number;
  iterateColor: string;
  newNodeColor?: string;
}

export interface NodeEdgeUpdate {
  nodes?: Node[];
  edges?: Edge[];
}

export type StateUpdater = (currentState: { nodes: Node[]; edges: Edge[] }) => void;

// Position helpers
export interface Point2D {
  x: number;
  y: number;
}
