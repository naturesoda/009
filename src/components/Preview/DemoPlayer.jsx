import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

const DemoPlayer = ({ scene, onClose }) => {
    if (!scene) return null;

    const { dialogue, background, choices } = scene.data;
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);

    // If no dialogue, show choices immediately (or handle empty case)
    const dialogues = dialogue && dialogue.length > 0 ? dialogue : [{ character: 'System', text: '...' }];
    const currentLine = dialogues[currentDialogueIndex];
    const isLastLine = currentDialogueIndex >= dialogues.length - 1;

    const handleAdvance = () => {
        if (!isLastLine) {
            setCurrentDialogueIndex(prev => prev + 1);
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
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--color-accent-primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        {currentLine.character ? currentLine.character.charAt(0) : <MessageSquare color="white" />}
                    </div>
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
