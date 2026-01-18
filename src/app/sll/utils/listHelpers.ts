import { LAYOUT, COLORS } from '../constants';
import { createListNode } from './nodeFactory';
import { createEdgesForList } from './edgeFactory';
import { ListResult } from '../../../types/utils';
import { ListNode } from '../../../types/linked-list';

export const createInitialList = (
  count: number,
  onPointerHover: (nodeId: string | null) => void,
  nodeColor: string = COLORS.NODE_DEFAULT
): ListResult => {
  const nodes: ListNode[] = [];

  for (let i = 0; i < count; i++) {
    const value = Math.floor(Math.random() * 100);
    const nodeId = `node-${i}`;
    const x = LAYOUT.INITIAL_X + (i * LAYOUT.NODE_HORIZONTAL_SPACING);
    const y = LAYOUT.INITIAL_Y;
    nodes.push(createListNode(nodeId, value, x, y, nodeColor, onPointerHover));
  }

  const edges = createEdgesForList(nodes);
  return { nodes, edges };
};

export const createListFromSequence = (
  values: (string | number)[],
  onPointerHover: (nodeId: string | null) => void,
  nodeColor: string = COLORS.NODE_DEFAULT
): ListResult => {
  const nodes: ListNode[] = [];

  for (let i = 0; i < values.length; i++) {
    const nodeId = `node-${i}`;
    const x = LAYOUT.INITIAL_X + (i * LAYOUT.NODE_HORIZONTAL_SPACING);
    const y = LAYOUT.INITIAL_Y;
    nodes.push(createListNode(nodeId, values[i], x, y, nodeColor, onPointerHover));
  }

  const edges = createEdgesForList(nodes);
  return { nodes, edges };
};
