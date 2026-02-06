import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, Clock } from 'lucide-react';

const GeneratedQuestionsPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const questions = [
        { id: 1, question: 'What is 7 × 8?', answer: '56', template: 'Multiplication', generated: '2 min ago', status: 'approved' },
        { id: 2, question: 'Simplify 4/12', answer: '1/3', template: 'Fractions', generated: '5 min ago', status: 'pending' },
        { id: 3, question: 'Solve: x + 5 = 12', answer: 'x = 7', template: 'Algebra', generated: '10 min ago', status: 'approved' },
        { id: 4, question: 'What is 15 - 8?', answer: '7', template: 'Subtraction', generated: '15 min ago', status: 'approved' },
        { id: 5, question: 'Convert 0.5 to fraction', answer: '1/2', template: 'Decimals', generated: '20 min ago', status: 'pending' },
    ];

    const stats = [
        { label: 'Total Generated', value: 12450 },
        { label: 'Pending Review', value: 85 },
        { label: 'Approved', value: 12365 },
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
            <h1 className="text-2xl font-bold text-gray-900">Generated Questions</h1>

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search questions..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Status</option>
                    <option>Approved</option>
                    <option>Pending</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Templates</option>
                    <option>Multiplication</option>
                    <option>Fractions</option>
                    <option>Algebra</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Question</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Answer</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Template</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Generated</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questions.map((q) => (
                            <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-4 px-6 text-gray-900">{q.question}</td>
                                <td className="py-4 px-6 text-gray-700 font-mono">{q.answer}</td>
                                <td className="py-4 px-6 text-gray-700">{q.template}</td>
                                <td className="py-4 px-6 text-gray-500">{q.generated}</td>
                                <td className="py-4 px-6">
                                    <span className={`flex items-center gap-1 ${q.status === 'approved' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {q.status === 'approved' ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                                        {q.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    {q.status === 'pending' && (
                                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                                            Approve
                                        </button>
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

export default GeneratedQuestionsPage;
