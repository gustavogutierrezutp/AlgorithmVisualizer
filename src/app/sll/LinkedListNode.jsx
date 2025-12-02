import React, { useState } from 'react';
import { Handle, Position, useHandleConnections } from '@xyflow/react';

const LinkedListNode = ({ data, style }) => {
    const connections = useHandleConnections({ type: 'source', id: 'right' });
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div
            style={{
                ...style,
                position: 'relative',
                minWidth: '80px',
                minHeight: '40px',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                overflow: 'hidden',
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
                    zIndex: 10,
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
                    zIndex: 10,
                }}
            />

            {/* Top Handle - Target for incoming connections from above */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{
                    position: 'absolute',
                    background: '#555',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    top: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                }}
            />

            {/* Bottom Handle - Source for outgoing connections to below */}
            <Handle
                type="target"
                position={Position.Bottom}
                id="bottom"
                style={{
                    position: 'absolute',
                    background: '#555',
                    width: '12px',
                    height: '12px',
                    border: '2px solid white',
                    bottom: '-14px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10,
                }}
            />

            {/* Data Section */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: 'bold',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRight: '1px solid rgba(0, 0, 0, 0.2)',
            }}>
                {data.label}
            </div>

            {/* Next Pointer Section */}
            <div
                style={{
                    width: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    background: (isHovered && connections.length === 0) ? '#F44336' : 'rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease',
                }}
                onMouseEnter={() => {
                    setIsHovered(true);
                    data.onPointerHover && data.onPointerHover(data.nodeId);
                }}
                onMouseLeave={() => {
                    setIsHovered(false);
                    data.onPointerHover && data.onPointerHover(null);
                }}
            >
                ●
            </div>
        </div>
    );
};

export default LinkedListNode;
