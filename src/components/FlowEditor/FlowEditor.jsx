import React, { useCallback } from 'react';
import ReactFlow, {
    Background,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import useStoryStore from '../../store/storyStore';
import SceneNode from './SceneNode';
import SceneModal from '../SceneEditor/SceneModal';
import DemoPlayer from '../Preview/DemoPlayer';
import { saveGame } from '../../utils/fileUtils';

const nodeTypes = {
    sceneNode: SceneNode,
};

const FlowEditor = ({ onExit }) => {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode
    } = useStoryStore();

    const [selectedNodeId, setSelectedNodeId] = React.useState(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const handleNodeClick = useCallback((event, node) => {
        setSelectedNodeId(node.id);
    }, []);

    const handleCloseModal = () => {
        setSelectedNodeId(null);
    };

    const handleAddNode = () => {
        const id = `scene-${Date.now()}`;
        const newNode = {
            id,
            type: 'sceneNode',
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            data: {
                label: 'New Scene',
                dialogue: [],
                background: '',
                choices: [],
                dialogueBoxStyle: { color: '#000000', alpha: 0.8 }
            },
        };
        addNode(newNode);
    };

    const handleExit = () => {
        if (nodes.length > 0) {
            if (window.confirm('Unsaved changes may be lost. Are you sure you want to exit?')) {
                onExit();
            }
        } else {
            onExit();
        }
    };

    // Edge Deletion Logic
    const lastEdgeClickRef = React.useRef(0);

    const handleEdgeAction = (edge) => {
        if (window.confirm('Disconnect this scene?')) {
            onEdgesChange([{ id: edge.id, type: 'remove' }]);
        }
    };

    const onEdgeClick = React.useCallback((event, edge) => {
        const now = Date.now();
        if (now - lastEdgeClickRef.current < 300) {
            // Double click detected
            handleEdgeAction(edge);
        }
        lastEdgeClickRef.current = now;
    }, [onEdgesChange]);

    const onEdgeContextMenu = React.useCallback((event, edge) => {
        event.preventDefault();
        handleEdgeAction(edge);
    }, [onEdgesChange]);

    // Prevent accidental browser navigation
    React.useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (nodes.length > 0) {
                e.preventDefault();
                e.returnValue = ''; // Chrome requires returnValue to be set
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [nodes]);

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'var(--color-bg-primary)' }}>
            {/* Fixed Header Bar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '60px',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-border)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 20px',
                boxSizing: 'border-box' // Ensure padding doesn't affect width
            }}>
                <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingRight: '10px' }}>
                    {/* Mobile-friendly buttons wrapper */}
                    <style>
                        {`
                            @media (max-width: 600px) {
                                .header-btn-text { display: none; }
                                .btn-primary, .btn-secondary { padding: 8px 12px !important; }
                            }
                        `}
                    </style>
                    <button
                        className="btn-primary"
                        onClick={handleAddNode}
                        title="Add Scene"
                    >
                        + <span className="header-btn-text">Scene</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsPlaying(true)}
                        style={{ background: 'var(--color-success)', color: 'white' }}
                        title="Play"
                    >
                        ▶ <span className="header-btn-text">Play</span>
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => saveGame({ nodes, edges }, 'my-novel-game.json')}
                        style={{ background: 'var(--color-accent-primary)', color: 'white' }}
                        title="Save"
                    >
                        💾 <span className="header-btn-text">Save</span>
                    </button>
                </div>

                <button
                    className="btn-secondary"
                    onClick={handleExit}
                    style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                    title="Exit"
                >
                    Exit
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                onEdgeClick={onEdgeClick}
                onEdgeContextMenu={onEdgeContextMenu}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={4}
            >
                <Background color="#334155" gap={16} />
                <MiniMap
                    nodeColor={() => 'var(--color-accent-primary)'}
                    maskColor="rgba(15, 23, 42, 0.8)"
                    style={{ background: 'var(--color-bg-secondary)' }}
                />
            </ReactFlow>

            {selectedNodeId && (
                <SceneModal
                    nodeId={selectedNodeId}
                    onClose={handleCloseModal}
                />
            )}

            {isPlaying && (
                <DemoPlayer
                    startNodeId="start"
                    onClose={() => setIsPlaying(false)}
                />
            )}
        </div>
    );
};

export default FlowEditor;
