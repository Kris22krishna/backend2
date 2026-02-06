import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Reorder, useDragControls } from "framer-motion";

// Helper component for drag handle
const DragHandle = () => (
    <span style={{ cursor: 'grab', color: '#999', padding: '0 10px', fontSize: '1.2em' }}>
        ☰
    </span>
);

const TopicArrangement = () => {
    const [grade, setGrade] = useState(1);
    const [syllabusData, setSyllabusData] = useState({ categories: [] });
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    // Fetch Syllabus Hierarchical Data
    useEffect(() => {
        const fetchSyllabus = async () => {
            setLoading(true);
            setMessage(null);
            try {
                // Use the new hierarchical endpoint
                const data = await api.getGradeSyllabus(grade);
                setSyllabusData(data);
            } catch (err) {
                console.error(err);
                setMessage({ type: 'error', text: 'Failed to load syllabus.' });
            } finally {
                setLoading(false);
            }
        };

        fetchSyllabus();
    }, [grade]);

    const handleSave = async () => {
        setSaving(true);
        try {
            // The backend expects the exact JSON structure of 'categories'
            // We strip out the hydrated 'skills' to save space? 
            // Actually, the backend hydration logic reconstructs skills from IDs.
            // But for saving 'order', we need to save the structure.
            // Let's send the whole categories tree back.
            // The backend model 'SyllabusConfig' stores 'config' as JSON.
            // We should strip minimal info? No, explicit is better.

            // However, we must ensure we don't duplicate data excessively.
            // Ideally we save the "Skeleton": Categories -> Children (Topics) -> Skills (References)

            const cleanStructure = syllabusData.categories.map(cat => ({
                id: cat.id,
                name: cat.name,
                code: cat.code,
                // Nested Topics
                children: (cat.children || []).map(topic => ({
                    id: topic.id,
                    name: topic.name,
                    // Nested Skills (Templates)
                    skills: (topic.skills || []).map(skill => ({
                        id: skill.id,
                        // Minimal reference
                    }))
                })),
                // Direct Skills (if any)
                skills: (cat.skills || []).map(skill => ({
                    id: skill.id
                }))
            }));

            await api.saveSyllabusConfig(grade, cleanStructure);
            setMessage({ type: 'success', text: 'Syllabus order saved!' });
        } catch (err) {
            console.error(err);
            setMessage({ type: 'error', text: 'Failed to save order.' });
        } finally {
            setSaving(false);
        }
    };

    // Handlers for reordering
    const handleCategoryReorder = (newCategories) => {
        setSyllabusData(prev => ({ ...prev, categories: newCategories }));
    };

    const handleTopicReorder = (catId, newTopics) => {
        setSyllabusData(prev => ({
            ...prev,
            categories: prev.categories.map(cat =>
                cat.id === catId ? { ...cat, children: newTopics } : cat
            )
        }));
    };

    // Recursive renderer? Or nested Reorder.Group
    return (
        <div className="arrangement-container" style={{ padding: '20px', maxWidth: '800px' }}>
            <div className="controls" style={{ marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div>
                    <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Grade:</label>
                    <select
                        value={grade}
                        onChange={(e) => setGrade(parseInt(e.target.value))}
                        style={{ padding: '8px', borderRadius: '4px' }}
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>Grade {i + 1}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="save-btn"
                    style={{ background: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {saving ? 'Saving...' : 'Save Layout'}
                </button>
            </div>

            {message && (
                <div style={{
                    padding: '10px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    background: message.type === 'error' ? '#f8d7da' : '#d4edda',
                    color: message.type === 'error' ? '#721c24' : '#155724'
                }}>
                    {message.text}
                </div>
            )}

            {loading ? (
                <div>Loading structure...</div>
            ) : !syllabusData || !syllabusData.categories ? (
                <div>No data available</div>
            ) : (
                <Reorder.Group axis="y" values={syllabusData.categories} onReorder={handleCategoryReorder} style={{ listStyle: 'none', padding: 0 }}>
                    {syllabusData.categories.map((category) => (
                        <Reorder.Item key={category.id} value={category} style={{ marginBottom: '15px' }}>
                            <div className="category-card" style={{
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                background: '#f9f9f9',
                                overflow: 'hidden'
                            }}>
                                {/* Category Header */}
                                <div style={{
                                    padding: '15px',
                                    background: '#eee',
                                    borderBottom: '1px solid #ddd',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: 'bold'
                                }}>
                                    <span>{category.name}</span>
                                    <DragHandle />
                                </div>

                                {/* Nested Topics */}
                                <div style={{ padding: '10px 20px' }}>
                                    {category.children && category.children.length > 0 ? (
                                        <Reorder.Group axis="y" values={category.children} onReorder={(newOrder) => handleTopicReorder(category.id, newOrder)} style={{ listStyle: 'none', padding: 0 }}>
                                            {category.children.map(topic => (
                                                <Reorder.Item key={topic.id} value={topic} style={{ marginBottom: '8px' }}>
                                                    <div style={{
                                                        padding: '10px',
                                                        background: 'white',
                                                        border: '1px solid #eee',
                                                        borderRadius: '4px',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                                    }}>
                                                        <span>{topic.name} <small style={{ color: '#888' }}>({(topic.skills || []).length} skills)</small></span>
                                                        <DragHandle />
                                                    </div>
                                                </Reorder.Item>
                                            ))}
                                        </Reorder.Group>
                                    ) : (
                                        <p style={{ color: '#aaa', fontStyle: 'italic', margin: 0 }}>No topics</p>
                                    )}
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>
            )}
        </div>
    );
};

export default TopicArrangement;
