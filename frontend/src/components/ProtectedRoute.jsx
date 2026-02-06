import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';

/**
 * ProtectedRoute component that checks authentication and user type
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component to render if authenticated
 * @param {string[]} [props.allowedRoles] - Array of allowed user types (e.g., ['admin', 'teacher'])
 * @param {string} [props.redirectTo] - Path to redirect to if not authenticated
 */
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/admin-login' }) => {
    const location = useLocation();
    const isAuthenticated = api.isAuthenticated();
    const userType = localStorage.getItem('userType');

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Check role if specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
        // User is authenticated but doesn't have the right role
        // Redirect to appropriate dashboard based on their actual role
        const dashboardRoutes = {
            student: '/student-dashboard',
            teacher: '/teacher-dashboard',
            parent: '/parent-dashboard',
            admin: '/admin',
            uploader: '/uploader-dashboard',
        };

        const redirectPath = dashboardRoutes[userType] || '/';
        return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default ProtectedRoute;
