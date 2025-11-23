import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import useStoryStore from '../../store/storyStore';

const DemoPlayer = ({ scene, startNodeId, onClose }) => {
    const { nodes, edges } = useStoryStore();
    const [currentNode, setCurrentNode] = useState(scene ? { data: scene.data, id: 'preview' } : null);
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    useEffect(() => {
        if (startNodeId) {
            const startNode = nodes.find(n => n.id === startNodeId);
            if (startNode) {
                setCurrentNode(startNode);
                setCurrentDialogueIndex(0);
            }
        } else if (scene) {
            // Preview mode
            setCurrentNode({ data: scene.data, id: 'preview' });
            setCurrentDialogueIndex(0);
        }
    }, [startNodeId, scene, nodes]);

    if (!currentNode) return null;

    const { dialogue, background, choices } = currentNode.data;

    // If no dialogue, show choices immediately (or handle empty case)
    const dialogues = dialogue && dialogue.length > 0 ? dialogue : [{ character: 'System', text: '...' }];
    const currentLine = dialogues[currentDialogueIndex];
    const isLastLine = currentDialogueIndex >= dialogues.length - 1;

    const handleAdvance = () => {
        if (!isLastLine) {
            setCurrentDialogueIndex(prev => prev + 1);
        } else if (!choices || choices.length === 0) {
            // Try to auto-advance if there are no choices
            if (startNodeId) {
                const edge = edges.find(e =>
                    e.source === currentNode.id &&
                    (e.sourceHandle === 'default-source' || e.sourceHandle === null)
                );

                if (edge) {
                    const nextNode = nodes.find(n => n.id === edge.target);
                    if (nextNode) {
                        setCurrentNode(nextNode);
                        setCurrentDialogueIndex(0);
                    }
                }
            }
        }
    };

    const handleChoiceClick = (choiceIndex) => {
        if (startNodeId) {
            // Full game mode: find next node
            // We need to find the edge that starts from this node's handle corresponding to the choice
            // The handle ID for choice index i is `choice-${i}`
            const sourceHandleId = `choice-${choiceIndex}`;
            const edge = edges.find(e =>
                e.source === currentNode.id &&
                e.sourceHandle === sourceHandleId
            );

            if (edge) {
                const nextNode = nodes.find(n => n.id === edge.target);
                if (nextNode) {
                    setCurrentNode(nextNode);
                    setCurrentDialogueIndex(0);
                }
            } else {
                console.log("No connection found for this choice");
                // Optional: Show "End of Demo" or stay
            }
        } else {
            // Preview mode: just log or do nothing
            console.log("Preview mode: Choice clicked", choiceIndex);
        }
    };

    return (
        <div className="demo-player" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2000,
            background: background ? `url(${background}) center/cover no-repeat` : '#000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2rem'
        }}>
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Close Preview
            </button>

            <div
                className="dialogue-box glass-panel"
                onClick={handleAdvance}
                style={{
                    padding: '2rem',
                    borderRadius: '1rem',
                    marginBottom: '2rem',
                    minHeight: '150px',
                    cursor: !isLastLine ? 'pointer' : 'default',
                    transition: 'transform 0.1s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.99)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-accent-primary)' }}>
                            {currentLine.character || '???'}
                        </h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{currentLine.text}</p>
                        {!isLastLine && (
                            <div style={{
                                textAlign: 'right',
                                fontSize: '0.8rem',
                                color: 'var(--color-accent-primary)',
                                marginTop: '0.5rem',
                                animation: 'pulse 1s infinite'
                            }}>
                                Click to continue ▼
                            </div>
                        )}
                    </div>
                </div>

                {isLastLine && choices && choices.length > 0 && (
                    <div className="choices-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                        {choices.map((choice, index) => (
                            <button
                                key={index}
                                className="btn-primary"
                                style={{ flex: '1 1 auto' }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleChoiceClick(index);
                                }}
                            >
                                {choice.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemoPlayer;
