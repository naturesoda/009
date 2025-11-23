import React, { useState } from 'react';
import FlowEditor from './components/FlowEditor/FlowEditor';
import StartScreen from './components/StartScreen/StartScreen';
import GameList from './components/StartScreen/GameList';
import DemoPlayer from './components/Preview/DemoPlayer';
import './App.css';

function App() {
  const [view, setView] = useState('start'); // start, editor, play-list, playing

  const handleNavigate = (newView) => {
    setView(newView);
  };

  return (
    <div className="app-container">
      {view === 'start' && <StartScreen onNavigate={handleNavigate} />}

      {view === 'editor' && (
        <>
          <button
            className="btn-secondary"
            onClick={() => setView('start')}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              zIndex: 1000
            }}
          >
            Exit to Title
          </button>
          <FlowEditor />
        </>
      )}

      {view === 'play-list' && (
        <GameList
          onNavigate={handleNavigate}
          onPlay={() => setView('playing')}
        />
      )}

      {view === 'playing' && (
        <DemoPlayer
          startNodeId="start"
          onClose={() => setView('play-list')}
        />
      )}
    </div>
  );
}

export default App;
