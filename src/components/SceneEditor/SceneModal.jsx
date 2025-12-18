import React, { useState, useEffect } from 'react';
import { X, Play, Image as ImageIcon, MessageSquare, List, Plus, Trash2 } from 'lucide-react';
import useStoryStore from '../../store/storyStore';
import DemoPlayer from '../Preview/DemoPlayer';

const SceneModal = ({ nodeId, onClose }) => {
    const { nodes, updateNodeData } = useStoryStore();
    const node = nodes.find((n) => n.id === nodeId);

    const [formData, setFormData] = useState({
        label: '',
        dialogue: [],
        background: '',
        choices: [],
        dialogueBoxStyle: { color: '#000000', alpha: 0.8 }
    });

    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (node) {
            setFormData({
                label: node.data.label || '',
                dialogue: node.data.dialogue || [{ character: 'Narrator', text: node.data.text || '' }],
                background: node.data.background || '',
                choices: node.data.choices || [],
                dialogueBoxStyle: node.data.dialogueBoxStyle || { color: '#000000', alpha: 0.8 }
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
                justifyContent: 'center',
                padding: '20px'
            }}>
                <div className="modal-content glass-panel" style={{
                    width: '800px',
                    maxWidth: '100%',
                    height: '90vh',
                    borderRadius: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Fixed Header */}
                    <div className="modal-header" style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--color-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'rgba(15, 23, 42, 0.95)',
                        zIndex: 10
                    }}>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Edit Scene</h2>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-primary"
                                onClick={() => setShowPreview(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                            >
                                <Play size={16} /> Preview
                            </button>
                            <button
                                onClick={onClose}
                                style={{
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Content */}
                    <div className="modal-body" style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1.5rem',
                        paddingBottom: '100px' // Space for fixed footer
                    }}>
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
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ color: 'var(--color-text-secondary)', maxWidth: '100%' }}
                                />
                                <span style={{ color: 'var(--color-text-muted)' }}>OR</span>
                                <input
                                    className="input-field"
                                    value={formData.background}
                                    onChange={(e) => handleChange('background', e.target.value)}
                                    placeholder="Image URL"
                                    style={{ flex: 1, minWidth: '200px' }}
                                />
                            </div>
                            {formData.background && (
                                <div style={{ marginTop: '0.5rem', borderRadius: '0.5rem', overflow: 'hidden', height: '100px' }}>
                                    <img src={formData.background} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>

                        {/* Dialogue Style Editor */}
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Dialogue Box Style</label>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }}>Color</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {['#000000', '#1e293b', '#475569', '#ffffff', '#ef4444', '#3b82f6', '#10b981'].map(color => (
                                            <button
                                                key={color}
                                                onClick={() => handleChange('dialogueBoxStyle', { ...formData.dialogueBoxStyle, color })}
                                                style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    borderRadius: '50%',
                                                    background: color,
                                                    border: formData.dialogueBoxStyle?.color === color ? '2px solid var(--color-accent-primary)' : '1px solid var(--color-border)',
                                                    cursor: 'pointer',
                                                    padding: 0
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div style={{ flex: 1, minWidth: '150px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.25rem', display: 'block' }}>
                                        Opacity: {Math.round((formData.dialogueBoxStyle?.alpha || 0.8) * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={formData.dialogueBoxStyle?.alpha || 0.8}
                                        onChange={(e) => handleChange('dialogueBoxStyle', { ...formData.dialogueBoxStyle, alpha: parseFloat(e.target.value) })}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dialogue Editor */}
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
                                <MessageSquare size={16} /> Dialogue
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {(formData.dialogue || []).map((item, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        padding: '0.75rem',
                                        background: 'rgba(255,255,255,0.05)',
                                        borderRadius: '0.5rem',
                                        border: '1px solid var(--color-border)',
                                        flexDirection: 'column'
                                    }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <input
                                                className="input-field"
                                                value={item.character}
                                                onChange={(e) => updateDialogue(index, 'character', e.target.value)}
                                                placeholder="Name"
                                                style={{ width: '30%' }}
                                            />
                                            <button
                                                className="btn-secondary"
                                                onClick={() => removeDialogue(index)}
                                                style={{ color: 'var(--color-danger)', padding: '0.25rem 0.5rem', marginLeft: 'auto' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <textarea
                                            className="input-field"
                                            value={item.text}
                                            onChange={(e) => updateDialogue(index, 'text', e.target.value)}
                                            placeholder="What they say..."
                                            rows={2}
                                            style={{ resize: 'vertical' }}
                                        />
                                    </div>
                                ))}
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
                                            onClick={() => removeChoice(i