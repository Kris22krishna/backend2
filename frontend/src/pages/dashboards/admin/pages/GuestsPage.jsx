import React, { useState, useEffect } from 'react';
import { Search, Eye, Clock, Target, Loader2, RefreshCw } from 'lucide-react';
import { api } from '../../../../services/api';

const GuestsPage = () => {
    const [loading, setLoading] = useState(true);
    const [guests, setGuests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    const fetchGuests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminGuests();
            setGuests(data || []);
        } catch (err) {
            console.error('Failed to fetch guests:', err);
            setError('Failed to load guests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuests();
    }, []);

    // Calculate stats from real data
    const todayGuests = guests.filter(g => g.lastActive === 'Today').length;
    const totalQuizzes = guests.reduce((sum, g) => sum + (g.quizzesAttempted || 0), 0);

    const stats = [
        { label: 'Total Guests', value: guests.length, delta: `${todayGuests} today`, icon: Eye },
        { label: 'Quiz Attempts', value: totalQuizzes, delta: 'Total attempts', icon: Target },
        { label: 'Active Today', value: todayGuests, delta: 'Currently browsing', icon: Clock },
    ];

    // Filter guests
    const filteredGuests = guests.filter(guest => {
        const matchesSearch = guest.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getStatusColor = (quizzesAttempted, lastActive) => {
        if (quizzesAttempted >= 5 && (lastActive === 'Today' || lastActive?.includes('Yesterday'))) {
            return 'bg-green-100 text-green-700';
        } else if (quizzesAttempted >= 2 && (lastActive === 'Today' || lastActive?.includes('d ago'))) {
            return 'bg-yellow-100 text-yellow-700';
        }
        return 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (quizzesAttempted, lastActive) => {
        if (quizzesAttempted >= 5 && (lastActive === 'Today' || lastActive?.includes('Yesterday'))) {
            return 'Hot';
        } else if (quizzesAttempted >= 2 && (lastActive === 'Today' || lastActive?.includes('d ago'))) {
            return 'Warm';
        }
        return 'Cold';
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    if (loading && guests.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Guest Users</h1>
                <button
                    onClick={fetchGuests}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-blue-600"
                    disabled={loading}
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-gray-600">{stat.label}</p>
                            <stat.icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.delta}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Guest ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Statuses</option>
                    <option>Hot Leads</option>
                    <option>Warm Leads</option>
                    <option>Cold Leads</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Guest ID</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">First Seen</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Quizzes</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Last Active</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredGuests.map((guest) => (
                            <tr key={guest.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6 font-medium text-gray-900">{guest.name || guest.id}</td>
                                <td className="py-4 px-6 text-gray-700">{formatDate(guest.joinedDate)}</td>
                                <td className="py-4 px-6 text-gray-700">{guest.quizzesAttempted || 0}</td>
                                <td className="py-4 px-6 text-gray-700">{guest.lastActive || 'N/A'}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(guest.quizzesAttempted, guest.lastActive)}`}>
                                        {getStatusText(guest.quizzesAttempted, guest.lastActive)}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded">
                                        View Activity
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredGuests.length === 0 && !loading && (
                            <tr>
                                <td colSpan="6" className="py-8 text-center text-gray-500">
                                    No guest sessions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GuestsPage;
