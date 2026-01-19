import { useMemo } from 'react';
import { COLORS, EDGE_STYLE } from '../constants';
import { getListNodes, removePointerNodes } from '../utils/nodeFilters';
import { removePointerEdges } from '../utils/pointerHelpers';
import { Node, Edge, EdgeMarker } from '@xyflow/react';

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
}: {
    nodes: Node[];
    edges: Edge[];
    showPointers: boolean;
    highlightHead: boolean;
    highlightTail: boolean;
    hoveredNodeId: string | null;
    iterateColor: string;
}): {
    highlightedNodes: Node[];
    highlightedEdges: Edge[];
} {
    const result = useMemo(() => {
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
                const nodeStyle = node.style || {};
                return {
                    ...node,
                    style: {
                        background: COLORS.HEAD_HIGHLIGHT,
                        border: `3px solid ${COLORS.HEAD_BORDER}`,
                        ...nodeStyle,
                    }
                };
            }
            if (listIndex === listNodes.length - 1 && highlightTail && node.type === 'linkedListNode') {
                const nodeStyle = node.style || {};
                return {
                    ...node,
                    style: {
                        background: COLORS.TAIL_HIGHLIGHT,
                        border: `3px solid ${COLORS.TAIL_BORDER}`,
                        ...nodeStyle,
                    }
                };
            }
            return node;
        });

        // Apply highlighting to edges based on hovered node
        const processedEdges = edgesToRender.map(edge => {
            const isHighlighted = hoveredNodeId && edge.source === hoveredNodeId;

            // Handle markerEnd which can be string or object or undefined
            let currentMarker = typeof edge.markerEnd === 'object' ? edge.markerEnd : undefined;

            // If we need to update color, we ensure we have an object to work with
            const newMarker: EdgeMarker | undefined = currentMarker ? {
                ...currentMarker,
                color: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
            } : undefined;

            const newEdge: Edge = {
                ...edge,
                animated: isHighlighted ? true : edge.animated,
                style: {
                    strokeWidth: isHighlighted ? EDGE_STYLE.STROKE_WIDTH_HIGHLIGHTED : EDGE_STYLE.STROKE_WIDTH_DEFAULT,
                    stroke: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
                },
                markerEnd: newMarker
            };
            return newEdge;
        });

        return { highlightedNodes: processedNodes, highlightedEdges: processedEdges };
    }, [nodes, edges, showPointers, highlightHead, highlightTail, hoveredNodeId, iterateColor]);

    return result;
}
