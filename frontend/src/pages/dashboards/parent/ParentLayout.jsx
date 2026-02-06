import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../../../services/api';
import AddChildForm from './AddChildForm';
import LinkChildDialog from './LinkChildDialog';
import Navbar from '../../../components/Navbar';
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard, TrendingUp, BookOpen, Brain, FileText, Bell, Settings, LogOut, PlusCircle } from 'lucide-react';

export default function ParentLayout() {
    const [children, setChildren] = useState([]);
    const [selectedChild, setSelectedChild] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddChildOpen, setIsAddChildOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchChildren = async () => {
        try {
            const data = await api.getLinkedChildren();
            setChildren(data);
            // Preserve selection if possible, else default to first
            if (data.length > 0) {
                if (selectedChild) {
                    const stillExists = data.find(c => c.student_id === selectedChild.student_id);
                    if (stillExists) setSelectedChild(stillExists);
                    else setSelectedChild(data[0]);
                } else {
                    setSelectedChild(data[0]);
                }
            }
        } catch (err) {
            console.error("Failed to fetch children", err);
            setError("Could not load your children. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChildren();
    }, []);

    const handleDemoMode = () => {
        const demoChild = {
            student_id: 'demo-1',
            name: 'Demo Student',
            grade: '5'
        };
        setChildren([demoChild]);
        setSelectedChild(demoChild);
    };

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/parent-dashboard' },
        { icon: TrendingUp, label: 'Progress', path: '/parent-dashboard/progress' },
        { icon: BookOpen, label: 'Quizzes', path: '/parent-dashboard/quizzes' },
        { icon: Brain, label: 'Skills', path: '/parent-dashboard/skills' },
        { icon: FileText, label: 'Reports', path: '/parent-dashboard/reports' },
    ];

    if (loading) return null; // Or spinner

    if (error || children.length === 0) {
        return (
            <AddChildForm
                onLinkSuccess={() => window.location.reload()}
                onDemoMode={handleDemoMode}
            />
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex pt-20">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-100 flex-col hidden md:flex sticky top-20 h-[calc(100vh-5rem)]">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-slate-800">Parent Portal</h1>
                    </div>

                    <nav className="flex-1 px-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? 'bg-teal-50 text-teal-700'
                                        : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className={`h-5 w-5 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
                                    {item.label}
                                </button>
                            );
                        })}

                        <div className="pt-4 mt-4 border-t border-slate-100">
                            <button
                                onClick={() => navigate('/parent-dashboard/notifications')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/parent-dashboard/notifications'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Bell className={`h-5 w-5 ${location.pathname === '/parent-dashboard/notifications' ? 'text-teal-500' : 'text-slate-400'}`} />
                                Notifications
                                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
                            </button>
                            <button
                                onClick={() => navigate('/parent-dashboard/settings')}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === '/parent-dashboard/settings'
                                    ? 'bg-teal-50 text-teal-700'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <Settings className={`h-5 w-5 ${location.pathname === '/parent-dashboard/settings' ? 'text-teal-500' : 'text-slate-400'}`} />
                                Settings
                            </button>
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="bg-slate-50 rounded-xl p-4 mb-3">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Monitoring</p>
                                {/* Add Child Button */}
                                <button
                                    onClick={() => setIsAddChildOpen(true)}
                                    className="text-teal-600 hover:text-teal-700 transition-colors"
                                    title="Add another child"
                                >
                                    <PlusCircle className="h-4 w-4" />
                                </button>
                            </div>

                            {/* If multiple children, maybe a dropdown? For now, list links or just current */}
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm">
                                    {selectedChild.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{selectedChild.name}</p>
                                    <p className="text-xs text-slate-500">Grade {selectedChild.grade}</p>
                                </div>
                            </div>

                            {/* Quick Switcher if multiple */}
                            {children.length > 1 && (
                                <div className="mt-3 pt-3 border-t border-slate-200/50 space-y-2">
                                    {children.filter(c => c.student_id !== selectedChild.student_id).map(child => (
                                        <button
                                            key={child.student_id}
                                            onClick={() => setSelectedChild(child)}
                                            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/50 text-left transition-colors group"
                                        >
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold group-hover:bg-indigo-200">
                                                {child.name.charAt(0)}
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 truncate">
                                                {child.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button onClick={() => api.logout() || navigate('/login')} className="w-full flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors px-2">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {/* Mobile Header */}
                    <header className="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-20">
                        <h1 className="font-bold text-slate-800">Parent Portal</h1>
                        <Button variant="ghost" size="icon">
                            <div className="space-y-1">
                                <div className="w-6 h-0.5 bg-slate-600"></div>
                                <div className="w-6 h-0.5 bg-slate-600"></div>
                                <div className="w-6 h-0.5 bg-slate-600"></div>
                            </div>
                        </Button>
                    </header>

                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        <Outlet context={{ selectedChild }} />
                    </div>
                </main>

                <LinkChildDialog
                    isOpen={isAddChildOpen}
                    onClose={() => setIsAddChildOpen(false)}
                    onLinkSuccess={() => {
                        fetchChildren();
                        // Dialog closes automatically inside component but we can double ensure logic here if needed
                    }}
                />
            </div>
        </>
    );
}
