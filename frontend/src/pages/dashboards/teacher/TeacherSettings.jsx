import React, { useState } from 'react';
import { User, Bell, Lock, Palette, Mail, Phone, Save, Camera } from 'lucide-react';

const TeacherSettings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [profile, setProfile] = useState({ firstName: 'John', lastName: 'Smith', email: 'john.smith@school.com', phone: '+1 234 567 8900', subject: 'Mathematics', bio: 'Passionate educator with 10+ years of experience.' });

    const tabs = [{ id: 'profile', label: 'Profile', icon: User }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'security', label: 'Security', icon: Lock }, { id: 'appearance', label: 'Appearance', icon: Palette }];

    return (
        <>
            <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Settings</h1><p className="text-gray-500">Manage your account settings</p></div>

            <div className="flex gap-6">
                <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    {tabs.map(t => (<button key={t.id} onClick={() => setActiveTab(t.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${activeTab === t.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}><t.icon className="h-5 w-5" /><span className="font-medium">{t.label}</span></button>))}
                </div>

                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Profile Settings</h2>
                            <div className="flex items-center gap-6 mb-8">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">{profile.firstName[0]}{profile.lastName[0]}</div>
                                    <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-2 shadow-sm hover:bg-gray-50"><Camera className="h-4 w-4 text-gray-600" /></button>
                                </div>
                                <div><h3 className="text-lg font-medium text-gray-800">{profile.firstName} {profile.lastName}</h3><p className="text-gray-500">{profile.subject} Teacher</p></div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">First Name</label><input type="text" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label><input type="text" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" /></div></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Phone</label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg" /></div></div>
                                <div className="col-span-2"><label className="block text-sm font-medium text-gray-700 mb-2">Bio</label><textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                            </div>
                            <div className="flex justify-end mt-6"><button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Save className="h-4 w-4" />Save</button></div>
                        </div>
                    )}
                    {activeTab === 'notifications' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Settings</h2>
                            <div className="space-y-4">
                                {['Email for new submissions', 'Push for messages', 'Weekly reports', 'Progress alerts'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{item}</span>
                                        <label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked={i < 2} className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div></label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'security' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
                            <div className="space-y-6 max-w-md">
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">New Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label><input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
                                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Update Password</button>
                            </div>
                        </div>
                    )}
                    {activeTab === 'appearance' && (
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Appearance Settings</h2>
                            <div><label className="block text-sm font-medium text-gray-700 mb-4">Theme</label><div className="flex gap-4">{['Light', 'Dark', 'System'].map(t => (<button key={t} className={`px-6 py-3 rounded-lg border-2 ${t === 'Light' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>{t}</button>))}</div></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TeacherSettings;
