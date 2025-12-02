import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = ({ data, style }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(data.label || 'C');

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(data.label || 'C');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(data.label || 'C');
    }
  };

  const finishEditing = () => {
    const newLabel = editValue.trim() || 'C';
    setIsEditing(false);
    if (data.onLabelChange && newLabel !== data.label) {
      data.onLabelChange(data.nodeId, newLabel);
    }
  };

  return (
    <div
      onMouseEnter={() => data.onPointerHover && data.onPointerHover(data.nodeId)}
      onMouseLeave={() => data.onPointerHover && data.onPointerHover(null)}
      onDoubleClick={handleDoubleClick}
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
        cursor: 'pointer',
      }}
    >
      {isEditing ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={finishEditing}
          autoFocus
          maxLength={3}
          style={{
            width: '40px',
            height: '40px',
            textAlign: 'center',
            border: 'none',
            background: 'transparent',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px',
            outline: 'none',
          }}
        />
      ) : (
        data.label || 'C'
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#555' }} />
    </div>
  );
};

export default CircleNode;
