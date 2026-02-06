import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../services/api';
import {
    LayoutDashboard, Users, GraduationCap, UserCircle, Eye, Upload, School,
    FileText, HelpCircle, Brain, Settings, LogOut, Menu, X,
    AlertTriangle, BarChart3, Activity, ScrollText, FileQuestion, ListChecks, Grid3X3, UploadCloud
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        {
            section: null,
            items: [
                { name: 'Overview', icon: LayoutDashboard, path: '/admin' }
            ]
        },
        {
            section: 'USER MANAGEMENT',
            items: [
                { name: 'Students', icon: GraduationCap, path: '/admin/students' },
                { name: 'Teachers', icon: UserCircle, path: '/admin/teachers' },
                { name: 'Parents', icon: Users, path: '/admin/parents' },
                { name: 'Guests', icon: Eye, path: '/admin/guests' },
                { name: 'Uploaders', icon: Upload, path: '/admin/uploaders' },
                { name: 'Assessment Uploader', icon: UploadCloud, path: '/admin/assessment-uploaders' },
                { name: 'Classes', icon: School, path: '/admin/classes' },
            ]
        },
        {
            section: 'CONTENT',
            items: [
                { name: 'Quizzes', icon: FileText, path: '/admin/quizzes' },
                { name: 'Question Bank', icon: HelpCircle, path: '/admin/question-bank' },
                { name: 'Skills', icon: Brain, path: '/admin/skills' },
            ]
        },
        {
            section: 'QUESTION TOOLS',
            items: [
                { name: 'Question Generation', icon: FileQuestion, path: '/admin/question-generation' },
                { name: 'Templates', icon: FileText, path: '/admin/templates' },
                { name: 'Generated Questions', icon: ListChecks, path: '/admin/generated-questions' },
            ]
        },
        {
            section: 'MONITORING',
            items: [
                { name: 'Alerts', icon: AlertTriangle, path: '/admin/alerts' },
                { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
                { name: 'System Health', icon: Activity, path: '/admin/system-health' },
                { name: 'Activity Log', icon: ScrollText, path: '/admin/activity-log' },
            ]
        },
        {
            section: 'CONFIGURATION',
            items: [
                { name: 'Settings', icon: Settings, path: '/admin/settings' },
            ]
        }
    ];

    const isActive = (path) => {
        if (path === '/admin-dashboard') {
            return location.pathname === '/admin-dashboard';
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        api.logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
                <div className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuItems.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {section.section && (
                                <div className="px-3 mb-2">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {section.section}
                                    </h3>
                                </div>
                            )}

                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <button
                                        key={item.name}
                                        onClick={() => navigate(item.path)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive(item.path)
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-sm">{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                        <h2 className="text-xl font-semibold text-gray-900">
                            {menuItems.flatMap(s => s.items).find(i => isActive(i.path))?.name || 'Overview'}
                        </h2>
                    </div>

                    {/* Admin Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Admin User</p>
                            <p className="text-xs text-gray-500">admin@platform.com</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            A
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
