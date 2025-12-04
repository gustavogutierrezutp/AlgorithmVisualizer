import { NODE_STYLE } from '../constants';

/**
 * Creates a linked list node with the given parameters
 */
export const createListNode = (id, value, x, y, backgroundColor, onPointerHover) => ({
  id,
  type: 'linkedListNode',
  data: {
    label: value.toString(),
    nodeId: id,
    onPointerHover,
  },
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

/**
 * Creates a circular pointer node
 */
export const createCircleNode = (id, label, x, y, onPointerHover, onLabelChange) => ({
  id,
  type: 'circleNode',
  data: {
    label,
    nodeId: id,
    onPointerHover,
    onLabelChange,
  },
  position: { x, y },
});
