import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import {
    Users, BookOpen, FileText, Activity, Calendar, ChevronRight,
    Trophy, AlertTriangle, TrendingUp, Award, AlertCircle,
    Search, Bell, Loader2, TrendingDown,
} from 'lucide-react';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedGrade, setSelectedGrade] = useState('All');
    const [teacherName, setTeacherName] = useState('');
    const [dashboardData, setDashboardData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch teacher profile
                const profile = await api.getTeacherProfile();
                setTeacherName(profile?.first_name || localStorage.getItem('firstName') || 'Teacher');

                // Fetch dashboard stats
                const stats = await api.getTeacherDashboardStats();
                setDashboardData(stats);

            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setError(err.message);
                // Fallback to localStorage for name
                setTeacherName(localStorage.getItem('firstName') || 'Teacher');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get unique grades from data for filter
    const grades = ['All', ...(dashboardData?.students_by_grade?.map(g => g.grade) || [])];

    // Stats for display
    const stats = dashboardData ? [
        { title: 'Total Students', value: dashboardData.total_students.toString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'Active Courses', value: dashboardData.active_courses.toString(), subtitle: 'Courses', icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { title: 'Pending Assignments', value: dashboardData.pending_assignments.toString(), subtitle: 'To Review', icon: FileText, color: 'bg-orange-100 text-orange-600' },
        { title: 'Avg Engagement', value: dashboardData.avg_engagement, icon: Activity, color: 'bg-pink-100 text-pink-600' },
    ] : [];

    const topPerformers = dashboardData?.top_performers || [];
    const atRiskStudents = dashboardData?.at_risk_students || [];
    const classAverage = dashboardData?.class_average || 0;

    // Static data for schedule (could be dynamic later)
    const todaySchedule = [
        { subject: 'Algebra', time: 'Today, 11:30 AM', topic: 'Quadratic Equations' },
        { subject: 'Science', time: 'Today, 2:00 PM', topic: 'Photosynthesis' },
    ];

    const completedAssignments = [
        { title: 'Algebra 2 Homework', subject: 'Math', date: 'Apr 25', submitted: '16/20' },
        { title: 'Photosynthesis Project', subject: 'Science', date: 'Apr 26', submitted: '18/25' },
        { title: 'World War II Quiz', subject: 'History', date: 'Apr 23', submitted: '22/24' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error && !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-800 font-medium">Failed to load dashboard</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {teacherName}! 👋</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="search" placeholder="Search students, classes..." className="pl-10 pr-4 py-2 w-80 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="relative cursor-pointer">
                        <Bell className="h-6 w-6 text-gray-600" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                    </div>
                    <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                        {teacherName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                {stat.subtitle && <p className="text-sm text-gray-500">{stat.subtitle}</p>}
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Grade Navigation */}
            {grades.length > 1 && (
                <div className="mb-8">
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
                        {grades.map((grade) => (
                            <button key={grade} onClick={() => setSelectedGrade(grade)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${selectedGrade === grade ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
                                {grade}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Today's Schedule */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Today's Schedule</h2>
                    <div className="space-y-4">
                        {todaySchedule.map((item, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Calendar className="h-5 w-5" /></div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-800">{item.subject}</h4>
                                    <p className="text-sm text-gray-500">{item.time}</p>
                                    <p className="text-sm text-gray-600">Topic: {item.topic}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Teaching Insights */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Teaching Insights</h2>
                    <div className="mb-3"><span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm">Completed</span></div>
                    <div className="space-y-4">
                        {completedAssignments.map((a, i) => (
                            <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -mx-2">
                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><FileText className="h-4 w-4" /></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-gray-800">{a.title}</h4>
                                    <p className="text-xs text-gray-500">{a.subject} | {a.date}</p>
                                </div>
                                <div className="text-sm text-gray-600">{a.submitted}</div>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Students by Grade */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800 mb-1">Students by Grade</h2>
                    <p className="text-sm text-gray-500 mb-4">Distribution across grades</p>
                    <div className="space-y-3">
                        {dashboardData?.students_by_grade?.map((grade, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{grade.grade}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(grade.count / dashboardData.total_students) * 100}%` }} />
                                    </div>
                                    <span className="text-sm text-gray-600 w-8">{grade.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Class Performance Overview</h2>
                        <p className="text-sm text-gray-500">Based on student scores and attendance</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                        <div className="bg-blue-600 text-white p-3 rounded-lg"><TrendingUp className="h-6 w-6" /></div>
                        <div><p className="text-2xl font-bold text-gray-800">{classAverage}%</p><p className="text-sm text-gray-600">Class Average</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                        <div className="bg-green-600 text-white p-3 rounded-lg"><Award className="h-6 w-6" /></div>
                        <div><p className="text-2xl font-bold text-gray-800">{topPerformers.length}</p><p className="text-sm text-gray-600">Top Performers</p></div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                        <div className="bg-orange-600 text-white p-3 rounded-lg"><AlertCircle className="h-6 w-6" /></div>
                        <div><p className="text-2xl font-bold text-gray-800">{atRiskStudents.length}</p><p className="text-sm text-gray-600">At-Risk Students</p></div>
                    </div>
                </div>
            </div>

            {/* Top Performers and At Risk */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-1"><Trophy className="h-5 w-5 text-yellow-600" /><h2 className="text-lg font-bold text-gray-800">Top Performers</h2></div>
                    <p className="text-sm text-gray-500 mb-4">Highest scoring students</p>
                    <div className="space-y-4">
                        {topPerformers.length === 0 ? (
                            <p className="text-gray-500 text-sm">No students found</p>
                        ) : (
                            topPerformers.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                                    <div className="relative">
                                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-medium">
                                            {s.name?.split(' ').map(n => n[0]).join('') || '??'}
                                        </div>
                                        {i === 0 && <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">1</div>}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{s.name}</h4>
                                        <p className="text-sm text-gray-500">{s.grade} • {s.section || 'N/A'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-green-600">{s.avg_score}%</p>
                                        <div className="flex items-center gap-1 text-xs text-green-600">
                                            <TrendingUp className="h-3 w-3" />
                                            <span>{s.trend === 'up' ? 'Improving' : 'Stable'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-1"><AlertTriangle className="h-5 w-5 text-orange-600" /><h2 className="text-lg font-bold text-gray-800">At-Risk Students</h2></div>
                    <p className="text-sm text-gray-500 mb-4">Students requiring attention</p>
                    <div className="space-y-4">
                        {atRiskStudents.length === 0 ? (
                            <p className="text-gray-500 text-sm">No at-risk students 🎉</p>
                        ) : (
                            atRiskStudents.map((s, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 border border-orange-100">
                                    <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-medium">
                                        {s.name?.split(' ').map(n => n[0]).join('') || '??'}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{s.name}</h4>
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full">{s.issue}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-red-600">{s.score}%</p>
                                        <p className="text-xs text-gray-600">{s.attendance} attendance</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeacherDashboard;
