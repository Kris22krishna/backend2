import React, { useState } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const TeacherAttendance = () => {
    const [selectedDate] = useState(new Date());
    const [selectedGrade, setSelectedGrade] = useState('Grade 8');
    const [selectedSection, setSelectedSection] = useState('A');

    const initialStudents = [
        { id: 1, name: 'Emma Johnson', status: 'present' },
        { id: 2, name: 'Michael Chen', status: 'present' },
        { id: 3, name: 'Sophia Rodriguez', status: 'present' },
        { id: 4, name: 'James Lee', status: 'absent' },
        { id: 5, name: 'Oliver Smith', status: 'present' },
        { id: 6, name: 'Isabella Brown', status: 'present' },
        { id: 7, name: 'Sarah Johnson', status: 'late' },
        { id: 8, name: 'Emily Davis', status: 'present' },
    ];

    const [attendanceData, setAttendanceData] = useState(initialStudents);
    const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];
    const sections = ['A', 'B', 'C'];

    const setStatus = (id, status) => setAttendanceData(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    const getStatusStyle = (s) => ({ present: 'bg-green-100 text-green-700', absent: 'bg-red-100 text-red-700', late: 'bg-yellow-100 text-yellow-700' }[s] || 'bg-gray-100');

    const stats = { present: attendanceData.filter(s => s.status === 'present').length, absent: attendanceData.filter(s => s.status === 'absent').length, late: attendanceData.filter(s => s.status === 'late').length };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <div><h1 className="text-3xl font-bold text-gray-800">Attendance</h1><p className="text-gray-500">Track student attendance</p></div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Download className="h-5 w-5" />Export</button>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button className="p-2 hover:bg-white rounded-lg"><ChevronLeft className="h-4 w-4" /></button>
                        <div className="flex items-center gap-2 px-3"><Calendar className="h-4 w-4 text-gray-500" /><span className="font-medium">{selectedDate.toLocaleDateString()}</span></div>
                        <button className="p-2 hover:bg-white rounded-lg"><ChevronRight className="h-4 w-4" /></button>
                    </div>
                    <div className="flex items-center gap-2">
                        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                            {grades.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <select value={selectedSection} onChange={(e) => setSelectedSection(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg">
                            {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200 flex items-center gap-3"><CheckCircle className="h-8 w-8 text-green-600" /><div><div className="text-2xl font-bold text-green-700">{stats.present}</div><div className="text-sm text-green-600">Present</div></div></div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-200 flex items-center gap-3"><XCircle className="h-8 w-8 text-red-600" /><div><div className="text-2xl font-bold text-red-700">{stats.absent}</div><div className="text-sm text-red-600">Absent</div></div></div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 flex items-center gap-3"><Clock className="h-8 w-8 text-yellow-600" /><div><div className="text-2xl font-bold text-yellow-700">{stats.late}</div><div className="text-sm text-yellow-600">Late</div></div></div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100"><tr><th className="text-left py-4 px-6 text-sm font-medium text-gray-600">#</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Student</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Status</th><th className="text-left py-4 px-6 text-sm font-medium text-gray-600">Actions</th></tr></thead>
                    <tbody>
                        {attendanceData.map((s, i) => (
                            <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
                                <td className="py-4 px-6 text-gray-600">{i + 1}</td>
                                <td className="py-4 px-6"><div className="flex items-center gap-3"><div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm">{s.name.split(' ').map(n => n[0]).join('')}</div><span className="font-medium text-gray-800">{s.name}</span></div></td>
                                <td className="py-4 px-6"><span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusStyle(s.status)}`}>{s.status}</span></td>
                                <td className="py-4 px-6"><div className="flex gap-2">
                                    <button onClick={() => setStatus(s.id, 'present')} className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200">P</button>
                                    <button onClick={() => setStatus(s.id, 'absent')} className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200">A</button>
                                    <button onClick={() => setStatus(s.id, 'late')} className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200">L</button>
                                </div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6"><button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Save Attendance</button></div>
        </>
    );
};

export default TeacherAttendance;
