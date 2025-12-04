import { useMemo } from 'react';
import { COLORS, EDGE_STYLE } from '../constants';
import { getListNodes, removePointerNodes } from '../utils/nodeFilters';
import { removePointerEdges } from '../utils/pointerHelpers';

/**
 * Custom hook to handle list visualization (highlighting, filtering)
 * Returns processed nodes and edges ready for rendering
 */
export function useListVisualization({
    nodes,
    edges,
    showPointers,
    highlightHead,
    highlightTail,
    hoveredNodeId,
    iterateColor
}) {
    const { highlightedNodes, highlightedEdges } = useMemo(() => {
        // Filter out pointer nodes if showPointers is false
        let nodesToRender = nodes;
        let edgesToRender = edges;

        if (!showPointers) {
            nodesToRender = removePointerNodes(nodes);
            edgesToRender = removePointerEdges(edges);
        }

        // Apply head and tail highlighting
        const listNodes = getListNodes(nodesToRender);
        const processedNodes = nodesToRender.map((node) => {
            const listIndex = listNodes.findIndex(n => n.id === node.id);

            if (listIndex === 0 && highlightHead && node.type === 'linkedListNode') {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: COLORS.HEAD_HIGHLIGHT,
                        border: `3px solid ${COLORS.HEAD_BORDER}`,
                    }
                };
            }
            if (listIndex === listNodes.length - 1 && highlightTail && node.type === 'linkedListNode') {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: COLORS.TAIL_HIGHLIGHT,
                        border: `3px solid ${COLORS.TAIL_BORDER}`,
                    }
                };
            }
            return node;
        });

        // Apply highlighting to edges based on hovered node
        const processedEdges = edgesToRender.map(edge => {
            const isHighlighted = hoveredNodeId && edge.source === hoveredNodeId;
            return {
                ...edge,
                animated: isHighlighted ? true : edge.animated,
                style: {
                    ...edge.style,
                    strokeWidth: isHighlighted ? EDGE_STYLE.STROKE_WIDTH_HIGHLIGHTED : EDGE_STYLE.STROKE_WIDTH_DEFAULT,
                    stroke: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
                },
                markerEnd: {
                    ...edge.markerEnd,
                    color: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
                }
            };
        });

        return {
            highlightedNodes: processedNodes,
            highlightedEdges: processedEdges
        };
    }, [nodes, edges, showPointers, highlightHead, highlightTail, hoveredNodeId, iterateColor]);

    return { highlightedNodes, highlightedEdges };
}
