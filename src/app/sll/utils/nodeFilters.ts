import { Node } from '@xyflow/react';
import { NODE_IDS } from '../constants';
import { ListNode, CircleNode } from '../../../types/linked-list';

// Type predicates
export const isListNode = (node: Node): node is ListNode => node.type === 'linkedListNode';
export const isCircleNode = (node: Node): node is CircleNode => node.type === 'circleNode';

export const getListNodes = (nodes: Node[]): ListNode[] =>
  nodes.filter(isListNode);

export const getPointerNodes = (nodes: Node[]): CircleNode[] =>
  nodes.filter(isCircleNode);

export const getHeadNode = (listNodes: ListNode[]): ListNode | null =>
  listNodes.length > 0 ? listNodes[0] : null;

export const getTailNode = (listNodes: ListNode[]): ListNode | null =>
  listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;

export const getHeadPointer = (nodes: Node[]): CircleNode | undefined => {
  const node = nodes.find(n => n.id === NODE_IDS.POINTER_HEAD);
  return node && isCircleNode(node) ? node : undefined;
}

export const getTailPointer = (nodes: Node[]): CircleNode | undefined => {
  const node = nodes.find(n => n.id === NODE_IDS.POINTER_TAIL);
  return node && isCircleNode(node) ? node : undefined;
}

export const removePointerNodes = (nodes: Node[]): Node[] =>
  nodes.filter(n => n.id !== NODE_IDS.POINTER_HEAD && n.id !== NODE_IDS.POINTER_TAIL);
