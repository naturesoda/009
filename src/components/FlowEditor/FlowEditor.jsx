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

const nodeTypes = {
    sceneNode: SceneNode,
};

const FlowEditor = () => {
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
                choices: []
            },
        };
        addNode(newNode);
    };

    return (
        <div style={{ width: '100vw', height: '100vh', background: 'var(--color-bg-primary)' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 100, display: 'flex', gap: '10px' }}>
                <button
                    className="btn-primary"
                    onClick={handleAddNode}
                >
                    Add Scene
                </button>
                <button
                    className="btn-secondary"
                    onClick={() => setIsPlaying(true)}
                    style={{ background: 'var(--color-success)', color: 'white' }}
                >
                    ▶ Full Game Demo
                </button>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                nodeTypes={nodeTypes}
                fitView
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
