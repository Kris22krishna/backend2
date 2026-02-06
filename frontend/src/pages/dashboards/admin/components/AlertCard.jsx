import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const AlertCard = ({ message, severity, onClick }) => {
    const severityConfig = {
        error: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            icon: <AlertCircle className="h-5 w-5 text-red-600" />
        },
        warning: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-800',
            icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-800',
            icon: <Info className="h-5 w-5 text-blue-600" />
        }
    };

    const config = severityConfig[severity] || severityConfig.info;

    return (
        <div
            onClick={onClick}
            className={`${config.bg} ${config.border} border rounded-lg p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all`}
        >
            {config.icon}
            <span className={`${config.text} flex-1`}>{message}</span>
            <button className="text-sm text-gray-600 hover:text-gray-800">View Details →</button>
        </div>
    );
};

export default AlertCard;
