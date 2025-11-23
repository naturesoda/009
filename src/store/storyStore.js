import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useStoryStore = create((set, get) => ({
  nodes: [
    {
      id: 'start',
      type: 'sceneNode',
      position: { x: 250, y: 25 },
      data: {
        label: 'Start Scene',
        dialogue: [{ character: 'System', text: 'Welcome to your new story!' }],
        background: '',
        choices: [],
        dialogueBoxStyle: { color: '#000000', alpha: 0.8 }
      },
    },
  ],
  edges: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },

  setStory: (nodes, edges) => {
    set({ nodes, edges });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
  },
}));

export default useStoryStore;
