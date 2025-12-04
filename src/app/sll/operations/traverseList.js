import { getListNodes } from '../utils/nodeFilters';
import { sleep } from '../utils/helpers';

/**
 * Traverses the linked list and animates each node
 * @param {Object} context - Component context with state and methods
 * @returns {Promise<void>}
 */
export async function traverseList(context) {
  const { state, setState } = context;
  const listNodes = getListNodes(state.nodes);

  for (let i = 0; i < listNodes.length; i++) {
    const nodes = state.nodes.map((node) => {
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
    setState({ nodes });
    await sleep(state.speed);
  }

  // Reset colors to original
  const nodes = state.nodes.map(node => {
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
  setState({ nodes });
}
