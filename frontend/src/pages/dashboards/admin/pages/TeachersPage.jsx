import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Download, Filter, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../../../services/api';

const TeachersPage = () => {
    const [loading, setLoading] = useState(true);
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchTeachers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminTeachers();
            setTeachers(data || []);
        } catch (err) {
            console.error('Failed to fetch teachers:', err);
            setError('Failed to load teachers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // Calculate stats from real data
    const stats = [
        { label: 'Total Teachers', value: teachers.length },
        { label: 'Active (Last 7d)', value: teachers.filter(t => t.lastActive !== 'Never' && !t.lastActive?.includes('w ago')).length },
        { label: 'Inactive', value: teachers.filter(t => t.lastActive === 'Never' || t.lastActive?.includes('w ago')).length },
    ];

    // Filter teachers
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (lastActive) => {
        if (lastActive === 'Today' || lastActive?.includes('h ago') || lastActive?.includes('min ago')) {
            return 'bg-green-100 text-green-700';
        } else if (lastActive?.includes('d ago')) {
            const days = parseInt(lastActive);
            if (days <= 7) return 'bg-green-100 text-green-700';
            return 'bg-yellow-100 text-yellow-700';
        }
        return 'bg-red-100 text-red-700';
    };

    const getStatusText = (lastActive) => {
        if (lastActive === 'Today' || lastActive?.includes('h ago') || lastActive?.includes('min ago')) {
            return 'Active';
        } else if (lastActive?.includes('d ago')) {
            const days = parseInt(lastActive);
            if (days <= 7) return 'Active';
            return 'Idle';
        }
        return 'Inactive';
    };

    if (loading && teachers.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchTeachers}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus className="h-5 w-5" />
                        Add Teacher
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
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search teachers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    Filters
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Export
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Name</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Email</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Students</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Classes</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Last Active</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTeachers.map((teacher) => (
                            <tr key={teacher.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
                                            {teacher.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                                        </div>
                                        <span className="font-medium text-gray-900">{teacher.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-700">{teacher.email || 'N/A'}</td>
                                <td className="py-4 px-6 text-gray-700">{teacher.studentCount || 0}</td>
                                <td className="py-4 px-6 text-gray-700">{teacher.classesCount || 0}</td>
                                <td className="py-4 px-6 text-gray-700">{teacher.lastActive || 'Never'}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(teacher.lastActive)}`}>
                                        {getStatusText(teacher.lastActive)}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <MoreVertical className="h-4 w-4 text-gray-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredTeachers.length === 0 && !loading && (
                            <tr>
                                <td colSpan="7" className="py-8 text-center text-gray-500">
                                    No teachers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeachersPage;
