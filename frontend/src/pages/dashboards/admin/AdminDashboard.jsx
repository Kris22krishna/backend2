import React, { useState, useEffect } from 'react';
import StatCard from './components/StatCard';
import TableCard from './components/TableCard';
import AlertCard from './components/AlertCard';
import { api } from '../../../services/api';
import {
    Users, GraduationCap, UserCheck, Eye, FileQuestion, Database,
    Activity, BookOpen, CheckCircle, Loader2, RefreshCw, AlertCircle, Upload
} from 'lucide-react';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);

    const iconMap = {
        'Total Students': <GraduationCap className="h-5 w-5" />,
        'Total Teachers': <Users className="h-5 w-5" />,
        'Total Parents': <UserCheck className="h-5 w-5" />,
        'Total Uploaders': <Upload className="h-5 w-5" />,
        'Guest Users Today': <Eye className="h-5 w-5" />,
        'Quizzes Attempted': <FileQuestion className="h-5 w-5" />,
        'Questions in Bank': <Database className="h-5 w-5" />,
    };

    const activityIconMap = {
        'activity': <Activity className="h-4 w-4" />,
        'quiz': <FileQuestion className="h-4 w-4" />,
        'user': <UserCheck className="h-4 w-4" />,
        'guest': <Eye className="h-4 w-4" />,
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getAdminDashboardOverview();
            setDashboardData(data);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !dashboardData) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error && !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
                <AlertCircle className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">{error}</p>
                <button
                    onClick={fetchDashboardData}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <RefreshCw className="h-4 w-4" />
                    Retry
                </button>
            </div>
        );
    }

    // Transform API data for components
    const platformHealthData = dashboardData?.platformHealth?.map(stat => ({
        title: stat.title,
        value: stat.value,
        icon: iconMap[stat.title] || <Activity className="h-5 w-5" />,
        delta: stat.delta,
        deltaType: stat.deltaType,
    })) || [];

    const todaysActivityData = dashboardData?.todaysActivity?.map(item => ({
        Metric: item.metric,
        Count: item.count,
        Change: item.change,
    })) || [];

    const alertsData = dashboardData?.alerts || [];

    const skillTroubleData = dashboardData?.skillTroubles?.map(item => ({
        Skill: item.skill,
        'Avg Accuracy': item.avgAccuracy,
        Attempts: item.attempts,
    })) || [];

    const userActivityData = dashboardData?.userActivity?.map(item => ({
        Role: item.role,
        'Active Today': item.activeToday,
        'Inactive 7d': item.inactive7d,
        'Inactive 30d': item.inactive30d,
    })) || [];

    const activityFeedData = dashboardData?.activityFeed?.map(item => ({
        id: item.id,
        message: item.message,
        time: item.time,
        icon: activityIconMap[item.iconType] || <Activity className="h-4 w-4" />,
    })) || [];

    const lowAccuracyQuestions = dashboardData?.lowAccuracyQuestions || [];
    const mostUsedQuestions = dashboardData?.mostUsedQuestions || [];
    const recentlyAddedQuestions = dashboardData?.recentlyAddedQuestions || [];

    return (
        <div className="space-y-8">
            {/* Section 1: Platform Health Cards */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Platform Health</h2>
                    <button
                        onClick={fetchDashboardData}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {platformHealthData.map((stat) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            icon={stat.icon}
                            delta={stat.delta}
                            deltaType={stat.deltaType}
                            loading={false}
                            onClick={() => console.log(`Open ${stat.title} details`)}
                        />
                    ))}
                </div>
            </div>

            {/* Section 2: Today's Activity & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableCard
                    title="Today's Activity"
                    subtitle="Real-time platform metrics"
                    headers={['Metric', 'Count', 'Change']}
                    data={todaysActivityData}
                    onRowClick={(row) => console.log('Activity details:', row)}
                />

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-sm rounded-full font-medium">
                            {alertsData.length} Active
                        </span>
                    </div>
                    <div className="space-y-3">
                        {alertsData.map((alert) => (
                            <AlertCard
                                key={alert.id}
                                message={alert.message}
                                severity={alert.severity}
                                onClick={() => console.log('Alert details:', alert)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Section 3: Skill Trouble & User Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TableCard
                    title="Skills Needing Attention"
                    subtitle="Platform-wide accuracy below 50%"
                    headers={['Skill', 'Avg Accuracy', 'Attempts']}
                    data={skillTroubleData}
                    onRowClick={(row) => console.log('Skill details:', row)}
                />

                <TableCard
                    title="User Activity Snapshot"
                    headers={['Role', 'Active Today', 'Inactive 7d', 'Inactive 30d']}
                    data={userActivityData}
                    onRowClick={(row) => console.log('User activity:', row)}
                />
            </div>

            {/* Section 4: Live Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
                    <span className="text-sm text-gray-500">Auto-refreshes every 30s</span>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-3">
                    {activityFeedData.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                            <div className="text-blue-600 mt-1">{activity.icon}</div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-800">{activity.message}</p>
                                <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section 5: Question Bank Health */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Question Bank Health</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Low Accuracy Questions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Low Accuracy (&lt;30%)</h3>
                            <p className="text-sm text-red-600">⚠️ Needs attention</p>
                        </div>
                        <div className="p-6 space-y-3">
                            {lowAccuracyQuestions.map((q, index) => (
                                <div key={index} className="p-3 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer">
                                    <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>Accuracy: {q.accuracy}</span>
                                        <span>{q.attempts} attempts</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Most Used Questions */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Most Used Questions</h3>
                            <p className="text-sm text-green-600">✓ Performing well</p>
                        </div>
                        <div className="p-6 space-y-3">
                            {mostUsedQuestions.map((q, index) => (
                                <div key={index} className="p-3 bg-green-50 rounded-lg hover:bg-green-100 cursor-pointer">
                                    <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                                    <div className="flex justify-between text-xs text-gray-600">
                                        <span>{q.uses} uses</span>
                                        <span>Accuracy: {q.accuracy}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recently Added */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-900">Recently Added</h3>
                            <p className="text-sm text-blue-600">New content</p>
                        </div>
                        <div className="p-6 space-y-3">
                            {recentlyAddedQuestions.map((q, index) => (
                                <div key={index} className="p-3 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer">
                                    <p className="text-sm text-gray-900 mb-2">{q.question}</p>
                                    <div className="text-xs text-gray-600">
                                        <p>By: {q.addedBy}</p>
                                        <p>{q.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

