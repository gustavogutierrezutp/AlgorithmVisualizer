import React from 'react';
import { Handle, Position } from '@xyflow/react';

const LinkedListNode = ({ data, style }) => {
    return (
        <div
            style={{
                ...style,
                position: 'relative',
                minWidth: '80px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {/* Right Handle - Source for next pointer */}
            <Handle
                type="source"
                position={Position.Right}
                id="right"
                style={{
                    position: 'absolute',
                    background: '#555',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    right: '-14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            />

            {/* Left Handle - Target for previous pointer */}
            <Handle
                type="target"
                position={Position.Left}
                id="left"
                style={{
                    position: 'absolute',
                    background: '#555',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    left: '-14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                }}
            />

            {/* Node Content */}
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {data.label}
            </div>
        </div>
    );
};

export default LinkedListNode;
