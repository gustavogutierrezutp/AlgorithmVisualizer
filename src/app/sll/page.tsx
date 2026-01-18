"use client";
import { useState, useRef, useCallback } from 'react';
import { ReactFlow, Background, Controls, ControlButton, MarkerType, applyNodeChanges, SelectionMode, addEdge, reconnectEdge, getNodesBounds, getViewportForBounds, Node, Edge, ReactFlowInstance, Connection, NodeChange, OnConnect, OnReconnect, OnSelectionChangeParams } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import 'driver.js/dist/driver.css';
import { toPng } from 'html-to-image';
import { Download, Pointer } from 'lucide-react';

import Navbar from '@/components/navbar';
import Menu from "@/components/menu/Menu";
import LinkedListNode from './LinkedListNode';
import CircleNode from './CircleNode';
import { LAYOUT, COLORS, EDGE_STYLE, ANIMATION, INITIAL_STATE, SCRAMBLE, CIRCULAR_NODE, EXPORT, LASER_POINTER, OPERATIONS } from './constants';
import { createCircleNode } from './utils/nodeFactory';
import { getListNodes, getPointerNodes } from './utils/nodeFilters';
import { updatePointers, createPointerEdges } from './utils/pointerHelpers';
import { useListOperations } from './hooks/useListOperations';
import { useListVisualization } from './hooks/useListVisualization';
import { useListInitialization } from './hooks/useListInitialization';
import { getAutoLayoutedNodes } from './utils/elkLayout';

const nodeTypes = {
    linkedListNode: LinkedListNode,
    circleNode: CircleNode,
};

interface MenuRefType {
    refreshInsertValue: () => void;
}

