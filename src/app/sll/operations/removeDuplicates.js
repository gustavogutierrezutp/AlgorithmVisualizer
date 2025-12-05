import { COLORS, NODE_IDS, ANIMATION, LAYOUT } from '../constants';
import { createEdgesForList, createHeadPointerEdge, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Removes duplicate values from the linked list
 * Uses a Set to track seen values - O(n) time, O(n) space
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<void>}
 */
export async function removeDuplicates(context) {
  const { state, setState, reactFlowInstance } = context;
  const existingNodes = [...state.nodes];
  const listNodes = getListNodes(existingNodes);

  if (listNodes.length === 0) {
    console.log('List is empty');
    return;
  }

  const seenValues = new Set();
  const nodesToRemove = [];
  let duplicatesCount = 0;

  // Traverse and identify duplicates
  for (let i = 0; i < listNodes.length; i++) {
    const currentNode = listNodes[i];
    const value = parseInt(currentNode.data.label);

    if (seenValues.has(value)) {
      // This is a duplicate - mark for removal
      nodesToRemove.push(currentNode.id);
      duplicatesCount++;

      // Highlight duplicate in red
      const highlightedNodes = existingNodes.map(node =>
        node.id === currentNode.id
          ? {
              ...node,
              style: {
                ...node.style,
                background: '#EF4444', // Red for duplicate
                border: '3px solid #DC2626',
              },
              data: {
                ...node.data,
                label: `${node.data.label} ✗`
              }
            }
          : node
      );

      setState({ nodes: highlightedNodes, edges: state.edges });
      await sleep(state.speed);
    } else {
      // First occurrence - add to set and highlight in green
      seenValues.add(value);

      const highlightedNodes = existingNodes.map(node =>
        node.id === currentNode.id
          ? {
              ...node,
              style: {
                ...node.style,
                background: '#22C55E', // Green for kept node
                border: '3px solid #16A34A',
              },
              data: {
                ...node.data,
                label: `${node.data.label} ✓`
              }
            }
          : node.type === 'linkedListNode' && !nodesToRemove.includes(node.id)
          ? {
              ...node,
              style: {
                ...node.style,
                background: COLORS.NODE_DEFAULT,
                border: '2px solid #333',
              },
              data: {
                ...node.data,
                label: node.data.label.toString().replace(' ✓', '').replace(' ✗', '')
              }
            }
          : node
      );

      setState({ nodes: highlightedNodes, edges: state.edges });
      await sleep(state.speed);
    }
  }

  // If no duplicates found, reset and return
  if (nodesToRemove.length === 0) {
    const resetNodes = existingNodes.map(node =>
      node.type === 'linkedListNode'
        ? {
            ...node,
            style: {
              ...node.style,
              background: COLORS.NODE_DEFAULT,
              border: '2px solid #333',
            },
            data: {
              ...node.data,
              label: node.data.label.toString().replace(' ✓', '')
            }
          }
        : node
    );

    setState({ nodes: resetNodes, edges: state.edges });
    await sleep(state.speed);
    console.log('No duplicates found');
    return;
  }

  // Remove all duplicate nodes
  const pointerNodes = getPointerNodes(existingNodes);
  const remainingListNodes = listNodes.filter(node => !nodesToRemove.includes(node.id));

  // Clean up labels
  const cleanedListNodes = remainingListNodes.map(node => ({
    ...node,
    style: {
      ...node.style,
      background: COLORS.NODE_DEFAULT,
      border: '2px solid #333',
    },
    data: {
      ...node.data,
      label: node.data.label.toString().replace(' ✓', '').replace(' ✗', '')
    }
  }));

  const nodes = [...pointerNodes, ...cleanedListNodes];

  // Rebuild edges
  let edges = createEdgesForList(cleanedListNodes);

  // Update Head Pointer
  const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
  if (headPointerEdge && cleanedListNodes.length > 0) {
    edges.push(headPointerEdge);
  }

  // Update Tail Pointer
  if (cleanedListNodes.length > 0) {
    const newTail = cleanedListNodes[cleanedListNodes.length - 1];
    const tailPointerIndex = nodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
    if (tailPointerIndex !== -1) {
      nodes[tailPointerIndex] = {
        ...nodes[tailPointerIndex],
        position: getTailPointerPosition(newTail)
      };
      edges.push(createTailPointerEdge(newTail.id));
    }
  }

  setState({ nodes, edges }, () => {
    if (reactFlowInstance) {
      setTimeout(() => {
        reactFlowInstance.fitView({
          duration: ANIMATION.FIT_VIEW_DURATION,
          padding: cleanedListNodes.length === 0 ? LAYOUT.FIT_VIEW_PADDING_LARGE : LAYOUT.FIT_VIEW_PADDING
        });
      }, ANIMATION.FIT_VIEW_DELAY);
    }
  });
  await sleep(state.speed);

  console.log(`Removed ${duplicatesCount} duplicate node(s)`);
}
