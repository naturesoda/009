import React from 'react';
import { ArrowLeft, PlayCircle } from 'lucide-react';

const GameList = ({ onNavigate, onPlay }) => {
    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'var(--color-bg-primary)',
            padding: '2rem'
        }}>
            <button
                className="btn-secondary"
                onClick={() => onNavigate('start')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}
            >
                <ArrowLeft size={16} /> Back to Title
            </button>

            <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Select a Game</h2>

            <div className="game-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Mock Item for Current Project */}
                <div className="glass-panel" style={{
                    padding: '1.5rem',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                }}>
                    <div style={{
                        height: '150px',
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-text-muted)'
                    }}>
                        Game Thumbnail
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Awesome Story</h3>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            The current project you are working on.
                        </p>
                    </div>
                    <button
                        className="btn-primary"
                        onClick={onPlay}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: 'auto' }}
                    >
                        <PlayCircle size={20} /> Play Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameList;
