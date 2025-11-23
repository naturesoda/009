import React, { useRef } from 'react';
import { Edit, Play, Upload } from 'lucide-react';
import { loadGame } from '../../utils/fileUtils';
import useStoryStore from '../../store/storyStore';

const StartScreen = ({ onNavigate }) => {
    const fileInputRef = useRef(null);
    const { setStory } = useStoryStore();
    const [mode, setMode] = React.useState(null); // 'edit' or 'play'

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const data = await loadGame(file);
                if (data.nodes && data.edges) {
                    setStory(data.nodes, data.edges);
                    if (mode === 'edit') {
                        onNavigate('editor');
                    } else if (mode === 'play') {
                        onNavigate('playing');
                    }
                }
            } catch (error) {
                console.error('Failed to load game:', error);
                alert('Failed to load game file.');
            }
        }
        // Reset input
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleLoadClick = (selectedMode) => {
        setMode(selectedMode);
        fileInputRef.current.click();
    };

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
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleFileChange}
            />

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-accent-primary)', marginBottom: '1rem' }}>
                    Novel Game Creator
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)' }}>
                    Create, Edit, and Play your own stories.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="glass-panel"
                        onClick={() => onNavigate('editor')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '150px',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Edit size={32} style={{ marginBottom: '0.5rem', color: 'var(--color-accent-primary)' }} />
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>New Game</span>
                    </button>
                    <button
                        className="glass-panel"
                        onClick={() => handleLoadClick('edit')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '200px',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)'
                        }}
                    >
                        <Upload size={16} /> Load for Edit
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        className="glass-panel"
                        onClick={() => handleLoadClick('play')}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '200px',
                            height: '150px',
                            borderRadius: '1rem',
                            cursor: 'pointer',
                            transition: 'transform 0.2s',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-primary)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <Play size={32} style={{ marginBottom: '0.5rem', color: 'var(--color-success)' }} />
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Play File</span>
                    </button>
                    <button
                        className="glass-panel"
                        onClick={() => onNavigate('play-list')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '200px',
                            padding: '1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-text-secondary)'
                        }}
                    >
                        Game List
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartScreen;
