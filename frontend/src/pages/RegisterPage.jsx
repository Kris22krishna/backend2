import React from 'react';
import '../styles/AuthStyles.css';
import { ArrowLeft, Sparkles, BarChart3, Atom } from 'lucide-react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/auth/RegistrationForm';

const RegisterPage = () => {
    // We can manage role selection here or inside the form. The existing form handles it via props.
    // For simplicity, let's default to no role selected initially if the form handles selection, 
    // or pass a default. The existing HeroRegistration passed a role. 
    // Let's assume the RegistrationForm has a way to select role if none provided, or we default to 'learner'.
    const [role, setRole] = React.useState('student'); // Defaulting for now

    return (
        <div className="auth-page">
            {/* Left Section - Decoration */}
            <div className="auth-hero-section">
                <div className="auth-hero-content">
                    <h1 className="auth-hero-title">
                        Join the <br />
                        <span className="highlight-text">Community</span>
                    </h1>
                    <p className="auth-hero-subtitle">
                        Start your personalized learning journey today.
                    </p>
                </div>
                {/* Floating Icons */}
                <BarChart3 size={40} className="auth-float-icon af-1" strokeWidth={1.5} />
                <Atom size={40} className="auth-float-icon af-2" strokeWidth={1.5} />
                <Sparkles size={32} className="auth-float-icon af-3" strokeWidth={1.5} />
            </div>

            {/* Right Section - Form */}
            <div className="auth-form-section">
                <div className="auth-card animate-fade-in" style={{ maxWidth: '480px' }}>
                    <Link to="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '1rem', textDecoration: 'none' }}>
                        <ArrowLeft size={18} /> Back to Home
                    </Link>

                    <RegistrationForm role={role} onBack={() => { }} />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
