import React from 'react';
import './HeroSection.css';
import { Sparkles, BarChart3, Atom } from 'lucide-react';

const HeroBranding = ({ selectedRole }) => {
    return (
        <div className="hero-left relative-container">
            <h1 className="hero-title serif-font">
                Go Beyond
                <span className="highlight-text"> 100</span>

                {/* Decorative Elements */}
                <div className="deco-icon float-1">
                    <BarChart3 size={32} strokeWidth={2.5} />
                </div>
                <div className="deco-icon float-2">
                    <Atom size={32} strokeWidth={2.5} />
                </div>
                <div className="deco-icon float-3">
                    <Sparkles size={28} strokeWidth={2.5} />
                </div>
            </h1>
            <p className="hero-subtitle">
                With personalized, expert-led guidance <br />
                at every grade
            </p>
        </div>
    );
};

export default HeroBranding;
