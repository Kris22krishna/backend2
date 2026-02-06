import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UploaderManagement = ({ onCreateUploader, createdUploader }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploaders, setUploaders] = useState([]);

    const fetchUploaders = async () => {
        try {
            const data = await api.getUploaders();
            setUploaders(data);
        } catch (error) {
            console.error("Failed to fetch uploaders:", error);
        }
    };

    useEffect(() => {
        fetchUploaders();
    }, [createdUploader]); // Refresh when new uploader created

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onCreateUploader(name);
            setName('');
            fetchUploaders();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px' }}>
            <h2 style={{ marginBottom: '24px' }}>User Management (Uploaders)</h2>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Side: Create Form */}
                <div style={{ flex: '1', minWidth: '350px' }}>
                    <div className="form-section">
                        <h4>Create New Uploader</h4>
                        <form onSubmit={handleSubmit} className="form-grid">
                            <div className="form-group">
                                <label>Uploader Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. John Doe"
                                    required
                                />
                            </div>
                            <button type="submit" className="save-btn" disabled={loading} style={{ width: '100%' }}>
                                {loading ? 'Generating...' : 'Generate Access Code'}
                            </button>
                        </form>
                    </div>

                    {createdUploader && (
                        <div style={{
                            marginTop: '24px',
                            padding: '24px',
                            background: '#f0fdf4',
                            border: '1px solid #86efac',
                            borderRadius: '12px',
                            color: '#166534',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                        }}>
                            <h3 style={{ marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                ✅ Uploader Created!
                            </h3>
                            <p style={{ marginBottom: '16px', fontSize: '0.95rem' }}>Please share these credentials securely:</p>
                            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                <p style={{ margin: '8px 0' }}><strong>Username:</strong> <code style={{ fontSize: '1.2em', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{createdUploader.username}</code></p>
                                <p style={{ margin: '8px 0' }}><strong>Access Code:</strong> <code style={{ fontSize: '1.2em', color: '#dc2626', background: '#fef2f2', padding: '2px 6px', borderRadius: '4px' }}>{createdUploader.access_code}</code></p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side: List */}
                <div style={{ flex: '1.5', minWidth: '400px' }}>
                    <div className="form-section">
                        <h4>Existing Uploaders</h4>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b' }}>
                                        <th style={{ padding: '12px 8px', fontWeight: '600' }}>Name</th>
                                        <th style={{ padding: '12px 8px', fontWeight: '600' }}>Username</th>
                                        <th style={{ padding: '12px 8px', fontWeight: '600' }}>Access Code</th>
                                        <th style={{ padding: '12px 8px', fontWeight: '600', textAlign: 'center' }}>Templates</th>
                                        <th style={{ padding: '12px 8px', fontWeight: '600', textAlign: 'right' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploaders.map(u => (
                                        <tr key={u.user_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '12px 8px', fontWeight: '600', color: '#1e293b' }}>{u.name}</td>
                                            <td style={{ padding: '12px 8px', color: '#64748b' }}>{u.username}</td>
                                            <td style={{ padding: '12px 8px' }}>
                                                <span style={{
                                                    background: '#f1f5f9',
                                                    color: '#94a3b8',
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    fontSize: '0.85em',
                                                    fontFamily: 'monospace'
                                                }}>
                                                    ••••••••
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                                                <span style={{
                                                    background: '#e0e7ff',
                                                    color: '#4f46e5',
                                                    padding: '4px 10px',
                                                    borderRadius: '999px',
                                                    fontWeight: '600',
                                                    fontSize: '0.85em'
                                                }}>
                                                    {u.template_count}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 8px', color: '#10b981', textAlign: 'right', fontSize: '0.85em', fontWeight: '500' }}>
                                                Active
                                            </td>
                                        </tr>
                                    ))}
                                    {uploaders.length === 0 && (
                                        <tr>
                                            <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>
                                                No uploaders found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UploaderManagement;
