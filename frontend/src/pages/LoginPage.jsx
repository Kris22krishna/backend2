import React, { useState } from 'react';
import '../styles/AuthStyles.css';
import { ArrowLeft, Sparkles, BarChart3, Atom } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.loginWithEmail(email, password);
            console.log('Login Success:', response);

            // Redirect based on role
            const userType = response.user_type || 'student'; // Fallback
            const dashboardMap = {
                'student': '/student-dashboard',
                'teacher': '/teacher-dashboard',
                'parent': '/parent-dashboard',
                'guest': '/guest-dashboard',
                'admin': '/admin'
            };

            const targetPath = dashboardMap[userType] || '/';
            navigate(targetPath);

        } catch (err) {
            console.error('Login Failed:', err);
            // Handle object errors from API
            const msg = err.detail || err.message || (typeof err === 'string' ? err : 'Login failed. Please check your credentials.');
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await authService.loginWithGoogle();
            console.log('Google Login Success:', response);

            // Redirect based on role
            const userType = response.user_type || 'student'; // Fallback
            const dashboardMap = {
                'student': '/student-dashboard',
                'teacher': '/teacher-dashboard',
                'parent': '/parent-dashboard',
                'guest': '/guest-dashboard',
                'admin': '/admin'
            };

            const targetPath = dashboardMap[userType] || '/';
            navigate(targetPath);
        } catch (err) {
            console.error('Google Login Failed:', err);
            setError('Google login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left Section - Decoration */}
            <div className="auth-hero-section">
                <div className="auth-hero-content">
                    <h1 className="auth-hero-title">
                        Welcome Back to <br />
                        <span className="highlight-text">Skill100.AI</span>
                    </h1>
                    <p className="auth-hero-subtitle">
                        Continue your journey to excellence.
                    </p>
                </div>
                {/* Floating Icons */}
                <BarChart3 size={40} className="auth-float-icon af-1" strokeWidth={1.5} />
                <Atom size={40} className="auth-float-icon af-2" strokeWidth={1.5} />
                <Sparkles size={32} className="auth-float-icon af-3" strokeWidth={1.5} />
            </div>

            {/* Right Section - Login Form */}
            <div className="auth-form-section">
                <div className="auth-card animate-fade-in">
                    <Link to="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '2rem', textDecoration: 'none' }}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    <h2 className="auth-title">Log in</h2>
                    <p className="auth-subtitle">Enter your details to access your account</p>

                    <button className="auth-btn-google" onClick={handleGoogleLogin} disabled={isLoading}>
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width={20} />
                        Continue with Google
                    </button>

                    <div className="auth-divider">
                        <span>Or log in with email</span>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="auth-form-group">
                            <label className="auth-label">Email</label>
                            <input
                                type="email"
                                className="auth-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="auth-form-group">
                            <label className="auth-label">Password</label>
                            <input
                                type="password"
                                className="auth-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        {error && <p className="error-message" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}

                        <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Log in'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
