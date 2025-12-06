import { useCallback } from 'react';
import * as operations from '../operations';

/**
 * Custom hook to manage all list operations
 * Handles context creation and wraps all operation functions
 */
export function useListOperations({
    nodes,
    edges,
    speed,
    newNodeColor,
    iterateColor,
    setNodes,
    setEdges,
    reactFlowInstance,
    handlePointerHover
}) {
    // Helper to create operation context
    const createOperationContext = useCallback((includeNewNodeColor = false, includeReactFlow = false) => {
        const stateData = { nodes, edges, speed, iterateColor };
        if (includeNewNodeColor) stateData.newNodeColor = newNodeColor;

        const context = {
            state: stateData,
            setState: (updates, callback) => {
                if (typeof updates === 'function') {
                    setNodes(currentNodes => {
                        setEdges(currentEdges => {
                            updates({ nodes: currentNodes, edges: currentEdges });
                            if (callback) callback();
                            return currentEdges;
                        });
                        return currentNodes;
                    });
                } else {
                    if (updates.nodes !== undefined) setNodes(updates.nodes);
                    if (updates.edges !== undefined) setEdges(updates.edges);
                    if (callback) callback();
                }
            }
        };

        if (includeReactFlow) {
            context.reactFlowInstance = reactFlowInstance.current;
            context.handlePointerHover = handlePointerHover;
        }

        return context;
    }, [nodes, edges, speed, newNodeColor, iterateColor, setNodes, setEdges, reactFlowInstance, handlePointerHover]);

    // Operation wrapper functions
    const insertAtHead = useCallback(async (value) => {
        await operations.insertAtHead(createOperationContext(true, true), value);
    }, [createOperationContext]);

    const deleteAtHead = useCallback(async () => {
        await operations.deleteAtHead(createOperationContext());
    }, [createOperationContext]);

    const insertAtTail = useCallback(async (value) => {
        await operations.insertAtTail(createOperationContext(true, true), value);
    }, [createOperationContext]);

    const insertAtTailO1 = useCallback(async (value) => {
        await operations.insertAtTailO1(createOperationContext(true, true), value);
    }, [createOperationContext]);

    const deleteAtTail = useCallback(async () => {
        await operations.deleteAtTail(createOperationContext());
    }, [createOperationContext]);

    const traverseList = useCallback(async () => {
        await operations.traverseList(createOperationContext());
    }, [createOperationContext]);

    const reverseList = useCallback(async () => {
        await operations.reverseList(createOperationContext());
    }, [createOperationContext]);

    const insertAtPosition = useCallback(async (value, position) => {
        await operations.insertAtPosition(createOperationContext(true, true), value, position);
    }, [createOperationContext]);

    const getLength = useCallback(async () => {
        return await operations.getLength(createOperationContext());
    }, [createOperationContext]);

    const searchValue = useCallback(async (value) => {
        return await operations.searchValue(createOperationContext(), value);
    }, [createOperationContext]);

    const findMiddle = useCallback(async () => {
        return await operations.findMiddle(createOperationContext());
    }, [createOperationContext]);

    const deleteAtPosition = useCallback(async (position) => {
        await operations.deleteAtPosition(createOperationContext(false, true), position);
    }, [createOperationContext]);

    const removeDuplicates = useCallback(async () => {
        await operations.removeDuplicates(createOperationContext(false, true));
    }, [createOperationContext]);

    const accessFront = useCallback(async () => {
        await operations.accessFront(createOperationContext());
    }, [createOperationContext]);

    const accessBack = useCallback(async () => {
        await operations.accessBack(createOperationContext());
    }, [createOperationContext]);

    const accessNth = useCallback(async (position) => {
        return await operations.accessNth(createOperationContext(), position);
    }, [createOperationContext]);

    return {
        insertAtHead,
        deleteAtHead,
        insertAtTail,
        insertAtTailO1,
        deleteAtTail,
        traverseList,
        reverseList,
        insertAtPosition,
        getLength,
        searchValue,
        findMiddle,
        deleteAtPosition,
        removeDuplicates,
        accessFront,
        accessBack,
        accessNth
    };
}
