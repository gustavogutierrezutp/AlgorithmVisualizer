import { LAYOUT, COLORS } from '../constants';
import { createListNode } from './nodeFactory';
import { createEdgesForList } from './edgeFactory';

/**
 * Creates an initial list with random values
 * @param {number} count - Number of nodes to create
 * @param {Function} onPointerHover - Hover handler for nodes
 * @param {string} nodeColor - Color for the nodes
 * @returns {Object} Object containing nodes and edges arrays
 */
export const createInitialList = (count, onPointerHover, nodeColor = COLORS.NODE_DEFAULT) => {
    const nodes = [];

    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 100);
        const nodeId = `node-${i}`;
        const x = LAYOUT.INITIAL_X + (i * LAYOUT.NODE_HORIZONTAL_SPACING);
        const y = LAYOUT.INITIAL_Y;
        nodes.push(createListNode(nodeId, value, x, y, nodeColor, onPointerHover));
    }

    const edges = createEdgesForList(nodes);
    return { nodes, edges };
}

/**
 * Creates a list from a sequence of values
 * @param {Array} values - Array of values to create nodes from
 * @param {Function} onPointerHover - Hover handler for nodes
 * @param {string} nodeColor - Color for the nodes
 * @returns {Object} Object containing nodes and edges arrays
 */
export const createListFromSequence = (values, onPointerHover, nodeColor = COLORS.NODE_DEFAULT) => {
    const nodes = [];

    for (let i = 0; i < values.length; i++) {
        const nodeId = `node-${i}`;
        const x = LAYOUT.INITIAL_X + (i * LAYOUT.NODE_HORIZONTAL_SPACING);
        const y = LAYOUT.INITIAL_Y;
        nodes.push(createListNode(nodeId, values[i], x, y, nodeColor, onPointerHover));
    }

    const edges = createEdgesForList(nodes);
    return { nodes, edges };
}
