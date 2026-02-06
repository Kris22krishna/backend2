import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock, Cpu, Database, Wifi } from 'lucide-react';

const SystemHealthPage = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const services = [
        { name: 'API Server', status: 'healthy', uptime: '99.9%', latency: '45ms', icon: Cpu },
        { name: 'Database', status: 'healthy', uptime: '99.8%', latency: '12ms', icon: Database },
        { name: 'CDN', status: 'healthy', uptime: '100%', latency: '8ms', icon: Wifi },
        { name: 'Auth Service', status: 'degraded', uptime: '98.5%', latency: '120ms', icon: Cpu },
    ];

    const metrics = [
        { label: 'Overall Uptime', value: '99.7%', status: 'good' },
        { label: 'Avg Response Time', value: '85ms', status: 'good' },
        { label: 'Error Rate', value: '0.3%', status: 'good' },
        { label: 'Active Connections', value: '1,245', status: 'good' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'healthy': return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
            case 'degraded': return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: AlertCircle };
            case 'down': return { color: 'text-red-600', bg: 'bg-red-100', icon: AlertCircle };
            default: return { color: 'text-gray-600', bg: 'bg-gray-100', icon: Clock };
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
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
                <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">All Systems Operational</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {metrics.map((metric, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
                        <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h2>
                <div className="space-y-4">
                    {services.map((service, index) => {
                        const style = getStatusStyle(service.status);
                        const StatusIcon = style.icon;
                        return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <service.icon className="h-8 w-8 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-gray-900">{service.name}</p>
                                        <p className="text-sm text-gray-500">Uptime: {service.uptime}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Latency</p>
                                        <p className="font-medium text-gray-900">{service.latency}</p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${style.bg}`}>
                                        <StatusIcon className={`h-4 w-4 ${style.color}`} />
                                        <span className={`text-sm font-medium ${style.color}`}>{service.status}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Response Time (Last 24h)</h2>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chart placeholder - integrate with monitoring</p>
                </div>
            </div>
        </div>
    );
};

export default SystemHealthPage;
