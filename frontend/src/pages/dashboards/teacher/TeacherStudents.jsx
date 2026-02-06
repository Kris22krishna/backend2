import React, { useState } from 'react';
import { Search, Filter, Plus, MoreVertical, Mail, Eye, TrendingUp, TrendingDown } from 'lucide-react';

const TeacherStudents = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [selectedSection, setSelectedSection] = useState('All');

    const students = [
        { id: 1, name: 'Emma Johnson', email: 'emma.j@school.com', grade: 'Grade 8', section: 'A', avgScore: 95, trend: 'up', attendance: '98%', status: 'Active' },
        { id: 2, name: 'Michael Chen', email: 'michael.c@school.com', grade: 'Grade 8', section: 'A', avgScore: 93, trend: 'up', attendance: '96%', status: 'Active' },
        { id: 3, name: 'Sophia Rodriguez', email: 'sophia.r@school.com', grade: 'Grade 8', section: 'B', avgScore: 92, trend: 'up', attendance: '94%', status: 'Active' },
        { id: 4, name: 'James Lee', email: 'james.l@school.com', grade: 'Grade 7', section: 'A', avgScore: 78, trend: 'down', attendance: '88%', status: 'At Risk' },
        { id: 5, name: 'Oliver Smith', email: 'oliver.s@school.com', grade: 'Grade 8', section: 'B', avgScore: 91, trend: 'up', attendance: '95%', status: 'Active' },
        { id: 6, name: 'Isabella Brown', email: 'isabella.b@school.com', grade: 'Grade 7', section: 'B', avgScore: 90, trend: 'up', attendance: '97%', status: 'Active' },
        { id: 7, name: 'Sarah Johnson', email: 'sarah.j@school.com', grade: 'Grade 8', section: 'A', avgScore: 52, trend: 'down', attendance: '63%', status: 'At Risk' },
        { id: 8, name: 'Emily Davis', email: 'emily.d@school.com', grade: 'Grade 7', section: 'A', avgScore: 59, trend: 'down', attendance: '70%', status: 'At Risk' },
    ];

    const grades = ['All', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['All', 'A', 'B', 'C'];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesGrade = selectedGrade === 'All' || student.grade === selectedGrade;
        const matchesSection = selectedSection === 'All' || student.section === selectedSection;
        return matchesSearch && matchesGrade && matchesSection;
    });

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold text-gray-800">Students</h1><p className="text-gray-500">Manage your students and view their progress</p></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus className="h-5 w-5" />Add Student</button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[250px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="search" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                            {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Student</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Grade</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Section</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Avg Score</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Attendance</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th>
                            <th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm">{s.name.split(' ').map(n => n[0]).join('')}</div>
                                        <div><div className="font-medium text-gray-800">{s.name}</div><div className="text-sm text-gray-500">{s.email}</div></div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{s.grade}</td>
                                <td className="py-4 px-6 text-gray-600">{s.section}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${s.avgScore >= 80 ? 'text-green-600' : s.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>{s.avgScore}%</span>
                                        {s.trend === 'up' ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{s.attendance}</td>
                                <td className="py-4 px-6"><span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{s.status}</span></td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="h-4 w-4 text-gray-500" /></button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg"><Mail className="h-4 w-4 text-gray-500" /></button>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg"><MoreVertical className="h-4 w-4 text-gray-500" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="text-2xl font-bold text-gray-800">{students.length}</div><div className="text-sm text-gray-500">Total Students</div></div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="text-2xl font-bold text-green-600">{students.filter(s => s.status === 'Active').length}</div><div className="text-sm text-gray-500">Active</div></div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="text-2xl font-bold text-orange-600">{students.filter(s => s.status === 'At Risk').length}</div><div className="text-sm text-gray-500">At Risk</div></div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="text-2xl font-bold text-blue-600">{Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length)}%</div><div className="text-sm text-gray-500">Class Average</div></div>
            </div>
        </>
    );
};

export default TeacherStudents;
