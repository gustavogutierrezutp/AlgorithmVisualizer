import { useCallback, useEffect } from 'react';
import { driver } from "driver.js";
import { LAYOUT, ANIMATION, INITIAL_STATE, NODE_IDS } from '../constants';
import { createCircleNode } from '../utils/nodeFactory';
import { createInitialList, createListFromSequence } from '../utils/listHelpers';
import { getPointerNodes } from '../utils/nodeFilters';
import { NodeSetStateAction, EdgeSetStateAction } from '@/types/common';

/**
 * Custom hook to handle list initialization, pointers, and tour
 */
export function useListInitialization({
    nodes,
    nodeColor,
    setNodes,
    setEdges,
    reactFlowInstance,
    handlePointerHover,
    handleCircleNodeLabelChange,
    updatePointerPositions
}: {
    nodes: Node[];
    nodeColor: string;
    setNodes: NodeSetStateAction;
    setEdges: EdgeSetStateAction;
    reactFlowInstance: React.RefObject<ReactFlowInstance | null>;
    handlePointerHover: (nodeId: string | null) => void;
    handleCircleNodeLabelChange: (nodeId: string, newLabel: string) => void;
    updatePointerPositions: (nodes: Node[], edges: Edge[]) => { nodes: Node[]; edges: Edge[] };
}) {
    const startTour = useCallback(() => {
        const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous', 'close'],
            steps: [
                {
                    element: '#sll-navbar',
                    popover: {
                        title: 'Bienvenido a DSViz',
                        description: 'Esta es una herramienta interactiva para visualizar listas enlazadas. Te guiaré por las principales funciones.',
                        side: "bottom",
                        align: 'start',
                        nextBtnText: 'Siguiente',
                        prevBtnText: 'Anterior'
                    }
                },
                {
                    element: '#list-creation-section',
                    popover: {
                        title: 'Creación de Listas',
                        description: 'Aquí puedes crear listas de diferentes formas: vacía, aleatoria o desde una secuencia personalizada.',
                        side: "right",
                        align: 'start',
                        nextBtnText: 'Siguiente',
                        prevBtnText: 'Anterior'
                    }
                },
                {
                    element: '#operations-section',
                    popover: {
                        title: 'Operaciones',
                        description: 'Selecciona y ejecuta operaciones como insertar, eliminar, recorrer y revertir la lista.',
                        side: "right",
                        align: 'start',
                        nextBtnText: 'Siguiente',
                        prevBtnText: 'Anterior'
                    }
                },
                {
                    element: '#display-options-section',
                    popover: {
                        title: 'Opciones de Visualización',
                        description: 'Personaliza la velocidad de animación, colores de nodos y resalta cabeza/cola de la lista.',
                        side: "right",
                        align: 'start',
                        nextBtnText: 'Siguiente',
                        prevBtnText: 'Anterior'
                    }
                },
                {
                    element: '#canvas-area',
                    popover: {
                        title: 'Área de Visualización',
                        description: 'Los nodos de la lista aparecen aquí. Puedes arrastrarlos, seleccionar múltiples nodos dibujando un rectángulo, y hacer zoom/pan.',
                        side: "left",
                        align: 'center',
                        nextBtnText: 'Siguiente',
                        prevBtnText: 'Anterior'
                    }
                },
                {
                    popover: {
                        title: '¡Listo!',
                        description: 'Ahora estás listo para explorar las listas enlazadas. Puedes volver a ver este tutorial en cualquier momento.',
                        doneBtnText: 'Cerrar'
                    }
                }
            ],
            onDestroyStarted: () => {
                localStorage.setItem('sll-tour-completed', 'true');
                driverObj.destroy();
            },
        });

        driverObj.drive();
    }, []);

    const initializePointers = useCallback(() => {
        const headPointerNode = createCircleNode(
            NODE_IDS.POINTER_HEAD,
            'H',
            LAYOUT.INITIAL_X,
            0,
            handlePointerHover,
            handleCircleNodeLabelChange
        );

        const tailPointerNode = createCircleNode(
            NODE_IDS.POINTER_TAIL,
            'T',
            LAYOUT.INITIAL_X,
            LAYOUT.POINTER_VERTICAL_OFFSET * 2,
            handlePointerHover,
            handleCircleNodeLabelChange
        );

        setNodes((prevNodes: Node[]) => [headPointerNode, tailPointerNode, ...prevNodes]);
    }, [handlePointerHover, handleCircleNodeLabelChange, setNodes]);

    const initializeList = useCallback((listCount: number) => {
        const { nodes: newNodes, edges: newEdges } = createInitialList(listCount, handlePointerHover, nodeColor);
        const pointerNodes = nodes ? getPointerNodes(nodes) : [];
        const allNodes = [...pointerNodes, ...newNodes];

        const updatedData = updatePointerPositions(allNodes, newEdges);

        setNodes(updatedData.nodes);
        setEdges(updatedData.edges);

        if (reactFlowInstance.current) {
            setTimeout(() => {
                reactFlowInstance.current!.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
            }, ANIMATION.FIT_VIEW_DELAY);
        }
    }, [handlePointerHover, nodeColor, nodes, updatePointerPositions, setNodes, setEdges, reactFlowInstance]);

    const handleCreateFromSequence = useCallback((sequence: string) => {
        try {
            const values = JSON.parse(sequence);
            if (!Array.isArray(values)) {
                alert('Please enter a valid JSON array');
                return;
            }
            const { nodes: newNodes, edges: newEdges } = createListFromSequence(values, handlePointerHover, nodeColor);
            const pointerNodes = nodes ? getPointerNodes(nodes) : [];
            const allNodes = [...pointerNodes, ...newNodes];

            const updatedData = updatePointerPositions(allNodes, newEdges);

            setNodes(updatedData.nodes);
            setEdges(updatedData.edges);

            if (reactFlowInstance.current) {
                setTimeout(() => {
                    reactFlowInstance.current!.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
                }, 100);
            }
        } catch (error) {
            alert('Invalid JSON format. Please enter an array like [1, 2, 3]');
        }
    }, [handlePointerHover, nodeColor, nodes, updatePointerPositions, setNodes, setEdges, reactFlowInstance]);

    // Initialize on mount
    useEffect(() => {
        const initialize = () => {
            initializeList(INITIAL_STATE.COUNT);
            initializePointers();

            const hasSeenTour = localStorage.getItem('sll-tour-completed');
            if (!hasSeenTour) {
                setTimeout(() => startTour(), 1000);
            }
        };

        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Intentionally empty - only run once on mount

    return {
        initializeList,
        initializePointers,
        startTour,
        handleCreateFromSequence
    };
}

import { Node, Edge } from '@xyflow/react';
import { ReactFlowInstance } from '@xyflow/react';