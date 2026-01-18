import { Node } from '@xyflow/react';
import { NODE_IDS } from '../constants';
import { ListNode, CircleNode } from '../../../types/linked-list';

export const getListNodes = (nodes: Node[]): ListNode[] =>
  nodes.filter(n => n.type === 'linkedListNode') as ListNode[];

export const getPointerNodes = (nodes: Node[]): CircleNode[] =>
  nodes.filter(n => n.type === 'circleNode') as CircleNode[];

export const getHeadNode = (listNodes: ListNode[]): ListNode | null =>
  listNodes.length > 0 ? listNodes[0] : null;

export const getTailNode = (listNodes: ListNode[]): ListNode | null =>
  listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;

export const getHeadPointer = (nodes: Node[]): CircleNode | undefined =>
  nodes.find(n => n.id === NODE_IDS.POINTER_HEAD) as CircleNode;

export const getTailPointer = (nodes: Node[]): CircleNode | undefined =>
  nodes.find(n => n.id === NODE_IDS.POINTER_TAIL) as CircleNode;

export const removePointerNodes = (nodes: Node[]): Node[] =>
  nodes.filter(n => n.id !== NODE_IDS.POINTER_HEAD && n.id !== NODE_IDS.POINTER_TAIL);