function LinkedList() {
    // State hooks
    const [count, setCount] = useState<number>(INITIAL_STATE.COUNT);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [speed, setSpeed] = useState<number>(ANIMATION.DEFAULT_SPEED);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [operation, setOperation] = useState<number>(0);
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const [highlightHead, setHighlightHead] = useState<boolean>(false);
    const [highlightTail, setHighlightTail] = useState<boolean>(false);
    const [nodeColor, setNodeColor] = useState<string>(COLORS.NODE_DEFAULT);
    const [newNodeColor, setNewNodeColor] = useState<string>(COLORS.NODE_NEW);
    const [iterateColor, setIterateColor] = useState<string>(COLORS.NODE_ITERATE);
    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [showPointers, setShowPointers] = useState<boolean>(false);
    const [isReconnecting, setIsReconnecting] = useState<boolean>(false);
    const [laserPointerEnabled, setLaserPointerEnabled] = useState<boolean>(false);
    const [laserPointerPosition, setLaserPointerPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [lengthResult, setLengthResult] = useState<number | null>(null);
    const [searchResult, setSearchResult] = useState<{ found: boolean; position: number } | null>(null);
    const [autoAdjust, setAutoAdjust] = useState<boolean>(true);

    // Refs
    const menuRef = useRef<MenuRefType>(null);
    const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

    const handlePointerHover = useCallback((nodeId: string | null) => {
        setHoveredNodeId(nodeId);
    }, []);

    const handleCircleNodeLabelChange = useCallback((nodeId: string, newLabel: string) => {
        setNodes(currentNodes => currentNodes.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, label: newLabel } }
                : node
        ));
    }, []);

    const updatePointerPositions = useCallback((nodesList: Node[], edgesList: Edge[]) => {
        const listNodes = getListNodes(nodesList);
        const headNode = listNodes.find((n: Node) => n.id === 'head') ?? null;
        const tailNode = listNodes[listNodes.length - 1];

        const updatedNodes = updatePointers(nodesList, headNode, tailNode);
        const updatedEdges = [...edgesList, ...createPointerEdges(listNodes)];

        return { nodes: updatedNodes, edges: updatedEdges };
    }, []);

    // Use custom hooks
    const { initializeList, startTour, handleCreateFromSequence } = useListInitialization({
        nodes,
        nodeColor,
        setNodes,
        setEdges,
        reactFlowInstance: reactFlowInstance as React.RefObject<ReactFlowInstance>,
        handlePointerHover,
        handleCircleNodeLabelChange,
        updatePointerPositions
    });

    const listOperations = useListOperations({
        nodes,
        edges,
        speed,
        newNodeColor,
        iterateColor,
        setNodes,
        setEdges,
        reactFlowInstance: reactFlowInstance as React.RefObject<ReactFlowInstance>,
        handlePointerHover
    });

    const { highlightedNodes, highlightedEdges } = useListVisualization({
        nodes,
        edges,
        showPointers,
        highlightHead,
        highlightTail,
        hoveredNodeId,
        iterateColor
    });

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes(currentNodes => applyNodeChanges(changes, currentNodes));
    }, []);

    const onSelectionChange = useCallback(({ nodes: selectedNodesList }: OnSelectionChangeParams) => {
        setSelectedNodes(selectedNodesList.map(node => node.id));
    }, []);

    const onConnect: OnConnect = useCallback((params: Connection) => {
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

    const onReconnect: OnReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
        setEdges(currentEdges => reconnectEdge(oldEdge, newConnection, currentEdges));
    }, []);

    const onReconnectStart = useCallback(() => {
        setIsReconnecting(true);
    }, []);

    const onReconnectEnd = useCallback(() => {
        setIsReconnecting(false);
    }, []);

    const isValidConnection = useCallback((connection: Connection | Edge) => {
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
                reactFlowInstance.current?.fitView({ duration: ANIMATION.FIT_VIEW_DURATION, padding: LAYOUT.FIT_VIEW_PADDING_LARGE });
            }, 100);
        }
    }, [nodes]);

    const handleCreateRandom = useCallback(() => {
        initializeList(count);
    }, [count, initializeList]);


    const handleCountChange = useCallback((val: number) => {
        setCount(val);
    }, []);

    const handleOperationChanged = useCallback((val: number) => {
        setOperation(val);
    }, []);

    const handleSpeedChanged = useCallback((val: number) => {
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

    const handleAutoLayout = useCallback(async () => {
        const layoutedNodes = await getAutoLayoutedNodes(nodes, edges);
        setNodes(layoutedNodes);

        // Fit view after layout
        if (reactFlowInstance.current) {
            setTimeout(() => {
                reactFlowInstance.current?.fitView({
                    duration: ANIMATION.FIT_VIEW_DURATION,
                    padding: LAYOUT.FIT_VIEW_PADDING
                });
            }, ANIMATION.FIT_VIEW_DELAY);
        }
    }, [nodes, edges]);

    const handleToggleHeadHighlight = useCallback(() => {
        setHighlightHead(current => !current);
    }, []);

    const handleToggleTailHighlight = useCallback(() => {
        setHighlightTail(current => !current);
    }, []);

    const handleNodeColorUpdate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleNewNodeColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewNodeColor(e.target.value);
    }, []);

    const handleIterateColorChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setIterateColor(e.target.value);
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

    const handleSearchValueChange = useCallback(() => {
        setSearchResult(null);
    }, []);

    const handleToggleAutoAdjust = useCallback(() => {
        setAutoAdjust(current => !current);
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
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

        const flowElement = document.querySelector('.react-flow__viewport') as HTMLElement | null;
        if (!flowElement) return;

        const exportWidth = nodesBounds.width * viewport.zoom + EXPORT.EXTRA_PADDING;
        const exportHeight = nodesBounds.height * viewport.zoom + EXPORT.EXTRA_PADDING;

        toPng(flowElement, {
            backgroundColor: EXPORT.BACKGROUND_COLOR,
            width: exportWidth,
            height: exportHeight,
            style: {
                width: `${exportWidth}px`,
                height: `${exportHeight}px`,
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

    const handleVisualize = useCallback(async (opIndex?: number, value?: string, position?: number) => {
        setIsRunning(true);

        const op = opIndex !== undefined ? opIndex : operation;
        const valToInsert = value && value !== '' ? parseInt(value) : Math.floor(Math.random() * 100);

        // Clear length result for all operations except GET_LENGTH
        if (op !== OPERATIONS.GET_LENGTH) {
            setLengthResult(null);
        }

        // Clear search result for all operations except SEARCH_VALUE
        if (op !== OPERATIONS.SEARCH_VALUE) {
            setSearchResult(null);
        }

        switch (op) {
            case OPERATIONS.INSERT_HEAD:
                await listOperations.insertAtHead(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.DELETE_HEAD:
                await listOperations.deleteAtHead();
                break;
            case OPERATIONS.INSERT_TAIL:
                await listOperations.insertAtTail(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.DELETE_TAIL:
                await listOperations.deleteAtTail();
                break;
            case OPERATIONS.TRAVERSE:
                await listOperations.traverseList();
                break;
            case OPERATIONS.REVERSE:
                await listOperations.reverseList();
                break;
            case OPERATIONS.INSERT_TAIL_O1:
                await listOperations.insertAtTailO1(valToInsert);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.INSERT_AT_POSITION:
                const insertPosition = position !== undefined ? position : 0;
                await listOperations.insertAtPosition(valToInsert, insertPosition);
                if (menuRef.current) {
                    menuRef.current.refreshInsertValue();
                }
                break;
            case OPERATIONS.GET_LENGTH:
                const result = await listOperations.getLength();
                setLengthResult(result as number | null);
                break;
            case OPERATIONS.SEARCH_VALUE:
                const searchValue = value && value !== '' ? parseInt(value) : Math.floor(Math.random() * 100);
                const searchRes = await listOperations.searchValue(searchValue);
                setSearchResult(searchRes as { found: boolean; position: number } | null);
                break;
            case OPERATIONS.FIND_MIDDLE:
                await listOperations.findMiddle();
                break;
            case OPERATIONS.DELETE_AT_POSITION:
                const deletePosition = position !== undefined ? position : 0;
                await listOperations.deleteAtPosition(deletePosition);
                break;
            case OPERATIONS.REMOVE_DUPLICATES:
                await listOperations.removeDuplicates();
                break;
            case OPERATIONS.ACCESS_FRONT:
                await listOperations.accessFront();
                break;
            case OPERATIONS.ACCESS_BACK:
                await listOperations.accessBack();
                break;
            case OPERATIONS.ACCESS_NTH:
                const nthPosition = position !== undefined ? position : 0;
                await listOperations.accessNth(nthPosition);
                break;
            default:
                await listOperations.traverseList();
        }

        // Auto adjust canvas if enabled
        if (autoAdjust && reactFlowInstance.current) {
            setTimeout(() => {
                reactFlowInstance.current?.fitView({
                    duration: ANIMATION.FIT_VIEW_DURATION,
                    padding: LAYOUT.FIT_VIEW_PADDING
                });
            }, ANIMATION.FIT_VIEW_DELAY);
        }

        setIsRunning(false);
    }, [operation, listOperations, autoAdjust]);

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
                    onAutoLayout={handleAutoLayout}
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
                    listLength={getListNodes(nodes).length}
                    lengthResult={lengthResult}
                    searchResult={searchResult}
                    onSearchValueChange={handleSearchValueChange}
                    autoAdjust={autoAdjust}
                    onToggleAutoAdjust={handleToggleAutoAdjust}
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

export default LinkedList;
