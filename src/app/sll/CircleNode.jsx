import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = ({ data, style }) => {
  return (
    <div
      style={{
        ...style,
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: '#FF5722',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        border: '2px solid #E64A19',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {data.label || 'C'}
      <Handle type="target" position={Position.Left} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
};

export default CircleNode;
