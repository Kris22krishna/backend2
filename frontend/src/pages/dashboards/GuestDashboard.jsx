import React from 'react';
import Navbar from '../../components/Navbar';

const GuestDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8 pt-24">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">Guest Dashboard</h1>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-600">Explore free resources and preview our courses.</p>
                </div>
            </div>
        </div>
    );
};

export default GuestDashboard;
