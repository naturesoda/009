import React from 'react';
import { Edit, Play, BookOpen } from 'lucide-react';

const StartScreen = ({ onNavigate }) => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'var(--color-bg-primary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem'
        }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '1rem' }}>
                    Novel Game Creator
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                    Create, Edit, and Play your own stories.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <button
                    className="glass-panel"
                    onClick={() => onNavigate('editor')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '200px',
                        height: '200px',
                        borderRadius: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Edit size={48} style={{ marginBottom: '1rem', color: 'var(--color-accent-primary)' }} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Edit Game</span>
                </button>

                <button
                    className="glass-panel"
                    onClick={() => onNavigate('play-list')}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '200px',
                        height: '200px',
                        borderRadius: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Play size={48} style={{ marginBottom: '1rem', color: 'var(--color-success)' }} />
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Play Game</span>
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
