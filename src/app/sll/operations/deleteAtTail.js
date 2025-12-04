import { NODE_IDS } from '../constants';
import { createEdgesForList, createTailPointerEdge } from '../utils/edgeFactory';
import { getListNodes, getPointerNodes } from '../utils/nodeFilters';
import { getTailPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Deletes the node at the tail of the linked list (with O(n) traversal animation)
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<void>}
 */
export async function deleteAtTail(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);
  if (listNodes.length === 0) return;

  const nodes = [...state.nodes];

  // Traverse to the second to last node
  for (let i = 0; i < listNodes.length - 1; i++) {
    const tempNodes = nodes.map((node) => {
      if (node.type === 'linkedListNode') {
        const listIndex = listNodes.findIndex(n => n.id === node.id);
        return {
          ...node,
          style: {
            ...node.style,
            background: listIndex === i ? state.iterateColor : node.style.background,
          }
        };
      }
      return node;
    });
    setState({ nodes: tempNodes });
    await sleep(state.speed / 2);
  }

  // Reset colors to original
  const resetNodes = nodes.map(node => {
    if (node.type === 'linkedListNode' && node.style) {
      return {
        ...node,
        style: {
          ...node.style,
          background: node.style.background,
        }
      };
    }
    return node;
  });
  setState({ nodes: resetNodes });

  // Remove last list node
  const pointerNodes = getPointerNodes(resetNodes);
  const remainingListNodes = listNodes.slice(0, -1);
  const newNodes = [...pointerNodes, ...remainingListNodes];

  // Rebuild edges for linked list nodes
  let newEdges = createEdgesForList(remainingListNodes);

  // Update Tail Pointer
  const tailPointerIndex = newNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
  if (tailPointerIndex !== -1 && remainingListNodes.length > 0) {
    const newTail = remainingListNodes[remainingListNodes.length - 1];
    newNodes[tailPointerIndex] = {
      ...newNodes[tailPointerIndex],
      position: getTailPointerPosition(newTail)
    };
    newEdges.push(createTailPointerEdge(newTail.id));
  }

  // Update Head Pointer edge (head stays the same unless list becomes empty)
  if (remainingListNodes.length > 0) {
    const headPointerEdge = state.edges.find(e => e.source === NODE_IDS.POINTER_HEAD);
    if (headPointerEdge) {
      newEdges.push(headPointerEdge);
    }
  }

  setState({ nodes: newNodes, edges: newEdges });
  await sleep(state.speed);
}
