import React from 'react';

export const StatCard = ({ title, value, icon, delta, deltaType, loading, onClick }) => {
    if (loading) {
        return (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="text-gray-400">
                    {icon}
                </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            {delta !== undefined && (
                <p className={`text-sm mt-2 ${deltaType === 'positive' ? 'text-green-600' : deltaType === 'negative' ? 'text-red-600' : 'text-gray-500'}`}>
                    {deltaType === 'positive' ? '▲' : deltaType === 'negative' ? '▼' : ''} {delta}
                </p>
            )}
        </div>
    );
};

export default StatCard;
