"use client";
import React, { Component } from 'react';
import { ReactFlow, Background, Controls, MarkerType, applyNodeChanges, SelectionMode, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

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
    }

    menuRef = React.createRef();

    componentDidMount() {
        this.initializeList(this.state.count);

        // Check if user has seen the tour before
        const hasSeenTour = localStorage.getItem('sll-tour-completed');
        if (!hasSeenTour) {
            setTimeout(() => this.startTour(), 1000);
        }
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
        this.setState({ nodes, edges }, () => {
            if (this.reactFlowInstance) {
                setTimeout(() => {
                    this.reactFlowInstance.fitView({ duration: 500, padding: 0.3 });
                }, 100);
            }
        });
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
            edges: addEdge(params, this.state.edges),
        });
    }

    render() {
        const { hoveredNodeId, highlightHead, highlightTail } = this.state;

        // Apply head and tail highlighting
        const highlightedNodes = this.state.nodes.map((node, idx) => {
            if (idx === 0 && highlightHead) {
                return {
                    ...node,
                    style: {
                        ...node.style,
                        background: '#9C27B0', // Purple for head
                        border: '3px solid #7B1FA2',
                    }
                };
            }
            if (idx === this.state.nodes.length - 1 && highlightTail) {
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
        const highlightedEdges = this.state.edges.map(edge => {
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
                    />
                    <div id="canvas-area" className="flex flex-1 flex-col items-center justify-center overflow-auto bg-gray-50 relative">
                        {this.state.nodes.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                                    <p className="text-2xl font-semibold text-gray-400 mb-2">Empty List</p>
                                    <p className="text-sm text-gray-500">Create a list to get started</p>
                                </div>
                            </div>
                        )}
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
                            selectionMode={SelectionMode.Partial}
                            selectionOnDrag={true}
                            panOnScroll={true}
                            panOnDrag={[1, 2]}
                            onInit={(instance) => this.reactFlowInstance = instance}
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </div>
            </div>
        );
    }
    handleCreateEmpty = () => {
        this.setState({ nodes: [], edges: [] }, () => {
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
            this.setState({ nodes, edges }, () => {
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
            data: { label: 'C' },
            position: {
                x: Math.random() * 400 + 50,
                y: Math.random() * 400 + 50
            },
        };
        this.setState(prevState => ({
            nodes: [...prevState.nodes, newNode]
        }));
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
            default:
                await this.traverseList();
        }

        this.setState({ isRunning: false });
    }

    insertAtHead = async (value) => {
        const existingNodes = [...this.state.nodes];

        // Add new node at same Y as first node, fixed distance before it in X
        const firstNode = existingNodes.length > 0 ? existingNodes[0] : null;
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

        const nodes = [newNode, ...existingNodes];

        const edges = nodes.length > 1 ? nodes.slice(0, -1).map((node, idx) => ({
            id: `edge-${idx}`,
            source: node.id,
            sourceHandle: 'right',
            target: nodes[idx + 1].id,
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
        if (this.state.nodes.length === 0) return;

        const nodes = this.state.nodes.slice(1).map((node, idx) => ({
            ...node,
            position: { x: 50 + (idx * 150), y: 100 }
        }));

        const edges = nodes.length > 1 ? nodes.slice(0, -1).map((node, idx) => ({
            id: `edge-${idx}`,
            source: node.id,
            sourceHandle: 'right',
            target: nodes[idx + 1].id,
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

        this.setState({ nodes, edges });
        await sleep(this.state.speed);
    }

    insertAtTail = async (value) => {
        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // Traverse to the end
        for (let i = 0; i < nodes.length; i++) {
            const tempNodes = nodes.map((node, idx) => ({
                ...node,
                style: {
                    ...node.style,
                    background: idx === i ? this.state.iterateColor : node.style.background,
                }
            }));
            this.setState({ nodes: tempNodes });
            await sleep(this.state.speed / 2);
        }

        // Reset colors to original
        const resetNodes = nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                background: node.style.background,
            }
        }));
        this.setState({ nodes: resetNodes });

        // Add new node at same Y as last node, fixed distance in X
        const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;
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
        if (nodes.length > 0) {
            edges.push({
                id: `edge-${nodes.length - 1}`,
                source: nodes[nodes.length - 1].id,
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
        if (this.state.nodes.length === 0) return;

        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // Traverse to the second to last node
        for (let i = 0; i < nodes.length - 1; i++) {
            const tempNodes = nodes.map((node, idx) => ({
                ...node,
                style: {
                    ...node.style,
                    background: idx === i ? this.state.iterateColor : node.style.background,
                }
            }));
            this.setState({ nodes: tempNodes });
            await sleep(this.state.speed / 2);
        }

        // Reset colors to original
        const resetNodes = nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                background: node.style.background,
            }
        }));
        this.setState({ nodes: resetNodes });

        // Remove last node and edge
        const newNodes = resetNodes.slice(0, -1);
        const newEdges = edges.slice(0, -1);

        this.setState({ nodes: newNodes, edges: newEdges });
        await sleep(this.state.speed);
    }

    traverseList = async () => {
        for (let i = 0; i < this.state.nodes.length; i++) {
            const nodes = this.state.nodes.map((node, idx) => ({
                ...node,
                style: {
                    ...node.style,
                    background: idx === i ? this.state.iterateColor : node.style.background,
                }
            }));
            this.setState({ nodes });
            await sleep(this.state.speed);
        }

        // Reset colors to original
        const nodes = this.state.nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                background: node.style.background,
            }
        }));
        this.setState({ nodes });
    }

    reverseList = async () => {
        if (this.state.nodes.length <= 1) return;

        let prev = null;
        let current = 0;
        const nodes = [...this.state.nodes];
        let edges = [...this.state.edges];

        // Step 1: Visualize pointer reversal
        while (current < nodes.length) {
            // Highlight current node being processed
            const currentNodes = nodes.map((node, idx) => ({
                ...node,
                style: {
                    ...node.style,
                    background: idx === current ? this.state.iterateColor : (idx === prev ? '#4CAF50' : node.style.background),
                    border: idx === current ? '3px solid #E64A19' : '2px solid #333',
                }
            }));
            this.setState({ nodes: currentNodes });
            await sleep(this.state.speed);

            // Remove the existing outgoing edge from current node
            const edgeIndex = edges.findIndex(e => e.source === nodes[current].id);
            if (edgeIndex !== -1) {
                edges.splice(edgeIndex, 1);
                this.setState({ edges: [...edges] });
                await sleep(this.state.speed / 2);
            }

            // Add new edge pointing to previous node (if not null)
            if (prev !== null) {
                edges.push({
                    id: `edge-rev-${current}`,
                    source: nodes[current].id,
                    sourceHandle: 'right',
                    target: nodes[prev].id,
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

        const reversedNodes = [...this.state.nodes].reverse().map((node, idx) => ({
            ...node,
            position: { x: 50 + (idx * 150), y: 100 },
            style: {
                ...node.style,
                background: node.style.background,
                border: '2px solid #333',
            }
        }));

        // Re-create standard edges for the new order
        const newEdges = [];
        for (let i = 0; i < reversedNodes.length - 1; i++) {
            newEdges.push({
                id: `edge-${i}`,
                source: reversedNodes[i].id,
                sourceHandle: 'right',
                target: reversedNodes[i + 1].id,
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

        this.setState({ nodes: reversedNodes, edges: newEdges });
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
