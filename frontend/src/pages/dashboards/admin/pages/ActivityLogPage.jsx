import React, { useState, useEffect } from 'react';
import { Search, Loader2, Filter, Activity, FileText, Users, Settings } from 'lucide-react';

const ActivityLogPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const activities = [
        { id: 1, action: 'Created quiz "Algebra Basics"', user: 'Teacher Rahul', type: 'quiz', time: '2 min ago' },
        { id: 2, action: '40 students completed Decimals Quiz', user: 'System', type: 'student', time: '5 min ago' },
        { id: 3, action: 'Updated settings: Email notifications', user: 'Admin', type: 'settings', time: '10 min ago' },
        { id: 4, action: 'New user registration: Emily Johnson', user: 'System', type: 'user', time: '15 min ago' },
        { id: 5, action: 'Uploaded 15 new questions', user: 'ContentPro', type: 'content', time: '20 min ago' },
        { id: 6, action: 'Generated 25 questions from template', user: 'System', type: 'content', time: '25 min ago' },
        { id: 7, action: 'Parent logged in after 10 days', user: 'Jane Johnson', type: 'user', time: '30 min ago' },
        { id: 8, action: 'Resolved alert: Server latency', user: 'Admin', type: 'system', time: '1 hour ago' },
    ];

    const getTypeIcon = (type) => {
        switch (type) {
            case 'quiz': return <FileText className="h-5 w-5 text-blue-600" />;
            case 'student': return <Users className="h-5 w-5 text-green-600" />;
            case 'user': return <Users className="h-5 w-5 text-purple-600" />;
            case 'settings': return <Settings className="h-5 w-5 text-gray-600" />;
            case 'content': return <FileText className="h-5 w-5 text-orange-600" />;
            default: return <Activity className="h-5 w-5 text-gray-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Search activities..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>All Types</option>
                    <option>Quiz</option>
                    <option>User</option>
                    <option>Content</option>
                    <option>System</option>
                </select>
                <select className="px-4 py-2 border border-gray-200 rounded-lg">
                    <option>Last 24 hours</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-100">
                    {activities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-4 p-4 hover:bg-gray-50">
                            <div className="p-2 bg-gray-100 rounded-lg">
                                {getTypeIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                                <p className="text-gray-900">{activity.action}</p>
                                <p className="text-sm text-gray-500">by {activity.user}</p>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-center">
                <button className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                    Load More
                </button>
            </div>
        </div>
    );
};

export default ActivityLogPage;
