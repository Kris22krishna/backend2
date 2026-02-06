import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader2, TrendingUp, TrendingDown } from 'lucide-react';

const SkillsPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const skills = [
        { id: 1, name: 'Fractions', category: 'Numbers', questions: 245, avgAccuracy: '41%', attempts: 12500, trend: 'down' },
        { id: 2, name: 'Decimals', category: 'Numbers', questions: 180, avgAccuracy: '38%', attempts: 11000, trend: 'down' },
        { id: 3, name: 'Algebra Basics', category: 'Algebra', questions: 320, avgAccuracy: '68%', attempts: 8900, trend: 'up' },
        { id: 4, name: 'Geometry', category: 'Geometry', questions: 210, avgAccuracy: '72%', attempts: 6500, trend: 'up' },
        { id: 5, name: 'Ratios', category: 'Numbers', questions: 150, avgAccuracy: '48%', attempts: 9800, trend: 'stable' },
        { id: 6, name: 'Multiplication', category: 'Arithmetic', questions: 280, avgAccuracy: '85%', attempts: 15000, trend: 'up' },
    ];

    const stats = [
        { label: 'Total Skills', value: 48 },
        { label: 'Needs Attention', value: 5, color: 'text-red-600' },
        { label: 'Performing Well', value: 35, color: 'text-green-600' },
    ];

    const getAccuracyColor = (accuracy) => {
        const val = parseInt(accuracy);
        if (val < 40) return 'text-red-600 bg-red-50';
        if (val < 60) return 'text-yellow-600 bg-yellow-50';
        return 'text-green-600 bg-green-50';
    };

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
                <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Add Skill
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color || 'text-gray-900'}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search skills..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Categories</option>
                    <option>Numbers</option>
                    <option>Algebra</option>
                    <option>Geometry</option>
                    <option>Arithmetic</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Skill Name</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Category</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Questions</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Avg Accuracy</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Attempts</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Trend</th>
                        </tr>
                    </thead>
                    <tbody>
                        {skills.map((skill) => (
                            <tr key={skill.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6 font-medium text-gray-900">{skill.name}</td>
                                <td className="py-4 px-6 text-gray-700">{skill.category}</td>
                                <td className="py-4 px-6 text-gray-700">{skill.questions}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccuracyColor(skill.avgAccuracy)}`}>
                                        {skill.avgAccuracy}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-700">{skill.attempts.toLocaleString()}</td>
                                <td className="py-4 px-6">
                                    {skill.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-500" />}
                                    {skill.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-500" />}
                                    {skill.trend === 'stable' && <span className="text-gray-400">—</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SkillsPage;
