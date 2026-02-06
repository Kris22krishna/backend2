import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LogOut, UploadCloud, FileText, CheckCircle, Upload,
    AlertTriangle, FileSpreadsheet, Loader2, LayoutDashboard,
    BarChart2, TrendingUp, Trophy, Menu, X, Settings, Users, Eye, MinusCircle, XCircle, Clock
} from 'lucide-react';
import { api } from '../../services/api';
import logo from '../../assets/logo.jpg';

const AssessmentUploaderDashboard = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState('');
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState(null); // { type: 'success' | 'error', text: string }
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        total_students: 0,
        assessments_count: 0,
        high_scorers_count: 0,
        top_grade: 'N/A'
    });
    const [loadingStats, setLoadingStats] = useState(true);

    // Reports State
    const [reports, setReports] = useState([]);
    const [loadingReports, setLoadingReports] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            navigate('/assessment-uploader-login');
        } else {
            setUserEmail(email);
            fetchAllData();
        }
    }, [navigate]);

    const fetchAllData = async () => {
        await Promise.all([
            fetchStudents(),
            fetchStats(),
            fetchReports()
        ]);
    };

    const fetchReports = async () => {
        setLoadingReports(true);
        try {
            const data = await api.getAssessmentReports();
            console.log("Reports data:", data); // Debug log
            if (Array.isArray(data)) {
                setReports(data);
            } else {
                console.error("Reports API returned invalid data (expected array):", data);
                setReports([]);
            }
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            setReports([]);
        } finally {
            setLoadingReports(false);
        }
    };

    const handleViewReport = async (sessionId) => {
        setIsReportModalOpen(true);
        setLoadingDetail(true);
        try {
            const detail = await api.getAssessmentReportDetail(sessionId);
            setSelectedReport(detail);
        } catch (error) {
            console.error("Failed to fetch report detail:", error);
            alert("Could not load report details.");
            setIsReportModalOpen(false);
        } finally {
            setLoadingDetail(false);
        }
    };

    const fetchStats = async () => {
        try {
            const data = await api.getAssessmentDashboardStats();
            if (data) {
                setStats(data);
            }
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const data = await api.getUploadedStudents();
            setStudents(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleLogout = () => {
        api.logout();
        navigate('/assessment-uploader-login');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setMessage(null);

        try {
            const result = await api.uploadStudents(file);
            if (result && result.uploaded_count !== undefined) {
                setMessage({
                    type: 'success',
                    text: `Successfully uploaded ${result.uploaded_count} students.` + (result.errors?.length ? ` ${result.errors.length} errors occurred (duplicates skipped).` : '')
                });
                fetchStudents();
                fetchStats();
                fetchReports();
            } else {
                setMessage({ type: 'error', text: 'Upload failed.' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Upload failed.' });
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports', icon: FileText },
        { id: 'performance', label: 'Performance', icon: TrendingUp },
        { id: 'high-scorers', label: 'High Scorers', icon: Trophy },
        { id: 'students', label: 'Students List', icon: Users },
    ];

    return (
        <div className="h-screen bg-gray-50 text-gray-900 flex flex-col overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                            <div className="flex items-center gap-3">
                                <img src={logo} alt="Logo" className="h-8 w-8 rounded-full shadow-sm" />
                                <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-green-500">
                                    Skill100.AI
                                </span>
                                <span className="hidden sm:inline-block px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded-md border border-indigo-100">
                                    Assessment Portal
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-right">
                                <p className="text-xs font-medium text-gray-900">{userEmail}</p>
                                <p className="text-[10px] text-gray-500">Uploader account</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all text-sm font-semibold"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside
                    className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto ${isSidebarOpen ? 'w-64' : 'w-20'}`}
                >
                    <nav className="mt-6 px-3 space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all
                                        ${isActive
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
                                    `}
                                >
                                    <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    {isSidebarOpen && <span>{item.label}</span>}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6 md:p-8">
                    <div className="max-w-6xl mx-auto">

                        {activeTab === 'dashboard' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Upload Section */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 bg-green-50 rounded-xl flex items-center justify-center">
                                            <FileSpreadsheet className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900">Upload Student Data</h2>
                                            <p className="text-sm text-gray-500">Fast-track student enrollment with Excel upload</p>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-indigo-300 hover:bg-indigo-50/20 transition-all relative group">
                                        <input
                                            type="file"
                                            accept=".xlsx"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                        />
                                        <div className="pointer-events-none">
                                            {uploading ? (
                                                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
                                            ) : (
                                                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-100 transition-colors">
                                                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-indigo-600" />
                                                </div>
                                            )}
                                            <p className="text-base font-bold text-gray-900">
                                                {uploading ? 'Processing Assessment Data...' : 'Click to upload or drag and drop'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">Only .xlsx files are supported</p>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`mt-6 p-4 rounded-xl flex items-start gap-3 border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-100' : 'bg-red-50 text-red-800 border-red-100'}`}>
                                            {message.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertTriangle className="h-5 w-5 shrink-0" />}
                                            <p className="text-sm font-medium">{message.text}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Placeholder for Dashboard Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-blue-50 rounded-lg"><Users className="h-5 w-5 text-blue-600" /></div>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">+12%</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Total Students</p>
                                        <h4 className="text-2xl font-bold text-gray-900 mt-1">{stats.total_students}</h4>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-purple-50 rounded-lg"><BarChart2 className="h-5 w-5 text-purple-600" /></div>
                                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Active</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">Assessments</p>
                                        <h4 className="text-2xl font-bold text-gray-900 mt-1">{stats.assessments_count}</h4>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-2 bg-orange-50 rounded-lg"><Trophy className="h-5 w-5 text-orange-600" /></div>
                                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Top Grade: {stats.top_grade}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 font-medium">High Scorers</p>
                                        <h4 className="text-2xl font-bold text-gray-900 mt-1">{stats.high_scorers_count}</h4>
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'students' || activeTab === 'dashboard') && (
                            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8 ${activeTab === 'dashboard' ? 'animate-in fade-in slide-in-from-bottom-8 duration-700' : ''}`}>
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Recent Uploads</h3>
                                    <button onClick={fetchStudents} className="text-xs text-indigo-600 font-bold hover:underline">Refresh List</button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50/50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Student Name</th>
                                                <th className="px-6 py-4">Grade</th>
                                                <th className="px-6 py-4">School</th>
                                                <th className="px-6 py-4">Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loadingStudents ? (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center">
                                                        <Loader2 className="h-8 w-8 text-indigo-200 animate-spin mx-auto" />
                                                        <p className="text-xs text-gray-400 mt-2 font-medium">Fetching secure data...</p>
                                                    </td>
                                                </tr>
                                            ) : students.length > 0 ? (
                                                students.map((student) => (
                                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                                        <td className="px-6 py-4 font-mono text-indigo-600 font-bold text-xs">{student.serial_number}</td>
                                                        <td className="px-6 py-4 text-gray-900 font-bold">{student.name}</td>
                                                        <td className="px-6 py-4 text-gray-600 font-medium">Grade {student.grade}</td>
                                                        <td className="px-6 py-4 text-gray-500">{student.school_name}</td>
                                                        <td className="px-6 py-4 text-gray-500 tabular-nums">{student.phone_number || '-'}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">No students uploaded yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {activeTab === 'reports' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="font-bold text-gray-900">Assessment Reports</h3>
                                    <button onClick={fetchReports} className="text-xs text-indigo-600 font-bold hover:underline">Refresh Reports</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50/50 text-gray-500 font-bold text-[11px] uppercase tracking-wider">
                                            <tr>
                                                <th className="px-6 py-4">Student</th>
                                                <th className="px-6 py-4">Grade</th>
                                                <th className="px-6 py-4">Completed On</th>
                                                <th className="px-6 py-4">Score</th>
                                                <th className="px-6 py-4">Accuracy</th>
                                                <th className="px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {loadingReports ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center">
                                                        <Loader2 className="h-8 w-8 text-indigo-200 animate-spin mx-auto" />
                                                    </td>
                                                </tr>
                                            ) : reports.length > 0 ? (
                                                reports.map((report) => (
                                                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{report.student_name || 'Unknown Student'}</div>
                                                            <div className="text-[10px] text-gray-400 font-mono">
                                                                ID: {report.student_id ? report.student_id.slice(0, 8) : 'N/A'}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-600 font-medium">{report.grade}</td>
                                                        <td className="px-6 py-4 text-gray-500">
                                                            {report.completed_at ? (
                                                                <>
                                                                    {new Date(report.completed_at).toLocaleDateString()}
                                                                    <span className="text-[10px] ml-2 opacity-50">{new Date(report.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                                </>
                                                            ) : 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-indigo-600">{report.correct_answers}</span>
                                                            <span className="text-gray-400"> / {report.total_questions}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex-1 h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${report.accuracy >= 80 ? 'bg-green-500' : report.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                                        style={{ width: `${report.accuracy}%` }}
                                                                    />
                                                                </div>
                                                                <span className="text-xs font-medium text-gray-600 w-8">{report.accuracy}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleViewReport(report.id)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all"
                                                            >
                                                                <Eye className="h-3.5 w-3.5" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 font-medium opacity-60">No reports generated yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {['performance', 'high-scorers'].includes(activeTab) && (
                            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                                <div className="p-4 bg-gray-50 rounded-full mb-4">
                                    <BarChart2 className="h-10 w-10 text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest">{activeTab.replace('-', ' ')}</h3>
                                <p className="text-sm text-gray-500 mt-2">Analytical insights will appear here soon.</p>
                                <button
                                    onClick={() => setActiveTab('dashboard')}
                                    className="mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* Report Detail Modal */}
            {
                isReportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Detailed Report</h3>
                                    {selectedReport && (
                                        <div className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
                                            <span className="font-semibold text-gray-700">{selectedReport.student_name}</span>
                                            <span className="text-gray-300">•</span>
                                            <span>Grade {selectedReport.grade}</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsReportModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {loadingDetail ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                                        <p className="text-sm text-gray-500">Loading full report...</p>
                                    </div>
                                ) : selectedReport ? (
                                    <div className="space-y-6">
                                        {/* Stats Cards */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                                                <div className="text-xs text-indigo-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                                    <TrendingUp className="h-3.5 w-3.5" /> Score
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {selectedReport.score} <span className="text-sm text-gray-400 font-medium">/ {selectedReport.total_questions}</span>
                                                </div>
                                            </div>
                                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                                <div className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                                    <CheckCircle className="h-3.5 w-3.5" /> Accuracy
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">{selectedReport.accuracy}%</div>
                                            </div>
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                                <div className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1.5">
                                                    <Clock className="h-3.5 w-3.5" /> Duration
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {(() => {
                                                        const minutes = selectedReport.duration_minutes;
                                                        if (!minutes) return '0m';
                                                        const hrs = Math.floor(minutes / 60);
                                                        const mins = Math.round(minutes % 60);
                                                        if (hrs > 0) return `${hrs}h ${mins}m`;
                                                        return `${mins}m`;
                                                    })()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Questions List */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                Question Analysis
                                                <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                    {selectedReport.questions ? selectedReport.questions.length : 0}
                                                </span>
                                            </h4>
                                            <div className="space-y-4">
                                                {selectedReport.questions && selectedReport.questions.length > 0 ? (
                                                    selectedReport.questions.map((q, idx) => (
                                                        <div key={q.id || idx} className="border border-gray-100 rounded-xl p-4 bg-white hover:border-gray-200 transition-colors">
                                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                                <div className="flex gap-3">
                                                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 mt-0.5">
                                                                        {idx + 1}
                                                                    </div>
                                                                    <div className="text-sm font-medium text-gray-900 pt-0.5" dangerouslySetInnerHTML={{ __html: q.question_html || 'Question content not available' }} />
                                                                </div>
                                                                <div className={`flex-shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${q.status === 'correct' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    q.status === 'wrong' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        'bg-gray-50 text-gray-600 border-gray-200'
                                                                    }`}>
                                                                    {q.status === 'correct' && <CheckCircle className="h-3 w-3 mr-1" />}
                                                                    {q.status === 'wrong' && <XCircle className="h-3 w-3 mr-1" />}
                                                                    {q.status === 'skipped' && <MinusCircle className="h-3 w-3 mr-1" />}
                                                                    {q.status ? (q.status.charAt(0).toUpperCase() + q.status.slice(1)) : 'Unknown'}
                                                                </div>
                                                            </div>

                                                            {/* Answers Section */}
                                                            <div className="ml-9 p-3 bg-gray-50 rounded-lg text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                <div>
                                                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">Student Answer</span>
                                                                    <div className={`font-medium ${q.status === 'correct' ? 'text-green-700' : q.status === 'wrong' ? 'text-red-600' : 'text-gray-500 italic'}`}>
                                                                        {q.student_answer || 'Not Attempted'}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-wide">Correct Answer</span>
                                                                    <div className="font-medium text-gray-900">
                                                                        {q.correct_answer}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-gray-400 italic">No questions found for this assessment.</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">Failed to load data.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default AssessmentUploaderDashboard;
