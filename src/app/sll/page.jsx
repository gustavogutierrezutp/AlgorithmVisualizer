"use client";
import React, { Component } from 'react';
import { ReactFlow, Background, Controls, MarkerType, applyNodeChanges } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Navbar from '@/components/navbar';
import Menu from "./menu";
import LinkedListNode from './LinkedListNode';

const nodeTypes = {
    linkedListNode: LinkedListNode,
};

class LinkedList extends Component {
    state = {
        count: 5,
        nodes: [],
        edges: [],
        speed: 500,
        isRunning: false,
        operation: 0, // 0: insert, 1: delete, 2: search, 3: reverse
    }

    componentDidMount() {
        this.initializeList(this.state.count);
    }

    initializeList = (count) => {
        const { nodes, edges } = createInitialList(count);
        this.setState({ nodes, edges });
    }

    onNodesChange = (changes) => {
        this.setState({
            nodes: applyNodeChanges(changes, this.state.nodes)
        });
    }

    render() {
        return (
            <div className="flex flex-col h-screen">
                <Navbar title="Linked List Visualizer" />

                <div className="flex flex-1 overflow-hidden">
                    <Menu
                        disable={this.state.isRunning}
                        onVisualize={this.handleVisualize}
                        onRandomize={this.handleRandomize}
                        onCountChange={this.handleCountChange}
                        onOperationChanged={this.handleOperationChanged}
                        onSpeedChange={this.handleSpeedChanged}
                    />
                    <div className="flex flex-1 flex-col items-center justify-center overflow-auto bg-gray-50">
                        <ReactFlow
                            nodes={this.state.nodes}
                            edges={this.state.edges}
                            onNodesChange={this.onNodesChange}
                            nodeTypes={nodeTypes}
                            fitView
                            nodesDraggable={true}
                            nodesConnectable={false}
                            elementsSelectable={true}
                        >
                            <Background />
                            <Controls />
                        </ReactFlow>
                    </div>
                </div>
            </div>
        );
    }
    handleRandomize = () => {
        this.initializeList(this.state.count);
    }

    handleCountChange = (val) => {
        this.setState({ count: val });
        this.initializeList(val);
    }

    handleOperationChanged = (val) => {
        this.setState({ operation: val });
    }

    handleSpeedChanged = (val) => {
        const speed = (1000 - val * 9);
        this.setState({ speed });
    }

    handleVisualize = async () => {
        this.setState({ isRunning: true });

        // Placeholder for different operations
        switch (this.state.operation) {
            case 0:
                await this.insertAtHead(Math.floor(Math.random() * 100));
                break;
            case 1:
                await this.deleteAtHead();
                break;
            case 2:
                await this.traverseList();
                break;
            case 3:
                await this.reverseList();
                break;
            default:
                await this.traverseList();
        }

        this.setState({ isRunning: false });
    }

    insertAtHead = async (value) => {
        // Demo implementation - add new node at head
        const newNode = {
            id: `node-${Date.now()}`,
            type: 'linkedListNode',
            data: { label: value.toString() },
            position: { x: 50, y: 100 },
            style: {
                background: '#4CAF50',
                color: 'white',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '16px',
                fontWeight: 'bold',
            }
        };

        const nodes = [newNode, ...this.state.nodes.map((node, idx) => ({
            ...node,
            position: { x: 200 + (idx * 150), y: 100 }
        }))];

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
                width: 20,
                height: 20,
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
                width: 20,
                height: 20,
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

    traverseList = async () => {
        for (let i = 0; i < this.state.nodes.length; i++) {
            const nodes = this.state.nodes.map((node, idx) => ({
                ...node,
                style: {
                    ...node.style,
                    background: idx === i ? '#FF5722' : '#2196F3',
                }
            }));
            this.setState({ nodes });
            await sleep(this.state.speed);
        }

        // Reset colors
        const nodes = this.state.nodes.map(node => ({
            ...node,
            style: {
                ...node.style,
                background: '#2196F3',
            }
        }));
        this.setState({ nodes });
    }

    reverseList = async () => {
        // Placeholder for reverse operation
        const nodes = [...this.state.nodes].reverse().map((node, idx) => ({
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
                width: 20,
                height: 20,
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
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const createInitialList = (count) => {
    const nodes = [];
    const edges = [];

    for (let i = 0; i < count; i++) {
        const value = Math.floor(Math.random() * 100);
        nodes.push({
            id: `node-${i}`,
            type: 'linkedListNode',
            data: { label: value.toString() },
            position: { x: 50 + (i * 150), y: 100 },
            style: {
                background: '#2196F3',
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
                width: 20,
                height: 20,
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
