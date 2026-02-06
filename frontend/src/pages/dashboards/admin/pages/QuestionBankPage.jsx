import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

const QuestionBankPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const questions = [
        { id: 1, question: 'What is 5 × 7?', topic: 'Multiplication', grade: 3, accuracy: '92%', attempts: 1250, status: 'good' },
        { id: 2, question: 'Simplify 3/12 to lowest terms', topic: 'Fractions', grade: 5, accuracy: '28%', attempts: 450, status: 'low' },
        { id: 3, question: 'Solve: 2x + 5 = 15', topic: 'Algebra', grade: 7, accuracy: '65%', attempts: 890, status: 'good' },
        { id: 4, question: 'Convert 0.75 to a fraction', topic: 'Decimals', grade: 6, accuracy: '31%', attempts: 520, status: 'low' },
        { id: 5, question: 'Find area of triangle with b=6, h=4', topic: 'Geometry', grade: 8, accuracy: '78%', attempts: 340, status: 'good' },
    ];

    const stats = [
        { label: 'Total Questions', value: 5420 },
        { label: 'Low Accuracy (<30%)', value: 47, color: 'text-red-600' },
        { label: 'High Reports (>5)', value: 8, color: 'text-orange-600' },
    ];

    const tabs = [
        { id: 'all', label: 'All Questions' },
        { id: 'low', label: 'Low Accuracy' },
        { id: 'reported', label: 'Reported' },
        { id: 'unused', label: 'Never Used' },
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
                <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Add Question
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color || 'text-gray-900'}`}>{stat.value.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 border-b border-gray-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search questions..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Topics</option>
                    <option>Fractions</option>
                    <option>Algebra</option>
                    <option>Geometry</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Filter className="h-4 w-4" />
                    More Filters
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Question</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Topic</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Grade</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Accuracy</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Attempts</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6 text-gray-900">{q.question}</td>
                                <td className="py-4 px-6 text-gray-700">{q.topic}</td>
                                <td className="py-4 px-6 text-gray-700">Grade {q.grade}</td>
                                <td className={`py-4 px-6 font-medium ${parseInt(q.accuracy) < 40 ? 'text-red-600' : 'text-green-600'}`}>
                                    {q.accuracy}
                                </td>
                                <td className="py-4 px-6 text-gray-700">{q.attempts.toLocaleString()}</td>
                                <td className="py-4 px-6">
                                    {q.status === 'good' ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QuestionBankPage;
