import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import {
    Play,
    Zap,
    Flame,
    Trophy,
    Target,
    Clock,
    ChevronRight,
    Star,
    Award,
    BookOpen,
    TrendingUp,
    BarChart2,
    Loader2,
} from 'lucide-react';
import { api } from '../../../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await api.getStudentStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch student stats:', err);
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // Helper to get grade number from grade string (e.g., "Grade 5" -> 5)
    const getGradeNumber = () => {
        if (!stats?.grade) return 5; // Default to grade 5
        const match = stats.grade.match(/\d+/);
        return match ? parseInt(match[0]) : 5;
    };

    // Subjects (static for now, could be dynamic later)
    const subjects = [
        { name: 'Mathematics', icon: '🔢', progress: 75, color: 'bg-blue-500', path: '/math' },
        { name: 'Learn to Learn', icon: '🧠', progress: 40, color: 'bg-purple-500', path: '/learn-to-learn' },
    ];

    // Daily challenges (static for now)
    const dailyChallenges = [
        { title: 'Answer 20 Questions', progress: stats?.questions_today || 0, total: 20, xp: 100 },
        { title: 'Get 3 Perfect Scores', progress: 1, total: 3, xp: 150 },
        { title: 'Maintain Streak', progress: stats?.streak || 0, total: 7, xp: 75 },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-cyan-500 mx-auto mb-4" />
                        <p className="text-slate-500">Loading your dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button
                            onClick={fetchStats}
                            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const quickStats = [
        { icon: Target, label: 'Accuracy', value: `${stats?.accuracy || 0}%`, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50' },
        { icon: Flame, label: 'Streak', value: `${stats?.streak || 0} days`, color: 'from-orange-400 to-red-500', bg: 'bg-orange-50' },
        { icon: Zap, label: 'Total XP', value: (stats?.total_xp || 0).toLocaleString(), color: 'from-yellow-400 to-amber-500', bg: 'bg-amber-50' },
        { icon: Trophy, label: 'Rank', value: stats?.rank || 'Bronze', color: 'from-purple-400 to-indigo-500', bg: 'bg-purple-50' },
    ];

    const levelProgress = stats?.level_progress || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
                            Welcome back{stats?.first_name ? `, ${stats.first_name}` : ''}! 👋
                        </h1>
                        <p className="text-slate-500">Ready to level up today?</p>
                    </div>

                    {/* Level Badge */}
                    <div className="mt-4 md:mt-0 flex items-center gap-4">
                        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-lg shadow-amber-200">
                            <Award className="h-8 w-8 text-white" />
                            <div>
                                <div className="text-xs text-amber-100 uppercase tracking-wide">Level</div>
                                <div className="text-2xl font-bold text-white">{stats?.level || 1}</div>
                            </div>
                        </div>
                        <div className="flex-1 md:w-32">
                            <div className="text-xs text-slate-500 mb-1">{levelProgress}% to Level {(stats?.level || 1) + 1}</div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                                    style={{ width: `${levelProgress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {quickStats.map((stat, i) => (
                        <div key={i} className={`${stat.bg} rounded-2xl p-5 border border-slate-100 hover:shadow-lg transition-all group`}>
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-slate-500 text-sm">{stat.label}</div>
                            <div className="text-slate-800 text-2xl font-bold">{stat.value}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column - Subjects & Actions */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Quick Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate(`/math/grade/${getGradeNumber()}`)}
                                className="group bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-left hover:shadow-xl hover:shadow-cyan-200 transition-all"
                            >
                                <Play className="h-10 w-10 text-white mb-3 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold text-lg">Start Practice</div>
                                <div className="text-cyan-100 text-sm">{stats?.grade || 'Grade 5'} Math</div>
                            </button>

                            <button
                                onClick={() => navigate('/math')}
                                className="group bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-left hover:shadow-xl hover:shadow-purple-200 transition-all"
                            >
                                <BookOpen className="h-10 w-10 text-white mb-3 group-hover:scale-110 transition-transform" />
                                <div className="text-white font-bold text-lg">Explore Topics</div>
                                <div className="text-purple-100 text-sm">Browse all subjects</div>
                            </button>
                        </div>

                        {/* Subjects */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-cyan-500" />
                                    My Subjects
                                </h2>
                                <button className="text-cyan-500 text-sm hover:text-cyan-600 flex items-center gap-1">
                                    View All <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {subjects.map((subject, i) => (
                                    <div
                                        key={i}
                                        onClick={() => navigate(subject.path)}
                                        className="bg-slate-50 rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-100 transition-all group border border-slate-100"
                                    >
                                        <div className="text-4xl">{subject.icon}</div>
                                        <div className="flex-1">
                                            <div className="text-slate-800 font-semibold mb-1">{subject.name}</div>
                                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${subject.color} rounded-full transition-all`}
                                                    style={{ width: `${subject.progress}%` }}
                                                />
                                            </div>
                                            <div className="text-slate-400 text-xs mt-1">{subject.progress}% complete</div>
                                        </div>
                                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity - Dynamic */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-purple-500" />
                                    Recent Activity
                                </h2>
                            </div>
                            {stats?.recent_activity?.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.recent_activity.map((activity, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-100">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${activity.score >= 90 ? 'bg-emerald-100 text-emerald-600' :
                                                activity.score >= 70 ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-red-100 text-red-600'
                                                }`}>
                                                {activity.score}%
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-slate-800 font-medium">{activity.title}</div>
                                                <div className="text-slate-400 text-sm">{activity.time}</div>
                                            </div>
                                            <div className="text-amber-500 font-semibold text-sm">+{activity.xp} XP</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <p>No recent activity yet.</p>
                                    <button
                                        onClick={() => navigate(`/math/grade/${getGradeNumber()}`)}
                                        className="mt-2 text-cyan-500 hover:text-cyan-600"
                                    >
                                        Start practicing to see your progress!
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Daily Challenges & Stats */}
                    <div className="space-y-6">

                        {/* Daily Challenges */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                            <div className="flex items-center gap-2 mb-5">
                                <Star className="h-6 w-6 text-amber-500" />
                                <h2 className="text-xl font-bold text-slate-800">Daily Challenges</h2>
                            </div>
                            <div className="space-y-4">
                                {dailyChallenges.map((challenge, i) => {
                                    const percent = Math.round((challenge.progress / challenge.total) * 100);
                                    const isComplete = percent >= 100;
                                    return (
                                        <div key={i} className="bg-white rounded-xl p-4 border border-amber-100 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-slate-700 text-sm font-medium">{challenge.title}</div>
                                                <div className={`text-xs font-semibold ${isComplete ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {isComplete ? '✓ Done' : `+${challenge.xp} XP`}
                                                </div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-1">
                                                <div
                                                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-slate-400 text-xs">{challenge.progress}/{challenge.total}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Weekly Streak - Dynamic */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <Flame className="h-6 w-6 text-orange-500" />
                                <h2 className="text-xl font-bold text-slate-800">Weekly Streak</h2>
                            </div>
                            <div className="flex justify-between gap-2">
                                {(stats?.weekly_activity || []).map((day, i) => (
                                    <div key={i} className="text-center flex-1">
                                        <div
                                            className={`w-full aspect-square rounded-xl flex items-center justify-center mb-1 transition-all ${day.active
                                                ? 'bg-gradient-to-br from-orange-400 to-red-500 shadow-md shadow-orange-200'
                                                : 'bg-slate-100'
                                                }`}
                                        >
                                            {day.active && <span className="text-lg">{day.emoji}</span>}
                                        </div>
                                        <div className={`text-xs font-medium ${day.active ? 'text-orange-500' : 'text-slate-400'}`}>{day.day}</div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-center mt-4 text-orange-500 font-semibold">
                                🔥 {stats?.streak || 0} Day Streak!
                            </div>
                        </div>

                        {/* Skills Progress - Dynamic */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-5">
                                <TrendingUp className="h-6 w-6 text-cyan-500" />
                                <h2 className="text-xl font-bold text-slate-800">Skills Progress</h2>
                            </div>

                            {/* Mastered */}
                            {stats?.mastered_skills?.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-sm font-semibold text-emerald-600 mb-2">✅ Mastered</div>
                                    <div className="space-y-2">
                                        {stats.mastered_skills.slice(0, 3).map((skill, i) => (
                                            <div key={i} className="flex items-center justify-between p-2 bg-emerald-50 rounded-lg">
                                                <span className="text-sm text-slate-700 truncate">{skill.name}</span>
                                                <span className="text-sm font-semibold text-emerald-600">{skill.score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* In Progress */}
                            {stats?.in_progress_skills?.length > 0 && (
                                <div>
                                    <div className="text-sm font-semibold text-amber-600 mb-2">📚 In Progress</div>
                                    <div className="space-y-2">
                                        {stats.in_progress_skills.slice(0, 3).map((skill, i) => (
                                            <div key={i} className="p-2 bg-amber-50 rounded-lg">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm text-slate-700 truncate">{skill.name}</span>
                                                    <span className="text-sm font-semibold text-amber-600">{skill.score}%</span>
                                                </div>
                                                <div className="h-1.5 bg-amber-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full"
                                                        style={{ width: `${skill.score}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!stats?.mastered_skills?.length && !stats?.in_progress_skills?.length && (
                                <div className="text-center py-4 text-slate-400 text-sm">
                                    Practice to track your skills!
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
