import { LAYOUT, ANIMATION, COLORS, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes } from '../utils/nodeFilters';
import { getHeadPointerPosition, getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Inserts a new node at a specific position in the linked list
 * @param {Object} context - Component context with state and methods
 * @param {*} value - Value to insert
 * @param {number} position - Zero-based index position to insert at
 * @returns {Promise<void>}
 */
export async function insertAtPosition(context, value, position) {
  const { state, setState, reactFlowInstance, handlePointerHover } = context;
  const existingNodes = [...state.nodes];
  const listNodes = getListNodes(existingNodes);

  // Validate position
  if (position < 0 || position > listNodes.length) {
    console.error(`Invalid position ${position}. Must be between 0 and ${listNodes.length}`);
    return;
  }

  // Handle edge case: inserting at position 0 (head)
  if (position === 0) {
    const firstNode = listNodes[0];
    const fixedDistance = LAYOUT.NODE_HORIZONTAL_SPACING;
    const newNodeX = firstNode ? firstNode.position.x - fixedDistance : 50;
    const newNodeY = firstNode ? firstNode.position.y : 100;

    const newNodeId = `node-${Date.now()}`;
    const newNode = createListNode(
      newNodeId,
      value,
      newNodeX,
      newNodeY,
      state.newNodeColor,
      handlePointerHover
    );

    const nodes = existingNodes.map(n => n);
    const firstListNodeIndex = nodes.findIndex(n => n.type === 'linkedListNode');
    if (firstListNodeIndex !== -1) {
      nodes.splice(firstListNodeIndex, 0, newNode);
    } else {
      nodes.push(newNode);
    }

    const updatedListNodes = getListNodes(nodes);
    let edges = createEdgesForList(updatedListNodes);

    // Update Head Pointer
    const headPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
    if (headPointerIndex !== -1) {
      nodes[headPointerIndex] = {
        ...nodes[headPointerIndex],
        position: getHeadPointerPosition(newNode)
      };
      edges.push(createHeadPointerEdge(newNodeId));
    }

    // Update Tail Pointer if list was empty
    if (listNodes.length === 0) {
      const tailPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
      if (tailPointerIndex !== -1) {
        nodes[tailPointerIndex] = {
          ...nodes[tailPointerIndex],
          position: getTailPointerPosition(newNode)
        };
        edges.push(createTailPointerEdge(newNodeId));
      }
    } else {
      const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
      if (tailPointerEdge) {
        edges.push(tailPointerEdge);
      }
    }

    setState({ nodes, edges }, () => {
      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
        }, 100);
      }
    });
    await sleep(state.speed);
    return;
  }

  // Traverse to position-1 with highlighting
  for (let i = 0; i < position; i++) {
    const currentNode = listNodes[i];
    const highlightedNodes = existingNodes.map(node =>
      node.id === currentNode.id
        ? {
            ...node,
            style: {
              ...node.style,
              background: state.iterateColor,
              border: `3px solid ${state.iterateColor}`,
            }
          }
        : node
    );

    setState({ nodes: highlightedNodes, edges: state.edges });
    await sleep(state.speed);
  }

  // Create new node at position
  const prevNode = listNodes[position - 1];
  const nextNode = listNodes[position];

  const fixedDistance = LAYOUT.NODE_HORIZONTAL_SPACING;
  const newNodeX = nextNode
    ? prevNode.position.x + fixedDistance
    : prevNode.position.x + fixedDistance;
  const newNodeY = prevNode.position.y;

  const newNodeId = `node-${Date.now()}`;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor,
    handlePointerHover
  );

  // Insert new node into nodes array
  const nodes = existingNodes.map(n => ({
    ...n,
    style: n.type === 'linkedListNode' ? { ...n.style, background: COLORS.NODE_DEFAULT, border: '2px solid #333' } : n.style
  }));

  const insertIndex = nodes.findIndex(n => n.id === listNodes[position]?.id);
  if (insertIndex !== -1) {
    nodes.splice(insertIndex, 0, newNode);
  } else {
    // Insert at end
    const lastListNodeIndex = nodes.findIndex(n => n.id === listNodes[listNodes.length - 1].id);
    nodes.splice(lastListNodeIndex + 1, 0, newNode);
  }

  // Rebuild edges
  const updatedListNodes = getListNodes(nodes);
  let edges = createEdgesForList(updatedListNodes);

  // Preserve pointer edges
  const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
  if (headPointerEdge) {
    edges.push(headPointerEdge);
  }

  // Update Tail Pointer if inserting at end
  if (position === listNodes.length) {
    const tailPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
    if (tailPointerIndex !== -1) {
      nodes[tailPointerIndex] = {
        ...nodes[tailPointerIndex],
        position: getTailPointerPosition(newNode)
      };
      edges.push(createTailPointerEdge(newNodeId));
    }
  } else {
    const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
    if (tailPointerEdge) {
      edges.push(tailPointerEdge);
    }
  }

  setState({ nodes, edges }, () => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
      }, 100);
    }
  });
  await sleep(state.speed);
}
