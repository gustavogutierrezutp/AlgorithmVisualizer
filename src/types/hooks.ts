import { ReactFlowInstance, Node, Edge } from '@xyflow/react';
import { NodeSetStateAction, EdgeSetStateAction, VoidPromiseFunction } from './common';

export interface ListOperationsParams {
  nodes: Node[];
  edges: Edge[];
  speed: number;
  newNodeColor: string;
  iterateColor: string;
  setNodes: NodeSetStateAction;
  setEdges: EdgeSetStateAction;
  reactFlowInstance: React.RefObject<ReactFlowInstance | null>;
  handlePointerHover: (nodeId: string | null) => void;
}

export interface ListOperationsReturn {
  insertAtHead: (value: number) => Promise<void>;
  deleteAtHead: VoidPromiseFunction;
  insertAtTail: (value: number) => Promise<void>;
  insertAtTailO1: (value: number) => Promise<void>;
  deleteAtTail: VoidPromiseFunction;
  traverseList: VoidPromiseFunction;
  reverseList: VoidPromiseFunction;
  insertAtPosition: (value: number, position: number) => Promise<void>;
  getLength: () => Promise<number>;
  searchValue: (value: number) => Promise<{ found: boolean; position: number }>;
  findMiddle: () => Promise<Node | null>;
  deleteAtPosition: (position: number) => Promise<void>;
  removeDuplicates: VoidPromiseFunction;
  accessFront: VoidPromiseFunction;
  accessBack: VoidPromiseFunction;
  accessNth: (position: number) => Promise<Node | null>;
}
