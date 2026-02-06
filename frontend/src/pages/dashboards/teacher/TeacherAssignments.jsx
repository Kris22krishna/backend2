import React, { useState } from 'react';
import { FileText, Plus, MoreVertical, Calendar, Clock, CheckCircle, Users, Search } from 'lucide-react';

const TeacherAssignments = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [searchQuery, setSearchQuery] = useState('');

    const assignments = [
        { id: 1, title: 'Algebra 2 Homework', subject: 'Mathematics', grade: 'Grade 8', dueDate: '2026-02-10', submitted: 16, total: 20, status: 'active' },
        { id: 2, title: 'Photosynthesis Project', subject: 'Science', grade: 'Grade 8', dueDate: '2026-02-12', submitted: 18, total: 25, status: 'active' },
        { id: 3, title: 'World War II Essay', subject: 'History', grade: 'Grade 7', dueDate: '2026-02-08', submitted: 22, total: 24, status: 'active' },
        { id: 4, title: 'Geometry Basics Quiz', subject: 'Mathematics', grade: 'Grade 7', dueDate: '2026-02-05', submitted: 20, total: 20, status: 'completed' },
        { id: 5, title: 'Chemical Reactions Lab', subject: 'Science', grade: 'Grade 8', dueDate: '2026-02-03', submitted: 24, total: 25, status: 'completed' },
        { id: 6, title: 'Fractions Practice', subject: 'Mathematics', grade: 'Grade 6', dueDate: '2026-02-15', submitted: 5, total: 22, status: 'active' },
    ];

    const filtered = assignments.filter(a => {
        const matchesTab = activeTab === 'all' || a.status === activeTab;
        const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.subject.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getProgressColor = (sub, tot) => {
        const p = (sub / tot) * 100;
        return p >= 80 ? 'bg-green-500' : p >= 50 ? 'bg-yellow-500' : 'bg-orange-500';
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold text-gray-800">Assignments</h1><p className="text-gray-500">Create and manage assignments</p></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="h-5 w-5" />Create Assignment</button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2">
                        {['all', 'active', 'completed'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{tab}</button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="search" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((a) => (
                    <div key={a.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md cursor-pointer">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg"><FileText className="h-6 w-6" /></div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${a.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{a.status === 'completed' ? 'Completed' : 'Active'}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{a.title}</h3>
                        <p className="text-sm text-gray-500 mb-4">{a.subject} • {a.grade}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4"><Calendar className="h-4 w-4" /><span>Due: {new Date(a.dueDate).toLocaleDateString()}</span></div>
                        <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1"><span className="text-gray-600">Submissions</span><span className="font-medium">{a.submitted}/{a.total}</span></div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full ${getProgressColor(a.submitted, a.total)}`} style={{ width: `${(a.submitted / a.total) * 100}%` }} /></div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View Details</button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-4 w-4 text-gray-500" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="h-5 w-5" /></div>
                    <div><div className="text-2xl font-bold text-gray-800">{assignments.length}</div><div className="text-sm text-gray-500">Total</div></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-green-100 text-green-600 p-2 rounded-lg"><CheckCircle className="h-5 w-5" /></div>
                    <div><div className="text-2xl font-bold text-gray-800">{assignments.filter(a => a.status === 'completed').length}</div><div className="text-sm text-gray-500">Completed</div></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-2 rounded-lg"><Clock className="h-5 w-5" /></div>
                    <div><div className="text-2xl font-bold text-gray-800">{assignments.filter(a => a.status === 'active').length}</div><div className="text-sm text-gray-500">Active</div></div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Users className="h-5 w-5" /></div>
                    <div><div className="text-2xl font-bold text-gray-800">{Math.round(assignments.reduce((a, x) => a + (x.submitted / x.total * 100), 0) / assignments.length)}%</div><div className="text-sm text-gray-500">Avg Submission</div></div>
                </div>
            </div>
        </>
    );
};

export default TeacherAssignments;
