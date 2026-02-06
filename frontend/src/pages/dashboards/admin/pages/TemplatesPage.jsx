import React, { useState, useEffect } from 'react';
import { Search, Plus, Loader2, Code, Eye } from 'lucide-react';

const TemplatesPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const templates = [
        { id: 1, name: 'Addition - Basic', topic: 'Arithmetic', questions: 450, uses: 1250, lastModified: '2 days ago', status: 'active' },
        { id: 2, name: 'Subtraction - Basic', topic: 'Arithmetic', questions: 380, uses: 980, lastModified: '5 days ago', status: 'active' },
        { id: 3, name: 'Multiplication Tables', topic: 'Arithmetic', questions: 520, uses: 1560, lastModified: '1 day ago', status: 'active' },
        { id: 4, name: 'Fractions Simplify', topic: 'Fractions', questions: 245, uses: 780, lastModified: '3 days ago', status: 'active' },
        { id: 5, name: 'Algebra Linear', topic: 'Algebra', questions: 180, uses: 450, lastModified: '1 week ago', status: 'draft' },
    ];

    const stats = [
        { label: 'Total Templates', value: 2338 },
        { label: 'Active Templates', value: 2280 },
        { label: 'Questions Generated', value: '125K' },
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
                <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Create Template
                </button>
            </div>

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
                    <input type="text" placeholder="Search templates..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Topics</option>
                    <option>Arithmetic</option>
                    <option>Fractions</option>
                    <option>Algebra</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Template Name</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Topic</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Questions</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Uses</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Last Modified</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {templates.map((template) => (
                            <tr key={template.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <Code className="h-5 w-5 text-gray-400" />
                                        <span className="font-medium text-gray-900">{template.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-700">{template.topic}</td>
                                <td className="py-4 px-6 text-gray-700">{template.questions}</td>
                                <td className="py-4 px-6 text-gray-700">{template.uses.toLocaleString()}</td>
                                <td className="py-4 px-6 text-gray-700">{template.lastModified}</td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-sm ${template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {template.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TemplatesPage;
