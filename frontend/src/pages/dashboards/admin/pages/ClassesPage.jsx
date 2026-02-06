import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, BookOpen, Loader2 } from 'lucide-react';

const ClassesPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const classes = [
        { id: 1, name: 'Math 8A', grade: 8, section: 'A', teacher: 'Rahul Mehta', students: 32, subject: 'Mathematics' },
        { id: 2, name: 'Math 9B', grade: 9, section: 'B', teacher: 'Sarah Khan', students: 28, subject: 'Mathematics' },
        { id: 3, name: 'Science 10C', grade: 10, section: 'C', teacher: 'Mike Chen', students: 30, subject: 'Science' },
        { id: 4, name: 'Math 7A', grade: 7, section: 'A', teacher: 'Priya Sharma', students: 35, subject: 'Mathematics' },
    ];

    const stats = [
        { label: 'Total Classes', value: 24 },
        { label: 'Total Students', value: 720 },
        { label: 'Teachers Assigned', value: 18 },
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
                <h1 className="text-2xl font-bold text-gray-900">Classes</h1>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus className="h-5 w-5" />
                    Create Class
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
                    <input type="text" placeholder="Search classes..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Grades</option>
                    {[...Array(12)].map((_, i) => <option key={i}>Grade {i + 1}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{cls.name}</h3>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded">Grade {cls.grade}</span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                <span>{cls.subject}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{cls.students} Students</span>
                            </div>
                            <p className="text-gray-500">Teacher: {cls.teacher}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClassesPage;
