import React, { useState, useEffect } from 'react';
import { X, Play, Image as ImageIcon, MessageSquare, List, Plus, Trash2 } from 'lucide-react';
import useStoryStore from '../../store/storyStore';
import DemoPlayer from '../Preview/DemoPlayer';

const SceneModal = ({ nodeId, onClose }) => {
    const { nodes, updateNodeData } = useStoryStore();
    const node = nodes.find((n) => n.id === nodeId);

    const [formData, setFormData] = useState({
        label: '',
        dialogue: [], // Changed from text to dialogue array
        background: '',
        choices: []
    });

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (node) {
            setFormData({
                label: node.data.label || '',
                dialogue: node.data.dialogue || [{ character: 'Narrator', text: node.data.text || '' }], // Migrate old text to new format
                background: node.data.background || '',
                choices: node.data.choices || []
            });
        }
    }, [node]);

    if (!node) return null;

    const handleChange = (field, value) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        updateNodeData(nodeId, newData);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleChange('background', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addDialogue = () => {
        const newDialogue = [...(formData.dialogue || []), { character: '', text: '' }];
        handleChange('dialogue', newDialogue);
    };

    const updateDialogue = (index, field, value) => {
        const newDialogue = [...(formData.dialogue || [])];
        newDialogue[index] = { ...newDialogue[index], [field]: value };
        handleChange('dialogue', newDialogue);
    };

    const removeDialogue = (index) => {
        const newDialogue = (formData.dialogue || []).filter((_, i) => i !== index);
        handleChange('dialogue', newDialogue);
    };

    const addChoice = () => {
        const newChoices = [...formData.choices, { label: 'New Choice', targetId: '' }];
        handleChange('choices', newChoices);
    };

    const updateChoice = (index, field, value) => {
        const newChoices = [...formData.choices];
        newChoices[index] = { ...newChoices[index], [field]: value };
        handleChange('choices', newChoices);
    };

    const removeChoice = (index) => {
        const newChoices = formData.choices.filter((_, i) => i !== index);
        handleChange('choices', newChoices);
    };

    return (
        <>
            <div className="modal-overlay" style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="modal-content glass-panel" style={{
                    width: '800px',
                    maxWidth: '90%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    borderRadius: '1rem',
                    padding: '2rem',
                    position: 'relative'
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            color: 'var(--color-text-muted)'
                        }}
                    >
                        <X />
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Edit Scene</h2>
                        <button
                            className="btn-primary"
                            onClick={() => setShowPreview(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <Play size={16} /> Preview
                        </button>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Scene Name</label>
                        <input
                            className="input-field"
                            value={formData.label}
                            onChange={(e) => handleChange('label', e.target.value)}
                            placeholder="e.g. Intro Scene"
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            <ImageIcon size={16} /> Background Image
                        </label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ color: 'var(--color-text-secondary)' }}
                            />
                            <span style={{ color: 'var(--color-text-muted)' }}>OR</span>
                            <input
                                className="input-field"
                                value={formData.background}
                                onChange={(e) => handleChange('background', e.target.value)}
                                placeholder="Image URL"
                                style={{ flex: 1 }}
                            />
                        </div>
                        {formData.background && (
                            <div style={{ marginTop: '0.5rem', borderRadius: '0.5rem', overflow: 'hidden', height: '100px' }}>
                                <img src={formData.background} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            <MessageSquare size={16} /> Dialogue (SNS Style)
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(formData.dialogue || []).map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    gap: '1rem',
                                    padding: '1rem',
                                    background: 'rgba(255,255,255,0.05)',
                                    borderRadius: '0.5rem',
                                    border: '1px solid var(--color-border)'
                                }}>
                                    <div style={{ width: '150px' }}>
                                        <input
                                            className="input-field"
                                            value={item.character}
                                            onChange={(e) => updateDialogue(index, 'character', e.target.value)}
                                            placeholder="Character Name"
                                            style={{ marginBottom: '0.5rem' }}
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <textarea
                                            className="input-field"
                                            value={item.text}
                                            onChange={(e) => updateDialogue(index, 'text', e.target.value)}
                                            placeholder="What do they say?"
                                            rows={3}
                                            style={{ resize: 'vertical', height: '100%' }}
                                        />
                                    </div>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => removeDialogue(index)}
                                        style={{ color: 'var(--color-danger)', alignSelf: 'flex-start' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="btn-secondary"
                                onClick={addDialogue}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <Plus size={16} /> Add Dialogue Line
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            <List size={16} /> Choices
                        </label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {formData.choices.map((choice, index) => (
                                <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        className="input-field"
                                        value={choice.label}
                                        onChange={(e) => updateChoice(index, 'label', e.target.value)}
                                        placeholder="Choice Text"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        className="btn-secondary"
                                        onClick={() => removeChoice(index)}
                                        style={{ color: 'var(--color-danger)' }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <button
                                className="btn-secondary"
                                onClick={addChoice}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}
                            >
                                <Plus size={16} /> Add Choice
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPreview && (
                <DemoPlayer
                    scene={{ data: formData }}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </>
    );
};

export default SceneModal;
