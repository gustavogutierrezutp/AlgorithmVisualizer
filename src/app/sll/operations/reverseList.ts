import { MarkerType, Node, Edge } from '@xyflow/react';
import { LAYOUT, COLORS, EDGE_STYLE, NODE_STYLE } from '../constants';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes, getHeadNode, getTailNode } from '../utils/nodeFilters';
import { updatePointers, createPointerEdges } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';
import { OperationContext, ListNode } from '../../../types/linked-list';

// Pointer position helpers are imported but used indirectly through other functions
export { getHeadPointerPosition, getTailPointerPosition } from '../utils/pointerHelpers';

/**
 * Reverses the linked list by reversing all pointers
 * @param context - Component context with state and methods
 * @returns Promise<void>
 */
export async function reverseList(context: OperationContext): Promise<void> {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length <= 1) return;

  const pointerNodes = getPointerNodes(state.nodes);
  let prev = 0;
  let current = 0;
  let edges: Edge[] = [...state.edges];

  // Step 1: Visualize pointer reversal
  while (current < listNodes.length) {
    // Highlight current node being processed
    const currentNodes = state.nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          style: {
            ...node.style,
            background: listIndex === current ? state.iterateColor : (listIndex === prev ? COLORS.NODE_NEW : node.style?.background),
            border: listIndex === current ? NODE_STYLE.BORDER_HIGHLIGHTED : node.style?.border,
          }
        };
      }
      return node;
    });
    setState({ nodes: currentNodes });
    await sleep(state.speed);

    // Remove the existing outgoing edge from current node
    const edgeIndex = edges.findIndex(e => e.source === listNodes[current].id);
    if (edgeIndex !== -1) {
      edges.splice(edgeIndex, 1);
      setState({ edges: [...edges] });
      await sleep(state.speed / 2);
    }

    // Add new edge pointing to previous node (if not null)
    if (prev !== null) {
      edges.push({
        id: `edge-rev-${current}`,
        source: listNodes[current].id,
        sourceHandle: 'right',
        target: listNodes[prev].id,
        targetHandle: 'left',
        animated: true,
        type: 'default', // Use default bezier for backward curves to look better
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: EDGE_STYLE.MARKER_WIDTH,
          height: EDGE_STYLE.MARKER_HEIGHT,
          color: state.iterateColor
        },
        style: {
          strokeWidth: EDGE_STYLE.STROKE_WIDTH_REVERSE,
          stroke: state.iterateColor
        }
      });
      setState({ edges: [...edges] });
      await sleep(state.speed);
    }

    prev = current;
    current++;
  }

  // Step 2: Re-arrange nodes to reflect new order (Head is now to last processed node)
  await sleep(state.speed);

  const reversedListNodes: ListNode[] = [...listNodes].reverse().map((node, idx) => ({
    ...node,
    position: { x: LAYOUT.INITIAL_X + (idx * LAYOUT.NODE_HORIZONTAL_SPACING), y: LAYOUT.INITIAL_Y },
    style: {
      ...node.style,
      background: node.style?.background,
      border: node.style?.border || NODE_STYLE.BORDER,
    }
  }));

  // Re-create standard edges for the new order
  let newEdges: Edge[] = createEdgesForList(reversedListNodes);

  // Update pointer positions and edges
  const allNodes: Node[] = [...pointerNodes, ...reversedListNodes];
  const headNode = getHeadNode(reversedListNodes);
  const tailNode = getTailNode(reversedListNodes);

  const updatedNodes = updatePointers(allNodes, headNode, tailNode);
  const updatedEdges: Edge[] = [...newEdges, ...createPointerEdges(reversedListNodes)];

  // Add pointer edges
  if (headNode) updatedEdges.push(createHeadPointerEdge(headNode.id));
  if (tailNode) updatedEdges.push(createTailPointerEdge(tailNode.id));

  setState({ nodes: updatedNodes, edges: updatedEdges });
}
