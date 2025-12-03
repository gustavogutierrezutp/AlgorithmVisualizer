"use client";
import React, { Component } from 'react';
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

const nodeTypes = {
    linkedListNode: LinkedListNode,
    circleNode: CircleNode,
};

class LinkedList extends Component {
    state = {
        count: 5,
        nodes: [],
        edges: [],
        speed: 500,
        isRunning: false,
        operation: 0, // 0: insert, 1: delete, 2: search, 3: reverse
        hoveredNodeId: null,
        highlightHead: false,
        highlightTail: false,
        nodeColor: '#2196F3',
        newNodeColor: '#4CAF50',
        iterateColor: '#FF5722',
        selectedNodes: [],
        showPointers: false,
        isReconnecting: false,
        laserPointerEnabled: false,
        laserPointerPosition: { x: 0, y: 0 },
    }

    menuRef = React.createRef();

    componentDidMount() {
        this.initializeList(this.state.count);
        this.initializePointers();

        // Check if user has seen the tour before
        const hasSeenTour = localStorage.getItem('sll-tour-completed');
        if (!hasSeenTour) {
            setTimeout(() => this.startTour(), 1000);
        }
    }

    initializePointers = () => {
        // Create head and tail pointer nodes (always exist, visibility controlled by toggle)
        const headPointerNode = {
            id: 'pointer-head',
            type: 'circleNode',
            data: {
                label: 'H',
                nodeId: 'pointer-head',
                onPointerHover: this.handlePointerHover,
                onLabelChange: this.handleCircleNodeLabelChange,
            },
            position: { x: 50, y: 0 },
        };

        const tailPointerNode = {
            id: 'pointer-tail',
            type: 'circleNode',
            data: {
                label: 'T',
                nodeId: 'pointer-tail',
                onPointerHover: this.handlePointerHover,
                onLabelChange: this.handleCircleNodeLabelChange,
            },
            position: { x: 50, y: 200 },
        };

        this.setState(prevState => ({
            nodes: [headPointerNode, tailPointerNode, ...prevState.nodes]
        }));
    }

    startTour = () => {
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
    }

