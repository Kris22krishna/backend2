import React, { useState, useEffect } from 'react';
import { Loader2, Play, Settings, FileText } from 'lucide-react';

const QuestionGenerationPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const stats = [
        { label: 'Questions Generated Today', value: 85 },
        { label: 'Templates Used', value: 12 },
        { label: 'Success Rate', value: '94%' },
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
            <h1 className="text-2xl font-bold text-gray-900">Question Generation</h1>

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate New Questions</h2>

                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
                        <select className="w-full px-4 py-3 border border-gray-200 rounded-lg">
                            <option>Addition - Basic</option>
                            <option>Subtraction - Basic</option>
                            <option>Multiplication - Tables</option>
                            <option>Fractions - Simplify</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                        <input type="number" defaultValue={10} className="w-full px-4 py-3 border border-gray-200 rounded-lg" />
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <div className="flex gap-4">
                        {['Easy', 'Medium', 'Hard'].map(level => (
                            <label key={level} className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="difficulty" defaultChecked={level === 'Medium'} className="text-blue-600" />
                                <span>{level}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Play className="h-5 w-5" />
                    Generate Questions
                </button>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Generations</h2>
                <div className="space-y-3">
                    {[
                        { template: 'Multiplication Tables', count: 20, time: '5 min ago', status: 'success' },
                        { template: 'Fractions Simplify', count: 15, time: '1 hour ago', status: 'success' },
                        { template: 'Algebra Linear', count: 10, time: '2 hours ago', status: 'success' },
                    ].map((gen, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-gray-400" />
                                <div>
                                    <p className="font-medium text-gray-900">{gen.template}</p>
                                    <p className="text-sm text-gray-500">{gen.count} questions • {gen.time}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                                {gen.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuestionGenerationPage;
