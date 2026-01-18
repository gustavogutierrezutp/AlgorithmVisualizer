import { useCallback } from 'react';
import * as operations from '../operations';
import { ListOperationsParams, ListOperationsReturn } from '../../../types/hooks';
import { Node, Edge } from '@xyflow/react';
import type { OperationContext, NodeEdgeUpdate, StateUpdater } from '../../../types/linked-list';

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
}: ListOperationsParams): ListOperationsReturn {
    // Helper to create operation context
    const createOperationContext = useCallback((
      includeNewNodeColor = false,
      includeReactFlow = false
    ): OperationContext => {
        const stateData = { nodes, edges, speed, iterateColor };
        if (includeNewNodeColor) {
            (stateData as any).newNodeColor = newNodeColor;
        }

        const context: OperationContext = {
            state: stateData as any,
            setState: (updates: NodeEdgeUpdate | StateUpdater, callback?: () => void) => {
                if (typeof updates === 'function') {
                    setNodes((currentNodes: Node[]) => {
                        setEdges((currentEdges: Edge[]) => {
                            (updates as StateUpdater)({ nodes: currentNodes, edges: currentEdges });
                            if (callback) callback();
                            return currentEdges;
                        });
                        return currentNodes;
                    });
                } else {
                    if ((updates as NodeEdgeUpdate).nodes !== undefined) setNodes((updates as NodeEdgeUpdate).nodes!);
                    if ((updates as NodeEdgeUpdate).edges !== undefined) setEdges((updates as NodeEdgeUpdate).edges!);
                    if (callback) callback();
                }
            },
            handlePointerHover,
        };

        if (includeReactFlow && reactFlowInstance.current) {
            context.reactFlowInstance = reactFlowInstance.current;
        }

        return context;
    }, [nodes, edges, speed, newNodeColor, iterateColor, setNodes, setEdges, reactFlowInstance, handlePointerHover]);

    // Operation wrapper functions
    const insertAtHead = useCallback(async (value: number) => {
        await operations.insertAtHead(createOperationContext(true, true), value);
    }, [createOperationContext]);

    const deleteAtHead = useCallback(async () => {
        await operations.deleteAtHead(createOperationContext());
    }, [createOperationContext]);

    const insertAtTail = useCallback(async (value: number) => {
        await operations.insertAtTail(createOperationContext(true, true), value);
    }, [createOperationContext]);

    const insertAtTailO1 = useCallback(async (value: number) => {
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

    const insertAtPosition = useCallback(async (value: number, position: number) => {
        await operations.insertAtPosition(createOperationContext(true, true), value, position);
    }, [createOperationContext]);

    const getLength = useCallback(async () => {
        return await operations.getLength(createOperationContext());
    }, [createOperationContext]);

    const searchValue = useCallback(async (value: number) => {
        return await operations.searchValue(createOperationContext(), value);
    }, [createOperationContext]);

    const findMiddle = useCallback(async () => {
        return await operations.findMiddle(createOperationContext());
    }, [createOperationContext]);

    const deleteAtPosition = useCallback(async (position: number) => {
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

    const accessNth = useCallback(async (position: number) => {
        return (await operations.accessNth(createOperationContext(), position)) as any;
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
    } as any;
}
