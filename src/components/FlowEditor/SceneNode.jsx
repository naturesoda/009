import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Image as ImageIcon } from 'lucide-react';

const SceneNode = ({ data, isConnectable }) => {
    return (
        <div className="scene-node glass-panel" style={{
            padding: '10px',
            borderRadius: '8px',
            minWidth: '150px',
            border: '1px solid var(--color-border)',
            background: 'rgba(30, 41, 59, 0.9)'
        }}>
            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                style={{
                    background: 'var(--color-accent-primary)',
                    width: '12px',
                    height: '12px',
                    top: '-6px'
                }}
            />

            <div className="node-header" style={{
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '5px',
                marginBottom: '5px',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: 'var(--color-accent-primary)'
            }}>
                {data.label}
            </div>

            <div className="node-content" style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                    <MessageSquare size={12} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                        {data.dialogue && data.dialogue.length > 0 ? data.dialogue[0].text : (data.text || 'No text...')}
                    </span>
                </div>
                {data.background && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <ImageIcon size={12} />
                        <span>Has Background</span>
                    </div>
                )}
            </div>

            {/* Default Source Handle if no choices */}
            {(!data.choices || data.choices.length === 0) && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="default-source"
                    isConnectable={isConnectable}
                    style={{
                        background: 'var(--color-accent-primary)',
                        width: '12px',
                        height: '12px',
                        bottom: '-6px'
                    }}
                />
            )}

            {/* Dynamic Handles for Choices */}
            {data.choices && data.choices.map((choice, index) => (
                <div key={index} style={{ position: 'relative', marginTop: '5px', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.7rem', marginRight: '10px' }}>{choice.label}</span>
                    <Handle
                        type="source"
                        position={Position.Right}
                        id={`choice-${index}`}
                        isConnectable={isConnectable}
                        style={{
                            top: '50%',
                            background: 'var(--color-success)',
                            width: '12px',
                            height: '12px',
                            right: '-6px'
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default memo(SceneNode);
