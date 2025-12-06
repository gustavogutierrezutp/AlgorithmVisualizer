import { LAYOUT, NODE_IDS } from '../constants';
import { createListNode } from '../utils/nodeFactory';
import { createListEdge, createTailPointerEdge, createHeadPointerEdge } from '../utils/edgeFactory';
import { getListNodes } from '../utils/nodeFilters';
import { getTailPointerPosition, getHeadPointerPosition } from '../utils/pointerHelpers';
import { sleep } from '../utils/helpers';

/**
 * Inserts a new node at the tail of the linked list (with O(n) traversal animation)
 * @param {Object} context - Component context with state and methods
 * @param {*} value - Value to insert
 * @returns {Promise<void>}
 */
export async function insertAtTail(context, value) {
  const { state, setState, handlePointerHover } = context;
  const nodes = [...state.nodes];
  let edges = [...state.edges];

  // Filter to get only linked list nodes for traversal
  const listNodes = getListNodes(nodes);

  // Traverse to the end
  for (let i = 0; i < listNodes.length; i++) {
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

  // Add new node at same Y as last list node, fixed distance in X
  const lastNode = listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;
  const fixedDistance = LAYOUT.NODE_HORIZONTAL_SPACING;
  const newNodeX = lastNode ? lastNode.position.x + fixedDistance : 50;
  const newNodeY = lastNode ? lastNode.position.y : 100;

  const newNodeId = `node-${Date.now()}`;
  const newNode = createListNode(
    newNodeId,
    value,
    newNodeX,
    newNodeY,
    state.newNodeColor,
    handlePointerHover
  );

  const newNodes = [...resetNodes, newNode];

  // Add edge if list was not empty
  if (lastNode) {
    edges = edges.filter(e => !e.id.startsWith('edge-') || e.source !== lastNode.id || e.target.startsWith('node-'));
    edges.push(createListEdge(lastNode.id, newNodeId, `${lastNode.id}-${newNodeId}`));
  }

  // Update Tail Pointer
  const tailPointerIndex = newNodes.findIndex(n => n.id === NODE_IDS.POINTER_TAIL);
  if (tailPointerIndex !== -1) {
    newNodes[tailPointerIndex] = {
      ...newNodes[tailPointerIndex],
      position: getTailPointerPosition(newNode)
    };

    // Remove old tail pointer edge and add new one
    edges = edges.filter(e => e.source !== NODE_IDS.POINTER_TAIL);
    edges.push(createTailPointerEdge(newNodeId));
  }

  // Update Head Pointer if list was empty
  if (listNodes.length === 0) {
    const headPointerIndex = newNodes.findIndex(n => n.id === NODE_IDS.POINTER_HEAD);
    if (headPointerIndex !== -1) {
      newNodes[headPointerIndex] = {
        ...newNodes[headPointerIndex],
        position: getHeadPointerPosition(newNode)
      };
      edges.push(createHeadPointerEdge(newNodeId));
    }
  }

  setState({ nodes: newNodes, edges });
  await sleep(state.speed);
}
