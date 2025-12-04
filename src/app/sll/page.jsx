"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { ReactFlow, Background, Controls, ControlButton, MarkerType, applyNodeChanges, SelectionMode, addEdge, reconnectEdge, getNodesBounds, getViewportForBounds } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toPng } from 'html-to-image';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Download, Pointer } from 'lucide-react';

import Navbar from '@/components/navbar';
import Menu from "@/components/menu/Menu";
import LinkedListNode from './LinkedListNode';
import CircleNode from './CircleNode';
import { LAYOUT, COLORS, EDGE_STYLE, ANIMATION, INITIAL_STATE, SCRAMBLE, CIRCULAR_NODE, EXPORT, LASER_POINTER, NODE_IDS, OPERATIONS } from './constants';
import { createListNode, createCircleNode } from './utils/nodeFactory';
import { createEdgesForList } from './utils/edgeFactory';
import { getListNodes, getPointerNodes, getHeadNode, getTailNode, removePointerNodes } from './utils/nodeFilters';
import { updatePointers, createPointerEdges, removePointerEdges } from './utils/pointerHelpers';
import * as operations from './operations';

const nodeTypes = {
    linkedListNode: LinkedListNode,
    circleNode: CircleNode,
};

function LinkedList() {
    // State hooks
    const [count, setCount] = useState(INITIAL_STATE.COUNT);
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [speed, setSpeed] = useState(ANIMATION.DEFAULT_SPEED);
    const [isRunning, setIsRunning] = useState(false);
    const [operation, setOperation] = useState(0);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);
    const [highlightHead, setHighlightHead] = useState(false);
    const [highlightTail, setHighlightTail] = useState(false);
    const [nodeColor, setNodeColor] = useState(COLORS.NODE_DEFAULT);
    const [newNodeColor, setNewNodeColor] = useState(COLORS.NODE_NEW);
    const [iterateColor, setIterateColor] = useState(COLORS.NODE_ITERATE);
    const [selectedNodes, setSelectedNodes] = useState([]);
    const [showPointers, setShowPointers] = useState(false);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const [laserPointerEnabled, setLaserPointerEnabled] = useState(false);
    const [laserPointerPosition, setLaserPointerPosition] = useState({ x: 0, y: 0 });

    // Refs
    const menuRef = useRef();
    const reactFlowInstance = useRef(null);

    const handlePointerHover = useCallback((nodeId) => {
        setHoveredNodeId(nodeId);
    }, []);

    const updatePointerPositions = useCallback((nodesList, edgesList) => {
        const listNodes = getListNodes(nodesList);
        const headNode = getHeadNode(listNodes);
        const tailNode = getTailNode(listNodes);

        const updatedNodes = updatePointers(nodesList, headNode, tailNode);
        const updatedEdges = [...edgesList, ...createPointerEdges(listNodes)];

        return { nodes: updatedNodes, edges: updatedEdges };
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

        setNodes(prevNodes => [headPointerNode, tailPointerNode, ...prevNodes]);
    }, [handlePointerHover]);

    const initializeList = useCallback((listCount) => {
        const { nodes: newNodes, edges: newEdges } = createInitialList(listCount, handlePointerHover, nodeColor);
        const pointerNodes = nodes ? getPointerNodes(nodes) : [];
        const allNodes = [...pointerNodes, ...newNodes];

        const updatedData = updatePointerPositions(allNodes, newEdges);

        setNodes(updatedData.nodes);
        setEdges(updatedData.edges);

        if (reactFlowInstance.current) {
            setTimeout(() => {
                reactFlowInstance.current.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
            }, ANIMATION.FIT_VIEW_DELAY);
        }
    }, [handlePointerHover, nodeColor, nodes, updatePointerPositions]);

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

    // Effect for component mount
    useEffect(() => {
        initializeList(count);
        initializePointers();

        const hasSeenTour = localStorage.getItem('sll-tour-completed');
        if (!hasSeenTour) {
            setTimeout(() => startTour(), 1000);
        }
    }, []); // Empty deps - only run on mount

    const onNodesChange = useCallback((changes) => {
        setNodes(currentNodes => applyNodeChanges(changes, currentNodes));
    }, []);

    const onSelectionChange = useCallback(({ nodes: selectedNodesList }) => {
        setSelectedNodes(selectedNodesList.map(node => node.id));
    }, []);

    const onConnect = useCallback((params) => {
        setEdges(currentEdges => addEdge({
            ...params,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: EDGE_STYLE.MARKER_WIDTH,
                height: EDGE_STYLE.MARKER_HEIGHT,
                color: COLORS.EDGE_DEFAULT
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        }, currentEdges));
    }, []);

    const onReconnect = useCallback((oldEdge, newConnection) => {
        setEdges(currentEdges => reconnectEdge(oldEdge, newConnection, currentEdges));
    }, []);

    const onReconnectStart = useCallback(() => {
        setIsReconnecting(true);
    }, []);

    const onReconnectEnd = useCallback(() => {
        setIsReconnecting(false);
    }, []);

    const isValidConnection = useCallback((connection) => {
        const { source, target, targetHandle } = connection;
        const sourceNode = nodes.find(node => node.id === source);
        const targetNode = nodes.find(node => node.id === target);

        if (!sourceNode || !targetNode) return false;

        if (sourceNode.type === 'circleNode') {
            if (!isReconnecting) {
                const hasExistingConnection = edges.some(edge => edge.source === source);
                if (hasExistingConnection) {
                    return false;
                }
            }

            if (targetNode.type === 'linkedListNode') {
                return targetHandle === 'top' || targetHandle === 'bottom';
            }
        }

        return true;
    }, [nodes, edges, isReconnecting]);

    const handleCreateEmpty = useCallback(() => {
        const pointerNodes = getPointerNodes(nodes);
        setNodes(pointerNodes);
        setEdges([]);

        if (reactFlowInstance.current) {
            setTimeout(() => {
                reactFlowInstance.current.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING_LARGE });
            }, 100);
        }
    }, [nodes]);

    const handleCreateRandom = useCallback(() => {
        initializeList(count);
    }, [count, initializeList]);

    const handleCreateFromSequence = useCallback((sequence) => {
        try {
            const values = JSON.parse(sequence);
            if (!Array.isArray(values)) {
                alert('Please enter a valid JSON array');
                return;
            }
            const { nodes: newNodes, edges: newEdges } = createListFromSequence(values, handlePointerHover, nodeColor);
            const pointerNodes = getPointerNodes(nodes);
            const allNodes = [...pointerNodes, ...newNodes];

            const updatedData = updatePointerPositions(allNodes, newEdges);

            setNodes(updatedData.nodes);
            setEdges(updatedData.edges);

            if (reactFlowInstance.current) {
                setTimeout(() => {
                    reactFlowInstance.current.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING });
                }, 100);
            }
        } catch (error) {
            alert('Invalid JSON format. Please enter an array like [1, 2, 3]');
        }
    }, [handlePointerHover, nodeColor, nodes, updatePointerPositions]);

    const handleCountChange = useCallback((val) => {
        setCount(val);
    }, []);

    const handleOperationChanged = useCallback((val) => {
        setOperation(val);
    }, []);

    const handleSpeedChanged = useCallback((val) => {
        const newSpeed = (1000 - val * 9);
        setSpeed(newSpeed);
    }, []);

    const handleScramble = useCallback(() => {
        setNodes(currentNodes => currentNodes.map(node => ({
            ...node,
            position: {
                x: Math.random() * SCRAMBLE.X_RANGE + SCRAMBLE.X_OFFSET,
                y: Math.random() * SCRAMBLE.Y_RANGE + SCRAMBLE.Y_OFFSET
            }
        })));
    }, []);

    const handleToggleHeadHighlight = useCallback(() => {
        setHighlightHead(current => !current);
    }, []);

    const handleToggleTailHighlight = useCallback(() => {
        setHighlightTail(current => !current);
    }, []);

    const handleNodeColorUpdate = useCallback((e) => {
        setNodeColor(e.target.value);
    }, []);

    const handleApplyNodeColor = useCallback(() => {
        setNodes(currentNodes => currentNodes.map(node => {
            const shouldUpdate = selectedNodes.length === 0 || selectedNodes.includes(node.id);

            if (shouldUpdate) {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: nodeColor,
                    }
                };
            }
            return node;
        }));
    }, [nodeColor, selectedNodes]);

    const handleNewNodeColorChange = useCallback((e) => {
        setNewNodeColor(e.target.value);
    }, []);

    const handleIterateColorChange = useCallback((e) => {
        setIterateColor(e.target.value);
    }, []);

    const handleCircleNodeLabelChange = useCallback((nodeId, newLabel) => {
        setNodes(currentNodes => currentNodes.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, label: newLabel } }
                : node
        ));
    }, []);

    const handleAddCircularNode = useCallback(() => {
        const newNodeId = `circle-${Date.now()}`;
        const x = Math.random() * CIRCULAR_NODE.X_RANGE + CIRCULAR_NODE.X_OFFSET;
        const y = Math.random() * CIRCULAR_NODE.Y_RANGE + CIRCULAR_NODE.Y_OFFSET;
        const newNode = createCircleNode(
            newNodeId,
            'C',
            x,
            y,
            handlePointerHover,
            handleCircleNodeLabelChange
        );
        setNodes(prevNodes => [...prevNodes, newNode]);
    }, [handlePointerHover, handleCircleNodeLabelChange]);

    const handleTogglePointers = useCallback(() => {
        setShowPointers(current => !current);
    }, []);

    const handleToggleLaserPointer = useCallback(() => {
        setLaserPointerEnabled(current => !current);
    }, []);

    const handleMouseMove = useCallback((event) => {
        if (laserPointerEnabled) {
            const canvasArea = document.getElementById('canvas-area');
            if (canvasArea) {
                const rect = canvasArea.getBoundingClientRect();
                setLaserPointerPosition({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                });
            }
        }
    }, [laserPointerEnabled]);

    const handleExportPNG = useCallback(() => {
        const nodesBounds = getNodesBounds(nodes);
        const viewport = getViewportForBounds(
            nodesBounds,
            nodesBounds.width,
            nodesBounds.height,
            EXPORT.VIEWPORT_MIN_SCALE,
            EXPORT.VIEWPORT_MAX_SCALE,
            EXPORT.VIEWPORT_PADDING
        );

        const flowElement = document.querySelector('.react-flow__viewport');
        if (!flowElement) return;

        toPng(flowElement, {
            backgroundColor: EXPORT.BACKGROUND_COLOR,
            width: nodesBounds.width * viewport.zoom + EXPORT.EXTRA_PADDING,
            height: nodesBounds.height * viewport.zoom + EXPORT.EXTRA_PADDING,
            style: {
                width: nodesBounds.width * viewport.zoom + EXPORT.EXTRA_PADDING,
                height: nodesBounds.height * viewport.zoom + EXPORT.EXTRA_PADDING,
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            },
        }).then((dataUrl) => {
            const a = document.createElement('a');
            a.setAttribute('download', 'linked-list.png');
            a.setAttribute('href', dataUrl);
            a.click();
        }).catch((error) => {
            console.error('Error exporting PNG:', error);
        });
    }, [nodes]);

    // Operation wrapper functions
    const insertAtHead = useCallback(async (value) => {
        const context = {
            state: { nodes, edges, speed, newNodeColor, iterateColor },
            setState: (updates, callback) => {
                if (typeof updates === 'function') {
                    // Handle functional updates
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
            },
            reactFlowInstance: reactFlowInstance.current,
            handlePointerHover
        };
        await operations.insertAtHead(context, value);
    }, [nodes, edges, speed, newNodeColor, iterateColor, handlePointerHover]);

    const deleteAtHead = useCallback(async () => {
        const context = {
            state: { nodes, edges, speed, iterateColor },
            setState: (updates) => {
                if (updates.nodes !== undefined) setNodes(updates.nodes);
                if (updates.edges !== undefined) setEdges(updates.edges);
            }
        };
        await operations.deleteAtHead(context);
    }, [nodes, edges, speed, iterateColor]);

    const insertAtTail = useCallback(async (value) => {
        const context = {
            state: { nodes, edges, speed, newNodeColor, iterateColor },
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
            },
            reactFlowInstance: reactFlowInstance.current,
            handlePointerHover
        };
        await operations.insertAtTail(context, value);
    }, [nodes, edges, speed, newNodeColor, iterateColor, handlePointerHover]);

    const insertAtTailO1 = useCallback(async (value) => {
        const context = {
            state: { nodes, edges, speed, newNodeColor, iterateColor },
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
            },
            reactFlowInstance: reactFlowInstance.current,
            handlePointerHover
        };
        await operations.insertAtTailO1(context, value);
    }, [nodes, edges, speed, newNodeColor, iterateColor, handlePointerHover]);

    const deleteAtTail = useCallback(async () => {
        const context = {
            state: { nodes, edges, speed, iterateColor },
            setState: (updates) => {
                if (updates.nodes !== undefined) setNodes(updates.nodes);
                if (updates.edges !== undefined) setEdges(updates.edges);
            }
        };
        await operations.deleteAtTail(context);
    }, [nodes, edges, speed, iterateColor]);

    const traverseList = useCallback(async () => {
        const context = {
            state: { nodes, edges, speed, iterateColor },
            setState: (updates) => {
                if (updates.nodes !== undefined) setNodes(updates.nodes);
                if (updates.edges !== undefined) setEdges(updates.edges);
            }
        };
        await operations.traverseList(context);
    }, [nodes, edges, speed, iterateColor]);

    const reverseList = useCallback(async () => {
        const context = {
            state: { nodes, edges, speed, iterateColor },
            setState: (updates) => {
                if (updates.nodes !== undefined) setNodes(updates.nodes);
                if (updates.edges !== undefined) setEdges(updates.edges);
            }
        };
        await operations.reverseList(context);
    }, [nodes, edges, speed, iterateColor]);

    const handleVisualize = useCallback(async (opIndex, value) => {
        setIsRunning(true);

        const op = opIndex !== undefined ? opIndex : operation;
        const valToInsert = value && value !== '' ? parseInt(value) : Math.floor(Math.random() * 100);

        switch (op) {
            case OPERATIONS.INSERT_HEAD:
                await insertAtHead(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.DELETE_HEAD:
                await deleteAtHead();
                break;
            case OPERATIONS.INSERT_TAIL:
                await insertAtTail(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.DELETE_TAIL:
                await deleteAtTail();
                break;
            case OPERATIONS.TRAVERSE:
                await traverseList();
                break;
            case OPERATIONS.REVERSE:
                await reverseList();
                break;
            case OPERATIONS.INSERT_TAIL_O1:
                await insertAtTailO1(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            default:
                await traverseList();
        }

        setIsRunning(false);
    }, [operation, insertAtHead, deleteAtHead, insertAtTail, deleteAtTail, traverseList, reverseList, insertAtTailO1]);

    // Render logic
    let nodesToRender = nodes;
    let edgesToRender = edges;

    if (!showPointers) {
        nodesToRender = removePointerNodes(nodes);
        edgesToRender = removePointerEdges(edges);
    }

    const listNodes = getListNodes(nodesToRender);
    const highlightedNodes = nodesToRender.map((node) => {
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

    const highlightedEdges = edgesToRender.map(edge => {
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

    return (
        <div className="flex flex-col h-screen">
            <div id="sll-navbar">
                <Navbar title="Single linked list" onStartTour={startTour} />
            </div>

            <div className="flex flex-1 overflow-hidden">
                <Menu
                    ref={menuRef}
                    startTour={startTour}
                    disable={isRunning}
                    onVisualize={handleVisualize}
                    onCreateEmpty={handleCreateEmpty}
                    onCreateRandom={handleCreateRandom}
                    onCreateFromSequence={handleCreateFromSequence}
                    onScramble={handleScramble}
                    onToggleHeadHighlight={handleToggleHeadHighlight}
                    highlightHead={highlightHead}
                    onToggleTailHighlight={handleToggleTailHighlight}
                    highlightTail={highlightTail}
                    count={count}
                    onCountChange={handleCountChange}
                    onOperationChanged={handleOperationChanged}
                    onSpeedChange={handleSpeedChanged}
                    nodeColor={nodeColor}
                    onNodeColorUpdate={handleNodeColorUpdate}
                    onApplyNodeColor={handleApplyNodeColor}
                    newNodeColor={newNodeColor}
                    onNewNodeColorChange={handleNewNodeColorChange}
                    iterateColor={iterateColor}
                    onIterateColorChange={handleIterateColorChange}
                    onAddCircularNode={handleAddCircularNode}
                    onTogglePointers={handleTogglePointers}
                    showPointers={showPointers}
                    isListEmpty={getListNodes(nodes).length === 0}
                />
                <div
                    id="canvas-area"
                    className="flex flex-1 flex-col overflow-auto bg-gray-50 relative"
                    onMouseMove={handleMouseMove}
                    style={{ cursor: laserPointerEnabled ? 'none' : 'default' }}
                >
                    {laserPointerEnabled && (
                        <div
                            style={{
                                position: 'absolute',
                                left: laserPointerPosition.x,
                                top: laserPointerPosition.y,
                                width: `${LASER_POINTER.SIZE}px`,
                                height: `${LASER_POINTER.SIZE}px`,
                                borderRadius: '50%',
                                backgroundColor: LASER_POINTER.COLOR,
                                boxShadow: `${LASER_POINTER.GLOW_SIZE} ${LASER_POINTER.GLOW_COLOR}`,
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none',
                                zIndex: 9999,
                            }}
                        />
                    )}

                    {nodes.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                                <p className="text-2xl font-semibold text-gray-400 mb-2">Empty List</p>
                                <p className="text-sm text-gray-500">Create a list to get started</p>
                            </div>
                        </div>
                    )}
                    <div className="flex-1">
                        <ReactFlow
                            nodes={highlightedNodes}
                            edges={highlightedEdges}
                            onNodesChange={onNodesChange}
                            onSelectionChange={onSelectionChange}
                            nodeTypes={nodeTypes}
                            fitView
                            nodesDraggable={true}
                            nodesConnectable={true}
                            elementsSelectable={true}
                            onConnect={onConnect}
                            onReconnect={onReconnect}
                            onReconnectStart={onReconnectStart}
                            onReconnectEnd={onReconnectEnd}
                            isValidConnection={isValidConnection}
                            selectionMode={SelectionMode.Partial}
                            selectionOnDrag={true}
                            panOnScroll={true}
                            panOnDrag={[1, 2]}
                            onInit={(instance) => reactFlowInstance.current = instance}
                        >
                            <Background />
                            <Controls style={{ transform: 'scale(1.3)', transformOrigin: 'bottom left' }}>
                                <ControlButton onClick={handleExportPNG} title="Export PNG">
                                    <Download className="h-4 w-4" />
                                </ControlButton>
                                <ControlButton
                                    onClick={handleToggleLaserPointer}
                                    title={laserPointerEnabled ? "Disable Laser Pointer" : "Enable Laser Pointer"}
                                    style={{
                                        backgroundColor: laserPointerEnabled ? '#ef4444' : 'white',
                                        color: laserPointerEnabled ? 'white' : 'black'
                                    }}
                                >
                                    <Pointer className="h-4 w-4" />
                                </ControlButton>
                            </Controls>
                        </ReactFlow>
                    </div>
                </div>
            </div>
        </div>
    );
}

const createInitialList = (count, onPointerHover, nodeColor = COLORS.NODE_DEFAULT) => {
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

const createListFromSequence = (values, onPointerHover, nodeColor = COLORS.NODE_DEFAULT) => {
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

export default LinkedList;
