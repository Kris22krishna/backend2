import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-react';

const AlertsPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const alerts = [
        { id: 1, message: '27 students inactive for 3+ days', type: 'warning', time: '5 min ago', resolved: false },
        { id: 2, message: 'Fractions accuracy dropping platform-wide (41%)', type: 'error', time: '1 hour ago', resolved: false },
        { id: 3, message: '3 teachers haven\'t created quizzes this week', type: 'warning', time: '2 hours ago', resolved: false },
        { id: 4, message: '12 guests attempted quizzes but didn\'t sign up', type: 'info', time: '4 hours ago', resolved: false },
        { id: 5, message: 'Server response time exceeded threshold', type: 'error', time: '1 day ago', resolved: true },
    ];

    const stats = [
        { label: 'Active Alerts', value: 4, color: 'text-red-600' },
        { label: 'Resolved Today', value: 8, color: 'text-green-600' },
        { label: 'Critical', value: 2, color: 'text-red-600' },
    ];

    const getAlertStyle = (type) => {
        switch (type) {
            case 'error': return { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle, iconColor: 'text-red-600' };
            case 'warning': return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-600' };
            case 'info': return { bg: 'bg-blue-50', border: 'border-blue-200', icon: Info, iconColor: 'text-blue-600' };
            default: return { bg: 'bg-gray-50', border: 'border-gray-200', icon: Info, iconColor: 'text-gray-600' };
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
            <h1 className="text-2xl font-bold text-gray-900">System Alerts</h1>

            <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-4">
                {['All', 'Critical', 'Warning', 'Info', 'Resolved'].map(tab => (
                    <button key={tab} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => {
                    const style = getAlertStyle(alert.type);
                    const Icon = style.icon;
                    return (
                        <div key={alert.id} className={`${style.bg} ${style.border} border rounded-xl p-4 flex items-start gap-4 ${alert.resolved ? 'opacity-50' : ''}`}>
                            <Icon className={`h-6 w-6 ${style.iconColor} mt-0.5`} />
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{alert.message}</p>
                                <p className="text-sm text-gray-500">{alert.time}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {alert.resolved ? (
                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                        <CheckCircle className="h-4 w-4" /> Resolved
                                    </span>
                                ) : (
                                    <>
                                        <button className="px-3 py-1 bg-white border border-gray-200 text-sm rounded hover:bg-gray-50">
                                            Investigate
                                        </button>
                                        <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                                            Resolve
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AlertsPage;
