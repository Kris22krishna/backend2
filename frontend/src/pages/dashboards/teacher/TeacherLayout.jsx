import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../../components/Navbar';
import {
    Users,
    FileText,
    GraduationCap,
    LayoutDashboard,
    CalendarCheck,
    Settings,
} from 'lucide-react';

const TeacherLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher-dashboard' },
        { icon: Users, label: 'Students', path: '/teacher-dashboard/students' },
        { icon: FileText, label: 'Assignments', path: '/teacher-dashboard/assignments' },
        { icon: CalendarCheck, label: 'Attendance', path: '/teacher-dashboard/attendance' },
        { icon: Settings, label: 'Settings', path: '/teacher-dashboard/settings' },
    ];

    const isActive = (path) => {
        if (path === '/teacher-dashboard') {
            return location.pathname === '/teacher-dashboard';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Fixed Sidebar */}
            <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-4 z-40">
                <div className="flex items-center gap-3 mb-8 p-3">
                    <div className="bg-white text-blue-700 p-2 rounded-lg">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <h1 className="text-xl font-semibold">Teacher Portal</h1>
                </div>

                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <div
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${isActive(item.path)
                                    ? 'bg-blue-800 font-medium'
                                    : 'text-blue-100 hover:bg-blue-800'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </nav>
            </div>

            {/* Main Content Area - Only this changes */}
            <div className="ml-64 pt-20 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default TeacherLayout;
