import React, { useState, useEffect } from 'react';
import { UploadCloud, Plus, Loader2, RefreshCw, X, Copy, Check, Mail } from 'lucide-react';
import { api } from '../../../../services/api';

const AssessmentUploadersPage = () => {
    const [loading, setLoading] = useState(true);
    const [uploaders, setUploaders] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newUploaderEmail, setNewUploaderEmail] = useState('');
    const [createdUploader, setCreatedUploader] = useState(null);
    const [error, setError] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    const fetchUploaders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAssessmentUploaders();
            setUploaders(data || []);
        } catch (err) {
            console.error('Failed to fetch assessment uploaders:', err);
            setError('Failed to load assessment uploaders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUploaders();
    }, []);

    const handleCreateUploader = async (e) => {
        e.preventDefault();
        if (!newUploaderEmail.trim()) return;

        setCreating(true);
        try {
            const result = await api.createAssessmentUploader(newUploaderEmail);
            setCreatedUploader(result);
            setNewUploaderEmail('');
            fetchUploaders(); // Refresh list
        } catch (err) {
            console.error('Failed to create uploader:', err);
            setError(err.message || 'Failed to create uploader.');
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
        setNewUploaderEmail('');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Assessment Uploaders</h1>
                    <p className="text-gray-500 mt-1">Manage assessment uploaders and generate access codes.</p>
                </div>
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
                        Create New
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Created At</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {uploaders.map((uploader) => (
                            <tr key={uploader.user_id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-4 px-6 font-medium text-gray-900 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    {uploader.email}
                                </td>
                                <td className="py-4 px-6 text-gray-600">
                                    {uploader.created_at ? new Date(uploader.created_at).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="py-4 px-6">
                                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                                        Active
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {uploaders.length === 0 && !loading && (
                            <tr>
                                <td colSpan="3" className="py-8 text-center text-gray-500">
                                    No assessment uploaders found. Create one to get started.
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
                                {createdUploader ? 'Code Generated!' : 'Create Assessment Uploader'}
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
                                        <p className="text-green-600 text-sm">Use the access code below to login.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-500 mb-1">Email</p>
                                            <div className="flex items-center justify-between">
                                                <code className="text-lg font-mono text-gray-900">{createdUploader.email}</code>
                                                <button
                                                    onClick={() => copyToClipboard(createdUploader.email, 'email')}
                                                    className="p-2 hover:bg-gray-200 rounded-lg"
                                                >
                                                    {copiedField === 'email' ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
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
                                            Uploader Email
                                        </label>
                                        <input
                                            type="email"
                                            value={newUploaderEmail}
                                            onChange={(e) => setNewUploaderEmail(e.target.value)}
                                            placeholder="e.g. uploader@school.com"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        An access code will be automatically generated.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {creating && <Loader2 className="h-5 w-5 animate-spin" />}
                                        {creating ? 'Creating...' : 'Create & Generate Code'}
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

export default AssessmentUploadersPage;
