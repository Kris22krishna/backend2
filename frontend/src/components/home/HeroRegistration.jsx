import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import RegistrationForm from '../auth/RegistrationForm';
import './HeroSection.css';

const HeroRegistration = ({ selectedRole, setSelectedRole }) => {
    return (
        <div className="hero-right">
            <div className="hero-cta-buttons">
                <button className="btn-primary-large">Start Practicing</button>
                <button className="btn-secondary-large">Take Skill Assessment</button>
            </div>
        </div>
    );
};

export default HeroRegistration;
