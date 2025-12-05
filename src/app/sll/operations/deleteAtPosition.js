import { COLORS, NODE_IDS, ANIMATION, LAYOUT } from '../constants';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getHeadPointerPosition, getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Deletes a node at a specific position in the linked list
 * @param {Object} context - Component context with state and methods
 * @param {number} position - Zero-based index position to delete
 * @returns {Promise<void>}
 */
export async function deleteAtPosition(context, position) {
  const { state, setState, reactFlowInstance } = context;
  const existingNodes = [...state.nodes];
  const listNodes = getListNodes(existingNodes);

  // Validate position
  if (position < 0 || position >= listNodes.length) {
    console.error(`Invalid position ${position}. Must be between 0 and ${listNodes.length - 1}`);
    return;
  }

  // Handle edge case: deleting at position 0 (head)
  if (position === 0) {
    const pointerNodes = getPointerNodes(existingNodes);
    const remainingListNodes = listNodes.slice(1);
    const nodes = [...pointerNodes, ...remainingListNodes];

    // Rebuild edges for linked list nodes
    let edges = createEdgesForList(remainingListNodes);

    // Update Head Pointer
    const headPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
    if (headPointerIndex !== -1 && remainingListNodes.length > 0) {
      const newHead = remainingListNodes[0];
      nodes[headPointerIndex] = {
        ...nodes[headPointerIndex],
        position: getHeadPointerPosition(newHead)
      };
      edges.push(createHeadPointerEdge(newHead.id));
    }

    // Update Tail Pointer edge (tail stays the same unless list becomes empty)
    if (remainingListNodes.length > 0) {
      const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
      if (tailPointerEdge) {
        edges.push(tailPointerEdge);
      }
    }

    setState({ nodes, edges }, () => {
      if (reactFlowInstance) {
        setTimeout(() => {
          reactFlowInstance.fitView({
            duration: ANIMATION.FIT_VIEW_DURATION,
            padding: remainingListNodes.length === 0 ? LAYOUT.FIT_VIEW_PADDING_LARGE : LAYOUT.FIT_VIEW_PADDING
          });
        }, ANIMATION.FIT_VIEW_DELAY);
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

  // Highlight the node to be deleted
  const nodeToDelete = listNodes[position];
  const highlightedForDeletion = existingNodes.map(node =>
    node.id === nodeToDelete.id
      ? {
          ...node,
          style: {
            ...node.style,
            background: '#EF4444', // Red color for deletion
            border: '3px solid #DC2626',
          }
        }
      : node.type === 'linkedListNode'
      ? {
          ...node,
          style: {
            ...node.style,
            background: COLORS.NODE_DEFAULT,
            border: '2px solid #333',
          }
        }
      : node
  );

  setState({ nodes: highlightedForDeletion, edges: state.edges });
  await sleep(state.speed);

  // Remove the node at position
  const pointerNodes = getPointerNodes(existingNodes);
  const updatedListNodes = listNodes.filter((_, idx) => idx !== position);
  const nodes = [...pointerNodes, ...updatedListNodes];

  // Rebuild edges
  let edges = createEdgesForList(updatedListNodes);

  // Update Head Pointer (stays the same unless we deleted position 0, already handled)
  const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
  if (headPointerEdge && updatedListNodes.length > 0) {
    edges.push(headPointerEdge);
  }

  // Update Tail Pointer if we deleted the last node
  if (position === listNodes.length - 1 && updatedListNodes.length > 0) {
    const newTail = updatedListNodes[updatedListNodes.length - 1];
    const tailPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
    if (tailPointerIndex !== -1) {
      nodes[tailPointerIndex] = {
        ...nodes[tailPointerIndex],
        position: getTailPointerPosition(newTail)
      };
      edges.push(createTailPointerEdge(newTail.id));
    }
  } else if (updatedListNodes.length > 0) {
    const tailPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_TAIL);
    if (tailPointerEdge) {
      edges.push(tailPointerEdge);
    }
  }

  setState({ nodes, edges }, () => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          duration: ANIMATION.FIT_VIEW_DURATION,
          padding: updatedListNodes.length === 0 ? LAYOUT.FIT_VIEW_PADDING_LARGE : LAYOUT.FIT_VIEW_PADDING
        });
      }, ANIMATION.FIT_VIEW_DELAY);
    }
  });
  await sleep(state.speed);
}
