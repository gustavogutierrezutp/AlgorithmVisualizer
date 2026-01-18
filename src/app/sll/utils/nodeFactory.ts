import { ListNode, CircleNode, ListNodeData, CircleNodeData } from '../../../types/linked-list';
import { NODE_STYLE } from '../constants';

export const createListNode = (
  id: string,
  value: string | number,
  x: number,
  y: number,
  backgroundColor: string,
  onPointerHover: (nodeId: string | null) => void
): ListNode => ({
  id,
  type: 'linkedListNode',
  data: {
    label: value.toString(),
    nodeId: id,
    onPointerHover,
  } as ListNodeData & Record<string, unknown>,
  position: { x, y },
  style: {
    background: backgroundColor,
    color: NODE_STYLE.COLOR,
    border: NODE_STYLE.BORDER,
    borderRadius: NODE_STYLE.BORDER_RADIUS,
    padding: NODE_STYLE.PADDING,
    fontSize: NODE_STYLE.FONT_SIZE,
    fontWeight: NODE_STYLE.FONT_WEIGHT,
  }
});

export const createCircleNode = (
  id: string,
  label: string,
  x: number,
  y: number,
  onPointerHover: (nodeId: string | null) => void,
  onLabelChange: (nodeId: string, newLabel: string) => void
): CircleNode => ({
  id,
  type: 'circleNode',
  data: {
    label,
    nodeId: id,
    onPointerHover,
    onLabelChange,
  } as CircleNodeData & Record<string, unknown>,
  position: { x, y },
});