    initializeList = (count) => {
        const { nodes, edges } = createInitialList(count, this.handlePointerHover, this.state.nodeColor);
        // Preserve pointer nodes
        const pointerNodes = this.state.nodes ? this.state.nodes.filter(n => n.type === 'circleNode') : [];
        const allNodes = [...pointerNodes, ...nodes];

        // Update pointer positions and edges
        const updatedNodes = this.updatePointerPositions(allNodes, edges);

        this.setState({ nodes: updatedNodes.nodes, edges: updatedNodes.edges }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                }, 100);
            }
        });
    }

    updatePointerPositions = (nodes, edges) => {
        const listNodes = nodes.filter(n => n.type === 'linkedListNode');
        const headNode = listNodes.length > 0 ? listNodes[0] : null;
        const tailNode = listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;

        const updatedNodes = nodes.map(node => {
            if (node.id === 'pointer-head' && headNode) {
                return {
                    ...node,
                    position: {
                        x: headNode.position.x,
                        y: headNode.position.y - 100
                    }
                };
            }
            if (node.id === 'pointer-tail' && tailNode) {
                return {
                    ...node,
                    position: {
                        x: tailNode.position.x,
                        y: tailNode.position.y + 100
                    }
                };
            }
            return node;
        });

        const updatedEdges = [...edges];

        // Add pointer edges
        if (headNode) {
            updatedEdges.push({
                id: `edge-pointer-head-${headNode.id}`,
                source: 'pointer-head',
                target: headNode.id,
                targetHandle: 'top',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        if (tailNode) {
            updatedEdges.push({
                id: `edge-pointer-tail-${tailNode.id}`,
                source: 'pointer-tail',
                target: tailNode.id,
                targetHandle: 'bottom',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        return { nodes: updatedNodes, edges: updatedEdges };
    }

    handlePointerHover = (nodeId) => {
        this.setState({ hoveredNodeId: nodeId });
    }

    onNodesChange = (changes) => {
        this.setState({
            nodes: applyNodeChanges(changes, this.state.nodes)
        });
    }

    onSelectionChange = ({ nodes }) => {
        this.setState({ selectedNodes: nodes.map(node => node.id) });
    }

    onConnect = (params) => {
        this.setState({
            edges: addEdge({
                ...params,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#333'
                }
            }, this.state.edges),
        });
    }

    onReconnect = (oldEdge, newConnection) => {
        this.setState({
            edges: reconnectEdge(oldEdge, newConnection, this.state.edges),
        });
    }

    onReconnectStart = () => {
        this.setState({ isReconnecting: true });
    }

    onReconnectEnd = () => {
        this.setState({ isReconnecting: false });
    }

    isValidConnection = (connection) => {
        const { source, target, targetHandle } = connection;
        const sourceNode = this.state.nodes.find(node => node.id === source);
        const targetNode = this.state.nodes.find(node => node.id === target);

        if (!sourceNode || !targetNode) return false;

        // Restrict CircleNode -> LinkedListNode connections
        if (sourceNode.type === 'circleNode') {
            // Check if this circle node already has an outgoing connection
            // BUT allow it if we are currently reconnecting (moving an existing edge)
            if (!this.state.isReconnecting) {
                const hasExistingConnection = this.state.edges.some(edge => edge.source === source);
                if (hasExistingConnection) {
                    return false;
                }
            }

            if (targetNode.type === 'linkedListNode') {
                return targetHandle === 'top' || targetHandle === 'bottom';
            }
        }

        return true;
    }

    render() {
        const { hoveredNodeId, highlightHead, highlightTail, showPointers } = this.state;

        // Filter out pointer nodes if showPointers is false
        let nodesToRender = this.state.nodes;
        let edgesToRender = this.state.edges;

        if (!showPointers) {
            nodesToRender = this.state.nodes.filter(n => n.id !== 'pointer-head' && n.id !== 'pointer-tail');
            edgesToRender = this.state.edges.filter(e => !e.id.startsWith('edge-pointer-'));
        }

        // Apply head and tail highlighting
        const listNodes = nodesToRender.filter(n => n.type === 'linkedListNode');
        const highlightedNodes = nodesToRender.map((node) => {
            const listIndex = listNodes.findIndex(n => n.id === node.id);

            if (listIndex === 0 && highlightHead && node.type === 'linkedListNode') {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: '#9C27B0', // Purple for head
                        border: '3px solid #7B1FA2',
                    }
                };
            }
            if (listIndex === listNodes.length - 1 && highlightTail && node.type === 'linkedListNode') {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: '#E91E63', // Pink for tail
                        border: '3px solid #C2185B',
                    }
                };
            }
            // Return node as-is if it's not being highlighted
            return node;
        });

        // Apply highlighting to edges based on hovered node
        const highlightedEdges = edgesToRender.map(edge => {
            const isHighlighted = hoveredNodeId && edge.source === hoveredNodeId;
            return {
                ...edge,
                animated: isHighlighted ? true : edge.animated,
                style: {
                    ...edge.style,
                    strokeWidth: isHighlighted ? 4 : 2,
                    stroke: isHighlighted ? this.state.iterateColor : '#333',
                },
                markerEnd: {
                    ...edge.markerEnd,
                    color: isHighlighted ? this.state.iterateColor : '#333',
                }
            };
        });

        return (
            <div className="flex flex-col h-screen">
                <div id="sll-navbar">
                    <Navbar title="Single linked list" onStartTour={this.startTour} />
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <Menu
                        ref={this.menuRef}
                        startTour={this.startTour}
                        disable={this.state.isRunning}
                        onVisualize={this.handleVisualize}
                        onCreateEmpty={this.handleCreateEmpty}
                        onCreateRandom={this.handleCreateRandom}
                        onCreateFromSequence={this.handleCreateFromSequence}
                        onScramble={this.handleScramble}
                        onToggleHeadHighlight={this.handleToggleHeadHighlight}
                        highlightHead={this.state.highlightHead}
                        onToggleTailHighlight={this.handleToggleTailHighlight}
                        highlightTail={this.state.highlightTail}
                        count={this.state.count}
                        onCountChange={this.handleCountChange}
                        onOperationChanged={this.handleOperationChanged}
                        onSpeedChange={this.handleSpeedChanged}
                        nodeColor={this.state.nodeColor}
                        onNodeColorUpdate={this.handleNodeColorUpdate}
                        onApplyNodeColor={this.handleApplyNodeColor}
                        newNodeColor={this.state.newNodeColor}
                        onNewNodeColorChange={this.handleNewNodeColorChange}
                        iterateColor={this.state.iterateColor}
                        onIterateColorChange={this.handleIterateColorChange}
                        onAddCircularNode={this.handleAddCircularNode}
                        onTogglePointers={this.handleTogglePointers}
                        showPointers={this.state.showPointers}
                        isListEmpty={this.state.nodes.filter(n => n.type === 'linkedListNode').length === 0}
                    />
                    <div
                        id="canvas-area"
                        className="flex flex-1 flex-col overflow-auto bg-gray-50 relative"
                        onMouseMove={this.handleMouseMove}
                        style={{ cursor: this.state.laserPointerEnabled ? 'none' : 'default' }}
                    >
                        {/* Laser Pointer */}
                        {this.state.laserPointerEnabled && (
                            <div
                                style={{
                                    position: 'absolute',
                                    left: this.state.laserPointerPosition.x,
                                    top: this.state.laserPointerPosition.y,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                                    boxShadow: '0 0 20px 5px rgba(255, 0, 0, 0.5)',
                                    transform: 'translate(-50%, -50%)',
                                    pointerEvents: 'none',
                                    zIndex: 9999,
                                }}
                            />
                        )}

                        {this.state.nodes.length === 0 && (
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
                            onNodesChange={this.onNodesChange}
                            onSelectionChange={this.onSelectionChange}
                            nodeTypes={nodeTypes}
                            fitView
                            nodesDraggable={true}
                            nodesConnectable={true}
                            elementsSelectable={true}
                            onConnect={this.onConnect}
                            onReconnect={this.onReconnect}
                            onReconnectStart={this.onReconnectStart}
                            onReconnectEnd={this.onReconnectEnd}
                            isValidConnection={this.isValidConnection}
                            selectionMode={SelectionMode.Partial}
                            selectionOnDrag={true}
                            panOnScroll={true}
                            panOnDrag={[1, 2]}
                            onInit={(instance) => this.reactFlowInstance = instance}
                        >
                            <Background />
                            <Controls>
                                <ControlButton onClick={this.handleExportPNG} title="Export PNG">
                                    <Download className="h-4 w-4" />
                                </ControlButton>
                                <ControlButton
                                    onClick={this.handleToggleLaserPointer}
                                    title={this.state.laserPointerEnabled ? "Disable Laser Pointer" : "Enable Laser Pointer"}
                                    style={{
                                        backgroundColor: this.state.laserPointerEnabled ? '#ef4444' : 'white',
                                        color: this.state.laserPointerEnabled ? 'white' : 'black'
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
    handleCreateEmpty = () => {
        // Keep only pointer nodes, remove all list nodes
        const pointerNodes = this.state.nodes.filter(n => n.type === 'circleNode');
        this.setState({ nodes: pointerNodes, edges: [] }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.5 });
                }, 100);
            }
        });
    }

    handleCreateRandom = () => {
        this.initializeList(this.state.count);
    }

    handleCreateFromSequence = (sequence) => {
        try {
            const values = JSON.parse(sequence);
            if (!Array.isArray(values)) {
                alert('Please enter a valid JSON array');
                return;
            }
            const { nodes, edges } = createListFromSequence(values, this.handlePointerHover, this.state.nodeColor);
            // Preserve pointer nodes
            const pointerNodes = this.state.nodes.filter(n => n.type === 'circleNode');
            const allNodes = [...pointerNodes, ...nodes];

            // Update pointer positions and edges
            const updatedNodes = this.updatePointerPositions(allNodes, edges);

            this.setState({ nodes: updatedNodes.nodes, edges: updatedNodes.edges }, () => {
                if (this.reactFlowInstance) {
                    setTimeout(() => {
                        this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                    }, 100);
                }
            });
        } catch (error) {
            alert('Invalid JSON format. Please enter an array like [1, 2, 3]');
        }
    }

    handleCountChange = (val) => {
        this.setState({ count: val });
    }

    handleOperationChanged = (val) => {
        this.setState({ operation: val });
    }

    handleSpeedChanged = (val) => {
        const speed = (1000 - val * 9);
        this.setState({ speed });
    }

    handleScramble = () => {
        const nodes = this.state.nodes.map(node => ({
            ...node,
            position: {
                x: Math.random() * 800 + 50,
                y: Math.random() * 400 + 50
            }
        }));
        this.setState({ nodes });
    }

    handleToggleHeadHighlight = () => {
        this.setState({ highlightHead: !this.state.highlightHead });
    }

    handleToggleTailHighlight = () => {
        this.setState({ highlightTail: !this.state.highlightTail });
    }

    handleNodeColorUpdate = (e) => {
        const newColor = e.target.value;
        this.setState({ nodeColor: newColor });
    }

    handleApplyNodeColor = () => {
        const { nodeColor, selectedNodes } = this.state;

        // If there are selected nodes, only update those
        // Otherwise, update all nodes
        const updatedNodes = this.state.nodes.map(node => {
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
        });

        this.setState({ nodes: updatedNodes });
    }

    handleNewNodeColorChange = (e) => {
        const newColor = e.target.value;
        this.setState({ newNodeColor: newColor });
    }

    handleIterateColorChange = (e) => {
        const newColor = e.target.value;
        this.setState({ iterateColor: newColor });
    }

    handleAddCircularNode = () => {
        const newNodeId = `circle-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'circleNode',
            data: {
                label: 'C',
                nodeId: newNodeId,
                onPointerHover: this.handlePointerHover,
                onLabelChange: this.handleCircleNodeLabelChange,
            },
            position: {
                x: Math.random() * 400 + 50,
                y: Math.random() * 400 + 50
            },
        };
        this.setState(prevState => ({
            nodes: [...prevState.nodes, newNode]
        }));
    }

    handleCircleNodeLabelChange = (nodeId, newLabel) => {
        this.setState(prevState => ({
            nodes: prevState.nodes.map(node =>
                node.id === nodeId
                    ? { ...node, data: { ...node.data, label: newLabel } }
                    : node
            )
        }));
    }

    handleTogglePointers = () => {
        // Just toggle visibility flag - pointer nodes always exist
        this.setState(prevState => ({
            showPointers: !prevState.showPointers
        }));
    }

    handleToggleLaserPointer = () => {
        this.setState(prevState => ({
            laserPointerEnabled: !prevState.laserPointerEnabled
        }));
    }

    handleMouseMove = (event) => {
        if (this.state.laserPointerEnabled) {
            const canvasArea = document.getElementById('canvas-area');
            if (canvasArea) {
                const rect = canvasArea.getBoundingClientRect();
                this.setState({
                    laserPointerPosition: {
                        x: event.clientX - rect.left,
                        y: event.clientY - rect.top
                    }
                });
            }
        }
    }

    handleExportPNG = () => {
        const nodesBounds = getNodesBounds(this.state.nodes);
        const viewport = getViewportForBounds(
            nodesBounds,
            nodesBounds.width,
            nodesBounds.height,
            0.5,
            2,
            0.1
        );

        const flowElement = document.querySelector('.react-flow__viewport');
        if (!flowElement) return;

        toPng(flowElement, {
            backgroundColor: '#f9fafb',
            width: nodesBounds.width * viewport.zoom + 100,
            height: nodesBounds.height * viewport.zoom + 100,
            style: {
                width: nodesBounds.width * viewport.zoom + 100,
                height: nodesBounds.height * viewport.zoom + 100,
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
    }

    handleVisualize = async (opIndex, value) => {
        this.setState({ isRunning: true });

        const operation = opIndex !== undefined ? opIndex : this.state.operation;
        const valToInsert = value && value !== '' ? parseInt(value) : Math.floor(Math.random() * 100);

        // Placeholder for different operations
        switch (operation) {
            case 0:
                await this.insertAtHead(valToInsert);
                if (this.menuRef.current) {
                    this.menuRef.current.refreshInsertValue();
                }
                break;
            case 1:
                await this.deleteAtHead();
                break;
            case 2:
                await this.insertAtTail(valToInsert);
                if (this.menuRef.current) {
                    this.menuRef.current.refreshInsertValue();
                }
                break;
            case 3:
                await this.deleteAtTail();
                break;
            case 4:
                await this.traverseList();
                break;
            case 5:
                await this.reverseList();
                break;
            case 6:
                await this.insertAtTailO1(valToInsert);
                if (this.menuRef.current) {
                    this.menuRef.current.refreshInsertValue();
                }
                break;
            default:
                await this.traverseList();
        }

        this.setState({ isRunning: false });
    }

    insertAtHead = async (value) => {
        const existingNodes = [...this.state.nodes];

        // Filter to get only linked list nodes
        const listNodes = existingNodes.filter(n => n.type === 'linkedListNode');
        const firstNode = listNodes.length > 0 ? listNodes[0] : null;
        const fixedDistance = 150;
        const newNodeX = firstNode ? firstNode.position.x - fixedDistance : 50;
        const newNodeY = firstNode ? firstNode.position.y : 100;

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'linkedListNode',
            data: {
                label: value.toString(),
                nodeId: newNodeId,
                onPointerHover: this.handlePointerHover,
            },
            position: { x: newNodeX, y: newNodeY },
            style: {
                background: this.state.newNodeColor,
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        };

        // Insert new node at the beginning, maintaining pointer nodes at their positions
        const nodes = existingNodes.map(n => n);
        const firstListNodeIndex = nodes.findIndex(n => n.type === 'linkedListNode');
        if (firstListNodeIndex !== -1) {
            nodes.splice(firstListNodeIndex, 0, newNode);
        } else {
            nodes.push(newNode);
        }

        // Rebuild edges for linked list nodes only
        const updatedListNodes = nodes.filter(n => n.type === 'linkedListNode');
        let edges = updatedListNodes.length > 1 ? updatedListNodes.slice(0, -1).map((node, idx) => ({
            id: `edge-${idx}`,
            source: node.id,
            sourceHandle: 'right',
            target: updatedListNodes[idx + 1].id,
            targetHandle: 'left',
            animated: true,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: '#333'
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        })) : [];

        // Update Head Pointer (always exists)
        const headPointerIndex = nodes.findIndex(n => n.id === 'pointer-head');
        if (headPointerIndex !== -1) {
            nodes[headPointerIndex] = {
                ...nodes[headPointerIndex],
                position: {
                    x: newNodeX,
                    y: newNodeY - 100
                }
            };

            // Update head pointer edge
            edges.push({
                id: `edge-pointer-head-${newNodeId}`,
                source: 'pointer-head',
                target: newNodeId,
                targetHandle: 'top',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        // Update Tail Pointer if list was empty
        if (listNodes.length === 0) {
            const tailPointerIndex = nodes.findIndex(n => n.id === 'pointer-tail');
            if (tailPointerIndex !== -1) {
                nodes[tailPointerIndex] = {
                    ...nodes[tailPointerIndex],
                    position: {
                        x: newNodeX,
                        y: newNodeY + 100
                    }
                };

                edges.push({
                    id: `edge-pointer-tail-${newNodeId}`,
                    source: 'pointer-tail',
                    target: newNodeId,
                    targetHandle: 'bottom',
                    animated: true,
                    style: { stroke: '#333', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 10,
                        height: 10,
                        color: '#333'
                    },
                });
            }
        } else {
            // Keep existing tail pointer edge
            const tailPointerEdge = this.state.edges.find(e => e.source === 'pointer-tail');
            if (tailPointerEdge) {
                edges.push(tailPointerEdge);
            }
        }

        this.setState({ nodes, edges }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                }, 100);
            }
        });
        await sleep(this.state.speed);
    }

    deleteAtHead = async () => {
        const listNodes = this.state.nodes.filter(n => n.type === 'linkedListNode');
        if (listNodes.length === 0) return;

        // Remove first list node, keep pointer nodes
        const pointerNodes = this.state.nodes.filter(n => n.type !== 'linkedListNode');
        const remainingListNodes = listNodes.slice(1);
        const nodes = [...pointerNodes, ...remainingListNodes];

        // Rebuild edges for linked list nodes
        let edges = remainingListNodes.length > 1 ? remainingListNodes.slice(0, -1).map((node, idx) => ({
            id: `edge-${idx}`,
            source: node.id,
            sourceHandle: 'right',
            target: remainingListNodes[idx + 1].id,
            targetHandle: 'left',
            animated: true,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: '#333'
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        })) : [];

        // Update Head Pointer
        const headPointerIndex = nodes.findIndex(n => n.id === 'pointer-head');
        if (headPointerIndex !== -1 && remainingListNodes.length > 0) {
            const newHead = remainingListNodes[0];
            nodes[headPointerIndex] = {
                ...nodes[headPointerIndex],
                position: {
                    x: newHead.position.x,
                    y: newHead.position.y - 100
                }
            };

            edges.push({
                id: `edge-pointer-head-${newHead.id}`,
                source: 'pointer-head',
                target: newHead.id,
                targetHandle: 'top',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        // Update Tail Pointer edge (tail stays the same unless list becomes empty)
        if (remainingListNodes.length > 0) {
            const tailPointerEdge = this.state.edges.find(e => e.source === 'pointer-tail');
            if (tailPointerEdge) {
                edges.push(tailPointerEdge);
            }
        }

        this.setState({ nodes, edges });
        await sleep(this.state.speed);
    }

    insertAtTail = async (value) => {
        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // Filter to get only linked list nodes for traversal
        const listNodes = nodes.filter(n => n.type === 'linkedListNode');

        // Traverse to the end
        for (let i = 0; i < listNodes.length; i++) {
            const tempNodes = nodes.map((node) => {
                if (node.type === 'linkedListNode') {
                    const listIndex = listNodes.findIndex(n => n.id === node.id);
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            background: listIndex === i ? this.state.iterateColor : node.style.background,
                        }
                    };
                }
                return node;
            });
            this.setState({ nodes: tempNodes });
            await sleep(this.state.speed / 2);
        }

        // Reset colors to original
        const resetNodes = nodes.map(node => {
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
        this.setState({ nodes: resetNodes });

        // Add new node at same Y as last list node, fixed distance in X
        const lastNode = listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;
        const fixedDistance = 150;
        const newNodeX = lastNode ? lastNode.position.x + fixedDistance : 50;
        const newNodeY = lastNode ? lastNode.position.y : 100;

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'linkedListNode',
            data: {
                label: value.toString(),
                nodeId: newNodeId,
                onPointerHover: this.handlePointerHover,
            },
            position: { x: newNodeX, y: newNodeY },
            style: {
                background: this.state.newNodeColor,
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        };

        const newNodes = [...resetNodes, newNode];

        // Add edge if list was not empty
        if (lastNode) {
            edges = edges.filter(e => !e.id.startsWith('edge-') || e.source !== lastNode.id || e.target.startsWith('node-'));
            edges.push({
                id: `edge-${lastNode.id}-${newNodeId}`,
                source: lastNode.id,
                sourceHandle: 'right',
                target: newNodeId,
                targetHandle: 'left',
                animated: true,
                type: 'smoothstep',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#333'
                }
            });
        }

        // Update Tail Pointer
        const tailPointerIndex = newNodes.findIndex(n => n.id === 'pointer-tail');
        if (tailPointerIndex !== -1) {
            newNodes[tailPointerIndex] = {
                ...newNodes[tailPointerIndex],
                position: {
                    x: newNodeX,
                    y: newNodeY + 100
                }
            };

            // Remove old tail pointer edge and add new one
            edges = edges.filter(e => e.source !== 'pointer-tail');
            edges.push({
                id: `edge-pointer-tail-${newNodeId}`,
                source: 'pointer-tail',
                target: newNodeId,
                targetHandle: 'bottom',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        // Update Head Pointer if list was empty
        if (listNodes.length === 0) {
            const headPointerIndex = newNodes.findIndex(n => n.id === 'pointer-head');
            if (headPointerIndex !== -1) {
                newNodes[headPointerIndex] = {
                    ...newNodes[headPointerIndex],
                    position: {
                        x: newNodeX,
                        y: newNodeY - 100
                    }
                };

                edges.push({
                    id: `edge-pointer-head-${newNodeId}`,
                    source: 'pointer-head',
                    target: newNodeId,
                    targetHandle: 'top',
                    animated: true,
                    style: { stroke: '#333', strokeWidth: 2 },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 10,
                        height: 10,
                        color: '#333'
                    },
                });
            }
        }

        this.setState({ nodes: newNodes, edges }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                }, 100);
            }
        });
        await sleep(this.state.speed);
    }

    insertAtTailO1 = async (value) => {
        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // No traversal loop here - O(1) behavior

        // Add new node at same Y as last node, fixed distance in X
        // Filter out pointer nodes to find the actual last list node
        const listNodes = nodes.filter(n => n.type === 'linkedListNode');
        const lastNode = listNodes.length > 0 ? listNodes[listNodes.length - 1] : null;

        const fixedDistance = 150;
        const newNodeX = lastNode ? lastNode.position.x + fixedDistance : 50;
        const newNodeY = lastNode ? lastNode.position.y : 100;

        const newNodeId = `node-${Date.now()}`;
        const newNode = {
            id: newNodeId,
            type: 'linkedListNode',
            data: {
                label: value.toString(),
                nodeId: newNodeId,
                onPointerHover: this.handlePointerHover,
            },
            position: { x: newNodeX, y: newNodeY },
            style: {
                background: this.state.newNodeColor,
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        };

        const newNodes = [...nodes, newNode];

        // Add edge if list was not empty
        if (lastNode) {
            edges.push({
                id: `edge-${lastNode.id}-${newNodeId}`, // Use unique ID based on nodes
                source: lastNode.id,
                sourceHandle: 'right',
                target: newNodeId,
                targetHandle: 'left',
                animated: true,
                type: 'smoothstep',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#333'
                }
            });
        }

        // Update Tail Pointer Position
        const tailPointerIndex = newNodes.findIndex(n => n.id === 'pointer-tail');
        if (tailPointerIndex !== -1) {
            // Update pointer node position
            newNodes[tailPointerIndex] = {
                ...newNodes[tailPointerIndex],
                position: {
                    x: newNodeX,
                    y: newNodeY + 100
                }
            };

            // Update pointer edge
            const pointerEdgeIndex = edges.findIndex(e => e.source === 'pointer-tail');
            if (pointerEdgeIndex !== -1) {
                edges[pointerEdgeIndex] = {
                    ...edges[pointerEdgeIndex],
                    target: newNodeId
                };
            } else {
                // If edge didn't exist (e.g. list was empty), create it
                edges.push({
                    id: `edge-pointer-tail-${newNodeId}`,
                    source: 'pointer-tail',
                    target: newNodeId,
                    targetHandle: 'bottom',
                    animated: true,
                    style: { stroke: '#333', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#333' },
                });
            }
        }

        // Also handle Head pointer if list was empty
        if (listNodes.length === 0) {
            const headPointerIndex = newNodes.findIndex(n => n.id === 'pointer-head');
            if (headPointerIndex !== -1) {
                newNodes[headPointerIndex] = {
                    ...newNodes[headPointerIndex],
                    position: {
                        x: newNodeX,
                        y: newNodeY - 100
                    }
                };

                // Create head edge
                edges.push({
                    id: `edge-pointer-head-${newNodeId}`,
                    source: 'pointer-head',
                    target: newNodeId,
                    targetHandle: 'top',
                    animated: true,
                    style: { stroke: '#333', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10, color: '#333' },
                });
            }
        }

        this.setState({ nodes: newNodes, edges }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                }, 100);
            }
        });
        await sleep(this.state.speed);
    }

    deleteAtTail = async () => {
        const listNodes = this.state.nodes.filter(n => n.type === 'linkedListNode');
        if (listNodes.length === 0) return;

        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // Traverse to the second to last node
        for (let i = 0; i < listNodes.length - 1; i++) {
            const tempNodes = nodes.map((node) => {
                if (node.type === 'linkedListNode') {
                    const listIndex = listNodes.findIndex(n => n.id === node.id);
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            background: listIndex === i ? this.state.iterateColor : node.style.background,
                        }
                    };
                }
                return node;
            });
            this.setState({ nodes: tempNodes });
            await sleep(this.state.speed / 2);
        }

        // Reset colors to original
        const resetNodes = nodes.map(node => {
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
        this.setState({ nodes: resetNodes });

        // Remove last list node
        const nodeToRemove = listNodes[listNodes.length - 1];
        const pointerNodes = resetNodes.filter(n => n.type !== 'linkedListNode');
        const remainingListNodes = listNodes.slice(0, -1);
        const newNodes = [...pointerNodes, ...remainingListNodes];

        // Rebuild edges for linked list nodes
        let newEdges = remainingListNodes.length > 1 ? remainingListNodes.slice(0, -1).map((node, idx) => ({
            id: `edge-${idx}`,
            source: node.id,
            sourceHandle: 'right',
            target: remainingListNodes[idx + 1].id,
            targetHandle: 'left',
            animated: true,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: '#333'
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        })) : [];

        // Update Tail Pointer
        const tailPointerIndex = newNodes.findIndex(n => n.id === 'pointer-tail');
        if (tailPointerIndex !== -1 && remainingListNodes.length > 0) {
            const newTail = remainingListNodes[remainingListNodes.length - 1];
            newNodes[tailPointerIndex] = {
                ...newNodes[tailPointerIndex],
                position: {
                    x: newTail.position.x,
                    y: newTail.position.y + 100
                }
            };

            newEdges.push({
                id: `edge-pointer-tail-${newTail.id}`,
                source: 'pointer-tail',
                target: newTail.id,
                targetHandle: 'bottom',
                animated: true,
                style: { stroke: '#333', strokeWidth: 2 },
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
            });
        }

        // Update Head Pointer edge (head stays the same unless list becomes empty)
        if (remainingListNodes.length > 0) {
            const headPointerEdge = this.state.edges.find(e => e.source === 'pointer-head');
            if (headPointerEdge) {
                newEdges.push(headPointerEdge);
            }
        }

        this.setState({ nodes: newNodes, edges: newEdges });
        await sleep(this.state.speed);
    }

    traverseList = async () => {
        const listNodes = this.state.nodes.filter(n => n.type === 'linkedListNode');

        for (let i = 0; i < listNodes.length; i++) {
            const nodes = this.state.nodes.map((node) => {
                if (node.type === 'linkedListNode') {
                    const listIndex = listNodes.findIndex(n => n.id === node.id);
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            background: listIndex === i ? this.state.iterateColor : node.style.background,
                        }
                    };
                }
                return node;
            });
            this.setState({ nodes });
            await sleep(this.state.speed);
        }

        // Reset colors to original
        const nodes = this.state.nodes.map(node => {
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
        this.setState({ nodes });
    }

    reverseList = async () => {
        const listNodes = this.state.nodes.filter(n => n.type === 'linkedListNode');
        if (listNodes.length <= 1) return;

        const pointerNodes = this.state.nodes.filter(n => n.type === 'circleNode');
        let prev = null;
        let current = 0;
        let edges = [...this.state.edges];

        // Step 1: Visualize pointer reversal
        while (current < listNodes.length) {
            // Highlight current node being processed
            const currentNodes = this.state.nodes.map((node) => {
                if (node.type === 'linkedListNode') {
                    const listIndex = listNodes.findIndex(n => n.id === node.id);
                    return {
                        ...node,
                        style: {
                            ...node.style,
                            background: listIndex === current ? this.state.iterateColor : (listIndex === prev ? '#4CAF50' : node.style.background),
                            border: listIndex === current ? '3px solid #E64A19' : '2px solid #333',
                        }
                    };
                }
                return node;
            });
            this.setState({ nodes: currentNodes });
            await sleep(this.state.speed);

            // Remove the existing outgoing edge from current node
            const edgeIndex = edges.findIndex(e => e.source === listNodes[current].id);
            if (edgeIndex !== -1) {
                edges.splice(edgeIndex, 1);
                this.setState({ edges: [...edges] });
                await sleep(this.state.speed / 2);
            }

            // Add new edge pointing to previous node (if not null)
            if (prev !== null) {
                edges.push({
                    id: `edge-rev-${current}`,
                    source: listNodes[current].id,
                    sourceHandle: 'right',
                    target: listNodes[prev].id,
                    targetHandle: 'left',
                    animated: true,
                    type: 'default', // Use default bezier for backward curves to look better
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        width: 10,
                        height: 10,
                        color: this.state.iterateColor
                    },
                    style: {
                        strokeWidth: 3,
                        stroke: this.state.iterateColor
                    }
                });
                this.setState({ edges: [...edges] });
                await sleep(this.state.speed);
            }

            prev = current;
            current++;
        }

        // Step 2: Re-arrange nodes to reflect new order (Head is now the last processed node)
        await sleep(this.state.speed);

        const reversedListNodes = [...listNodes].reverse().map((node, idx) => ({
            ...node,
            position: { x: 50 + (idx * 150), y: 100 },
            style: {
                ...node.style,
                background: node.style.background,
                border: '2px solid #333',
            }
        }));

        // Re-create standard edges for the new order
        let newEdges = [];
        for (let i = 0; i < reversedListNodes.length - 1; i++) {
            newEdges.push({
                id: `edge-${i}`,
                source: reversedListNodes[i].id,
                sourceHandle: 'right',
                target: reversedListNodes[i + 1].id,
                targetHandle: 'left',
                animated: true,
                type: 'smoothstep',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 10,
                    height: 10,
                    color: '#333'
                },
                style: {
                    strokeWidth: 2,
                    stroke: '#333'
                }
            });
        }

        // Update pointer positions and edges
        const allNodes = [...pointerNodes, ...reversedListNodes];
        const updatedState = this.updatePointerPositions(allNodes, newEdges);

        this.setState({ nodes: updatedState.nodes, edges: updatedState.edges });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const createInitialList = (count, onPointerHover, nodeColor = '#2196F3') => {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 100);
        const nodeId = `node-${i}`;
        nodes.push({
            id: nodeId,
            type: 'linkedListNode',
            data: {
                label: value.toString(),
                nodeId: nodeId,
                onPointerHover: onPointerHover,
            },
            position: { x: 50 + (i * 150), y: 100 },
            style: {
                background: nodeColor,
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        });
    }

    for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
            id: `edge-${i}`,
            source: `node-${i}`,
            sourceHandle: 'right',
            target: `node-${i + 1}`,
            targetHandle: 'left',
            animated: true,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: '#333'
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        });
    }

    return { nodes, edges };
}

const createListFromSequence = (values, onPointerHover, nodeColor = '#2196F3') => {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < values.length; i++) {
        const nodeId = `node-${i}`;
        nodes.push({
            id: nodeId,
            type: 'linkedListNode',
            data: {
                label: values[i].toString(),
                nodeId: nodeId,
                onPointerHover: onPointerHover,
            },
            position: { x: 50 + (i * 150), y: 100 },
            style: {
                background: nodeColor,
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        });
    }

    for (let i = 0; i < nodes.length - 1; i++) {
        edges.push({
            id: `edge-${i}`,
            source: `node-${i}`,
            sourceHandle: 'right',
            target: `node-${i + 1}`,
            targetHandle: 'left',
            animated: true,
            type: 'smoothstep',
            markerEnd: {
                type: MarkerType.ArrowClosed,
                width: 10,
                height: 10,
                color: '#333'
            },
            style: {
                strokeWidth: 2,
                stroke: '#333'
            }
        });
    }

    return { nodes, edges };
}

export default LinkedList;
