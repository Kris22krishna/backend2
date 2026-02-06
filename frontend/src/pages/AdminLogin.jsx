import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import SEO from '../components/common/SEO';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import '../styles/AdminLogin.css';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
        setError(''); // Clear error when typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.adminLogin(credentials.username, credentials.password);
            navigate('/admin');
        } catch (error) {
            console.error(error);
            setError(error.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <SEO title="Admin Login | Learners" description="Secure admin portal access" />
            <Navbar />

            <div className="admin-login-container">
                {/* Left Side - Branding */}
                <div className="admin-login-branding">
                    <div className="branding-content">
                        <div className="brand-icon">
                            <Shield className="shield-icon" />
                        </div>
                        <h1>Admin Portal</h1>
                        <p>Secure access to manage the Learners platform. Monitor users, content, and system analytics.</p>

                        <div className="features-list">
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Real-time dashboard analytics</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>User management controls</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>Content moderation tools</span>
                            </div>
                            <div className="feature-item">
                                <div className="feature-dot"></div>
                                <span>System health monitoring</span>
                            </div>
                        </div>
                    </div>

                    <div className="branding-decoration">
                        <div className="glow-orb orb-1"></div>
                        <div className="glow-orb orb-2"></div>
                        <div className="glow-orb orb-3"></div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="admin-login-form-section">
                    <div className="login-form-container">
                        <div className="form-header">
                            <h2>Welcome Back</h2>
                            <p>Enter your credentials to access the dashboard</p>
                        </div>

                        {error && (
                            <div className="error-alert">
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="input-group">
                                <label htmlFor="username">Username or Email</label>
                                <div className="input-wrapper">
                                    <User className="input-icon" />
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={credentials.username}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="password">Password</label>
                                <div className="input-wrapper">
                                    <Lock className="input-icon" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        placeholder="Enter your password"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff className="toggle-icon" /> : <Eye className="toggle-icon" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="loading-spinner" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="btn-icon" />
                                        Sign In to Dashboard
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="form-footer">
                            <Link to="/" className="back-home-link">
                                <ArrowLeft className="back-icon" />
                                Back to Homepage
                            </Link>
                        </div>

                        <div className="security-note">
                            <Shield className="security-icon" />
                            <span>Protected by enterprise-grade security</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
