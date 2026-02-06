import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth';
import '../../styles/AuthStyles.css'; // Use shared styles


const RegistrationForm = ({ role = 'student', onBack }) => {
    const [selectedRole, setSelectedRole] = useState(role.toLowerCase());
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [grade, setGrade] = useState('');
    const navigate = useNavigate();

    const roles = ['Student', 'Teacher', 'Parent', 'Guest'];
    const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isRateLimited) return;

        if (!email || !password || !username) {
            setError('Please fill in all required fields.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (selectedRole === 'student' && !grade) {
            setError('Please select your grade.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authService.registerWithEmail({
                email,
                password,
                role: selectedRole,
                username,
                phoneNumber,
                grade: selectedRole === 'student' ? grade : undefined
            });
            console.log('Registration Success:', response);

            // Auto-login after registration
            await authService.loginWithEmail(email, password);

            // Redirect to specific dashboard based on role
            const dashboardMap = {
                'student': '/student-dashboard',
                'teacher': '/teacher-dashboard',
                'parent': '/parent-dashboard',
                'guest': '/guest-dashboard'
            };

            const targetPath = dashboardMap[selectedRole] || '/';
            navigate(targetPath);

        } catch (err) {
            console.error("Registration Error:", err);
            setError(err.message || (typeof err === 'string' ? err : 'Registration failed.'));
        } finally {
            setIsLoading(false);
            setIsRateLimited(true);
            setTimeout(() => setIsRateLimited(false), 2000);
        }
    };

    return (
        <div className="registration-form">
            <h2 className="auth-title">Create Account</h2>

            {/* Role Selection Row */}
            <div className="role-selection-group">
                {roles.map((r) => (
                    <button
                        key={r}
                        type="button"
                        className={`role-btn ${selectedRole === r.toLowerCase() ? 'active' : ''}`}
                        onClick={() => setSelectedRole(r.toLowerCase())}
                    >
                        {r}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="auth-form-group">
                    <label className="auth-label">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        placeholder="Your Name"
                        required
                        disabled={isLoading}
                    />
                </div>

                {/* Grade Selection - Only for Students */}
                {selectedRole === 'student' && (
                    <div className="auth-form-group">
                        <label className="auth-label">Grade *</label>
                        <select
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                            className="auth-input"
                            required
                            disabled={isLoading}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">Select your grade</option>
                            {grades.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="auth-form-group">
                    <label className="auth-label">Phone Number (Optional)</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="auth-input"
                        placeholder="+1 (555) 000-0000"
                        disabled={isLoading}
                    />
                </div>

                <div className="auth-form-group">
                    <label className="auth-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="auth-input"
                        placeholder="name@example.com"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className="auth-form-group">
                    <label className="auth-label">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        placeholder="At least 8 characters"
                        required
                        disabled={isLoading}
                    />
                </div>

                {error && <p className="error-message" style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '0.5rem' }}>{error}</p>}

                <button type="submit" className="auth-btn-primary" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>

            <p className="auth-footer">
                Already have an account? <a href="/login" className="auth-link">Log in</a>
            </p>
        </div>
    );
};

export default RegistrationForm;

