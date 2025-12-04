import { MarkerType } from '@xyflow/react';
import { LAYOUT, COLORS, EDGE_STYLE, NODE_STYLE } from '../constants';
import { createEdgesForList } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes, getHeadNode, getTailNode } from '../utils/nodeFilters';
import { updatePointers, createPointerEdges } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Reverses the linked list by reversing all pointers
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<void>}
 */
export async function reverseList(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length <= 1) return;

  const pointerNodes = getPointerNodes(state.nodes);
  let prev = null;
  let current = 0;
  let edges = [...state.edges];

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
            background: listIndex === current ? state.iterateColor : (listIndex === prev ? COLORS.NODE_NEW : node.style.background),
            border: listIndex === current ? NODE_STYLE.BORDER_HIGHLIGHTED : NODE_STYLE.BORDER,
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

  // Step 2: Re-arrange nodes to reflect new order (Head is now the last processed node)
  await sleep(state.speed);

  const reversedListNodes = [...listNodes].reverse().map((node, idx) => ({
    ...node,
    position: { x: LAYOUT.INITIAL_X + (idx * LAYOUT.NODE_HORIZONTAL_SPACING), y: LAYOUT.INITIAL_Y },
    style: {
      ...node.style,
      background: node.style.background,
      border: NODE_STYLE.BORDER,
    }
  }));

  // Re-create standard edges for the new order
  let newEdges = createEdgesForList(reversedListNodes);

  // Update pointer positions and edges
  const allNodes = [...pointerNodes, ...reversedListNodes];
  const headNode = getHeadNode(reversedListNodes);
  const tailNode = getTailNode(reversedListNodes);

  const updatedNodes = updatePointers(allNodes, headNode, tailNode);
  const updatedEdges = [...newEdges, ...createPointerEdges(reversedListNodes)];

  setState({ nodes: updatedNodes, edges: updatedEdges });
}
