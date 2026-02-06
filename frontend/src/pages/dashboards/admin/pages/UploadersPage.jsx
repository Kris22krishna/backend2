import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Loader2, AlertTriangle, CheckCircle, X, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { api } from '../../../../services/api';

const UploadersPage = () => {
    const [loading, setLoading] = useState(true);
    const [uploaders, setUploaders] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newUploaderName, setNewUploaderName] = useState('');
    const [createdUploader, setCreatedUploader] = useState(null);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const fetchUploaders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getUploaders();
            setUploaders(data || []);
        } catch (err) {
            console.error('Failed to fetch uploaders:', err);
            setError('Failed to load uploaders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploaders();
    }, []);

    const handleCreateUploader = async (e) => {
        e.preventDefault();
        if (!newUploaderName.trim()) return;

        setCreating(true);
        try {
            const result = await api.createUploader(newUploaderName);
            setCreatedUploader(result);
            setNewUploaderName('');
            fetchUploaders(); // Refresh list
        } catch (err) {
            console.error('Failed to create uploader:', err);
            setError('Failed to create uploader. Make sure you are logged in as admin.');
        } finally {
            setCreating(false);
        }
    };

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const closeModal = () => {
        setShowCreateModal(false);
        setCreatedUploader(null);
        setNewUploaderName('');
    };

    // Calculate stats
    const stats = [
        { label: 'Total Uploaders', value: uploaders.length },
        { label: 'Active This Month', value: uploaders.length },
        { label: 'Templates Created', value: uploaders.reduce((sum, u) => sum + (u.template_count || 0), 0) },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Good': return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
            case 'Review': return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: AlertTriangle };
            case 'Problematic': return { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle };
            default: return { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle };
        }
    };

    if (loading && uploaders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Uploaders</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchUploaders}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Plus className="h-5 w-5" />
                        Create Uploader
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Uploader</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Username</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Templates</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploaders.map((uploader) => {
                            const style = getStatusStyle('Good');
                            return (
                                <tr key={uploader.user_id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-6 font-medium text-gray-900">{uploader.name}</td>
                                    <td className="py-4 px-6 text-gray-700 font-mono">{uploader.username}</td>
                                    <td className="py-4 px-6">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                            {uploader.template_count || 0}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-sm ${style.bg} ${style.text}`}>
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {uploaders.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-gray-500">
                                    No uploaders found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Create Uploader Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">
                                {createdUploader ? 'Uploader Created!' : 'Create New Uploader'}
                            </h2>
                            <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6">
                            {createdUploader ? (
                                <div className="space-y-4">
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-green-700 font-medium mb-2">✅ Uploader created successfully!</p>
                                        <p className="text-green-600 text-sm">Share these credentials securely with the uploader.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Username</p>
                                            <div className="flex items-center justify-between">
                                                <code className="text-lg font-mono text-gray-900">{createdUploader.username}</code>
                                                <button
                                                    onClick={() => copyToClipboard(createdUploader.username, 'username')}
                                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                                >
                                                    {copiedField === 'username' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                                            <p className="text-sm text-red-600 mb-1">Access Code (shown only once!)</p>
                                            <div className="flex items-center justify-between">
                                                <code className="text-lg font-mono text-red-700">{createdUploader.access_code}</code>
                                                <button
                                                    onClick={() => copyToClipboard(createdUploader.access_code, 'code')}
                                                    className="p-2 hover:bg-red-100 rounded-lg"
                                                >
                                                    {copiedField === 'code' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-red-500" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateUploader} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Uploader Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newUploaderName}
                                            onChange={(e) => setNewUploaderName(e.target.value)}
                                            placeholder="e.g. John Doe"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        A username and access code will be automatically generated.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating && <Loader2 className="h-5 w-5 animate-spin" />}
                                        {creating ? 'Creating...' : 'Create Uploader'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadersPage;
