import { ReactFlowInstance, Node, Edge } from '@xyflow/react';

export interface ListOperationsParams {
  nodes: Node[];
  edges: Edge[];
  speed: number;
  newNodeColor: string;
  iterateColor: string;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  reactFlowInstance: React.RefObject<ReactFlowInstance>;
  handlePointerHover: (nodeId: string | null) => void;
}

export interface ListOperationsReturn {
  insertAtHead: (value: number) => Promise<void>;
  deleteAtHead: () => Promise<void>;
  insertAtTail: (value: number) => Promise<void>;
  insertAtTailO1: (value: number) => Promise<void>;
  deleteAtTail: () => Promise<void>;
  traverseList: () => Promise<void>;
  reverseList: () => Promise<void>;
  insertAtPosition: (value: number, position: number) => Promise<void>;
  getLength: () => Promise<number | void>;
  searchValue: (value: number) => Promise<{ found: boolean; position: number } | void>;
  findMiddle: () => Promise<Node | void>;
  deleteAtPosition: (position: number) => Promise<void>;
  removeDuplicates: () => Promise<void>;
  accessFront: () => Promise<void>;
  accessBack: () => Promise<void>;
  accessNth: (position: number) => Promise<Node | void>;
}
