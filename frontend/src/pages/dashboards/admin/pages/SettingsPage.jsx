import React, { useState, useEffect } from 'react';
import { Loader2, Save, Bell, Lock, Globe, Database, Mail } from 'lucide-react';

const SettingsPage = () => {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'email', label: 'Email', icon: Mail },
        { id: 'database', label: 'Database', icon: Database },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="w-64 space-y-1">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">General Settings</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                                <input type="text" defaultValue="Skill100.AI" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                                <input type="email" defaultValue="support@skill100.ai" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Language</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Spanish</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg">
                                    <option>Asia/Kolkata (IST)</option>
                                    <option>America/New_York (EST)</option>
                                    <option>Europe/London (GMT)</option>
                                </select>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Save className="h-5 w-5" />
                                Save Changes
                            </button>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>

                            {[
                                { label: 'Email notifications for new users', checked: true },
                                { label: 'Alert notifications', checked: true },
                                { label: 'Weekly summary reports', checked: false },
                                { label: 'System health alerts', checked: true },
                            ].map((setting, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <span className="text-gray-700">{setting.label}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={setting.checked} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                                <input type="number" defaultValue={30} className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                            </div>

                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <span className="text-gray-700">Require 2FA for admins</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <Save className="h-5 w-5" />
                                Save Changes
                            </button>
                        </div>
                    )}

                    {(activeTab === 'email' || activeTab === 'database') && (
                        <div className="flex items-center justify-center h-48 text-gray-500">
                            Coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
