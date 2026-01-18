import { useMemo } from 'react';
import { COLORS, EDGE_STYLE } from '../constants';
import { getListNodes, removePointerNodes } from '../utils/nodeFilters';
import { removePointerEdges } from '../utils/pointerHelpers';
import { Node, Edge } from '@xyflow/react';

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
            // @ts-ignore - spread type issue with complex edge types
            const newEdge: Edge = {
                ...edge,
                animated: isHighlighted ? true : edge.animated,
                style: {
                    strokeWidth: isHighlighted ? EDGE_STYLE.STROKE_WIDTH_HIGHLIGHTED : EDGE_STYLE.STROKE_WIDTH_DEFAULT,
                    stroke: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
                },
                markerEnd: {
                    // @ts-ignore - markerEnd type issue
                    ...(edge.markerEnd as any),
                    color: isHighlighted ? iterateColor : COLORS.EDGE_DEFAULT,
                } as any,
            };
            return newEdge;
        });

        return { highlightedNodes: processedNodes, highlightedEdges: processedEdges } as any;
    }, [nodes, edges, showPointers, highlightHead, highlightTail, hoveredNodeId, iterateColor]);

    return result;
}
