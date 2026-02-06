import React, { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Users, FileQuestion, Clock } from 'lucide-react';

const AnalyticsPage = () => {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('7d');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Total Users', value: '2,268', change: '+12%', icon: Users },
        { label: 'Quiz Attempts', value: '15,420', change: '+8%', icon: FileQuestion },
        { label: 'Avg Session', value: '12.5 min', change: '+5%', icon: Clock },
        { label: 'Engagement Rate', value: '78%', change: '+3%', icon: TrendingUp },
    ];

    const topSkills = [
        { name: 'Multiplication', attempts: 4520, accuracy: '85%' },
        { name: 'Addition', attempts: 3890, accuracy: '92%' },
        { name: 'Fractions', attempts: 2450, accuracy: '41%' },
        { name: 'Algebra', attempts: 1980, accuracy: '68%' },
        { name: 'Geometry', attempts: 1560, accuracy: '72%' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="flex gap-2">
                    {['7d', '30d', '90d', 'All'].map(p => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 text-sm rounded-lg ${period === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {p === 'All' ? 'All Time' : `Last ${p}`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className="h-8 w-8 text-blue-600" />
                            <span className="text-green-600 text-sm font-medium">{stat.change}</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">User Activity Trend</h2>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                        <p className="text-gray-500">Chart placeholder - integrate with chart library</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Skills by Attempts</h2>
                    <div className="space-y-4">
                        {topSkills.map((skill, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <span className="w-8 text-sm text-gray-500">#{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-medium text-gray-900">{skill.name}</span>
                                        <span className="text-sm text-gray-600">{skill.attempts.toLocaleString()} attempts</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(skill.attempts / 4520) * 100}%` }} />
                                    </div>
                                </div>
                                <span className={`text-sm font-medium ${parseInt(skill.accuracy) < 50 ? 'text-red-600' : 'text-green-600'}`}>
                                    {skill.accuracy}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
