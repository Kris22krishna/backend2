import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Loader2, Clock, Users } from 'lucide-react';

const QuizzesPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const quizzes = [
        { id: 1, title: 'Algebra Basics', subject: 'Math', grade: 8, questions: 15, attempts: 245, avgScore: '72%', createdBy: 'Rahul Mehta' },
        { id: 2, title: 'Fractions Quiz', subject: 'Math', grade: 7, questions: 20, attempts: 320, avgScore: '65%', createdBy: 'Sarah Khan' },
        { id: 3, title: 'Geometry Fundamentals', subject: 'Math', grade: 9, questions: 12, attempts: 189, avgScore: '78%', createdBy: 'Mike Chen' },
        { id: 4, title: 'Decimals Practice', subject: 'Math', grade: 6, questions: 18, attempts: 156, avgScore: '68%', createdBy: 'Priya Sharma' },
    ];

    const stats = [
        { label: 'Total Quizzes', value: 156 },
        { label: 'Attempts Today', value: 540 },
        { label: 'Avg Completion Rate', value: '85%' },
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
                <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Create Quiz
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
                    <input type="text" placeholder="Search quizzes..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Subjects</option>
                    <option>Mathematics</option>
                    <option>Science</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Quiz Title</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Subject</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Grade</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Questions</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Attempts</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Avg Score</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Created By</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id} className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                                <td className="py-4 px-6 font-medium text-gray-900">{quiz.title}</td>
                                <td className="py-4 px-6 text-gray-700">{quiz.subject}</td>
                                <td className="py-4 px-6 text-gray-700">Grade {quiz.grade}</td>
                                <td className="py-4 px-6 text-gray-700">{quiz.questions}</td>
                                <td className="py-4 px-6 text-gray-700">{quiz.attempts}</td>
                                <td className="py-4 px-6 text-gray-700">{quiz.avgScore}</td>
                                <td className="py-4 px-6 text-gray-700">{quiz.createdBy}</td>
                                <td className="py-4 px-6">
                                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                                        <MoreVertical className="h-4 w-4 text-gray-500" />
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

export default QuizzesPage;
