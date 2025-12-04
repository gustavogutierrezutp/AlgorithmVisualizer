import { NODE_IDS } from '../constants';

/**
 * Gets all linked list nodes (excluding pointer nodes)
 */
export const getListNodes = (nodes) =>
  nodes.filter(n => n.type === 'linkedListNode');

/**
 * Gets all pointer nodes (circular pointer indicators)
 */
export const getPointerNodes = (nodes) =>
  nodes.filter(n => n.type === 'circleNode');

/**
 * Gets the head node from a list of nodes
 */
export const getHeadNode = (listNodes) =>
  listNodes.length > 0 ? listNodes[0] : null;

/**
 * Gets the tail node from a list of nodes
 */
export const getTailNode = (listNodes) =>
  listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;

/**
 * Gets the head pointer node
 */
export const getHeadPointer = (nodes) =>
  nodes.find(n => n.id === NODE_IDS.POINTER_HEAD);

/**
 * Gets the tail pointer node
 */
export const getTailPointer = (nodes) =>
  nodes.find(n => n.id === NODE_IDS.POINTER_TAIL);

/**
 * Filters out pointer nodes from a list
 */
export const removePointerNodes = (nodes) =>
  nodes.filter(n => n.id !== NODE_IDS.POINTER_HEAD && n.id !== NODE_IDS.POINTER_TAIL);
