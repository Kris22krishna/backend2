import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Star, Zap, Trophy, Sparkles } from 'lucide-react';
import SEO from '../components/common/SEO';
import '../styles/MathSelection.css';

// Custom SVG Illustrations for each category
const JuniorIllustration = () => (
    <svg viewBox="0 0 200 160" className="category-illustration">
        {/* Cute building blocks */}
        <rect x="30" y="100" width="35" height="35" rx="5" fill="#fbbf24" />
        <rect x="75" y="80" width="35" height="55" rx="5" fill="#fb923c" />
        <rect x="120" y="60" width="35" height="75" rx="5" fill="#f87171" />
        {/* Stars */}
        <circle cx="50" cy="50" r="8" fill="#fcd34d" />
        <circle cx="140" cy="40" r="6" fill="#fcd34d" />
        <circle cx="170" cy="70" r="5" fill="#fcd34d" />
        {/* Numbers floating */}
        <text x="45" y="55" fontSize="12" fill="#fff" fontWeight="bold">1</text>
        <text x="137" y="44" fontSize="10" fill="#fff" fontWeight="bold">2</text>
        <text x="167" y="74" fontSize="8" fill="#fff" fontWeight="bold">3</text>
        {/* Smiling face on block */}
        <circle cx="47" cy="115" r="3" fill="#92400e" />
        <circle cx="57" cy="115" r="3" fill="#92400e" />
        <path d="M 45 122 Q 52 128 60 122" stroke="#92400e" strokeWidth="2" fill="none" />
    </svg>
);

const MiddleSchoolIllustration = () => (
    <svg viewBox="0 0 200 160" className="category-illustration">
        {/* Geometric shapes */}
        <polygon points="100,20 140,80 60,80" fill="#06b6d4" opacity="0.9" />
        <rect x="45" y="90" width="50" height="50" rx="8" fill="#3b82f6" transform="rotate(15 70 115)" />
        <circle cx="140" cy="110" r="30" fill="#8b5cf6" />
        {/* Math symbols */}
        <text x="90" y="60" fontSize="16" fill="#fff" fontWeight="bold">△</text>
        <text x="130" y="115" fontSize="20" fill="#fff" fontWeight="bold">π</text>
        <text x="60" y="120" fontSize="14" fill="#fff" fontWeight="bold">x²</text>
        {/* Decorative lines */}
        <line x1="20" y1="40" x2="40" y2="40" stroke="#22d3ee" strokeWidth="3" />
        <line x1="160" y1="50" x2="180" y2="50" stroke="#a78bfa" strokeWidth="3" />
        <circle cx="30" cy="130" r="4" fill="#22d3ee" />
        <circle cx="170" cy="140" r="5" fill="#a78bfa" />
    </svg>
);

const HighSchoolIllustration = () => (
    <svg viewBox="0 0 200 160" className="category-illustration">
        {/* Advanced math - coordinate plane */}
        <line x1="30" y1="80" x2="170" y2="80" stroke="#475569" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="140" stroke="#475569" strokeWidth="2" />
        {/* Curve/Graph */}
        <path d="M 40 120 Q 70 40 100 80 T 160 50" stroke="#10b981" strokeWidth="3" fill="none" />
        {/* Points on graph */}
        <circle cx="40" cy="120" r="5" fill="#f43f5e" />
        <circle cx="100" cy="80" r="5" fill="#f43f5e" />
        <circle cx="160" cy="50" r="5" fill="#f43f5e" />
        {/* Formula */}
        <text x="120" y="35" fontSize="11" fill="#64748b" fontWeight="500">f(x)</text>
        {/* Decorative */}
        <circle cx="25" cy="30" r="6" fill="#10b981" opacity="0.5" />
        <circle cx="175" cy="130" r="8" fill="#f43f5e" opacity="0.5" />
        {/* Integral symbol */}
        <text x="140" y="140" fontSize="20" fill="#8b5cf6" fontWeight="bold">∫</text>
    </svg>
);

const MathSelection = () => {
    const navigate = useNavigate();
    const [hoveredCategory, setHoveredCategory] = useState(null);

    const categories = [
        {
            id: 'junior',
            title: 'Junior School',
            subtitle: 'Foundation & Fun',
            description: 'Build strong math foundations with interactive games and colorful activities',
            grades: [
                { id: '1', label: 'Grade 1' },
                { id: '2', label: 'Grade 2' },
                { id: '3', label: 'Grade 3' },
                { id: '4', label: 'Grade 4' },
            ],
            color: 'junior',
            gradient: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)',
            bgLight: '#fef3c7',
            icon: <Star className="category-icon" />,
            illustration: <JuniorIllustration />,
            features: ['Counting & Numbers', 'Basic Operations', 'Fun Puzzles'],
        },
        {
            id: 'middle',
            title: 'Middle School',
            subtitle: 'Explore & Discover',
            description: 'Dive deeper into algebra, geometry, and problem-solving techniques',
            grades: [
                { id: '5', label: 'Grade 5' },
                { id: '6', label: 'Grade 6' },
                { id: '7', label: 'Grade 7' },
            ],
            color: 'middle',
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            bgLight: '#e0f2fe',
            icon: <Zap className="category-icon" />,
            illustration: <MiddleSchoolIllustration />,
            features: ['Algebra Basics', 'Geometry', 'Data & Graphs'],
        },
        {
            id: 'high',
            title: 'High School',
            subtitle: 'Master & Excel',
            description: 'Advanced concepts, exam preparation, and competitive math challenges',
            grades: [
                { id: '8', label: 'Grade 8' },
                { id: '9', label: 'Grade 9' },
                { id: '10', label: 'Grade 10' },
            ],
            color: 'high',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            bgLight: '#d1fae5',
            icon: <Trophy className="category-icon" />,
            illustration: <HighSchoolIllustration />,
            features: ['Advanced Algebra', 'Trigonometry', 'Calculus Prep'],
        },
    ];

    return (
        <div className="math-selection-page">
            <SEO title="Math - Choose Your Level" description="Select your grade level to start learning mathematics." />

            {/* Hero Section */}
            <section className="math-hero">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles className="badge-icon" />
                        <span>Interactive Learning</span>
                    </div>
                    <h1>Choose Your <span className="gradient-text">Math Journey</span></h1>
                    <p>Select your grade level and embark on an exciting mathematical adventure tailored just for you!</p>
                </div>
                <div className="hero-decoration">
                    <div className="floating-shape shape-1"></div>
                    <div className="floating-shape shape-2"></div>
                    <div className="floating-shape shape-3"></div>
                </div>
            </section>

            {/* Categories Grid */}
            <section className="categories-section">
                <div className="categories-grid">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className={`category-card ${category.color} ${hoveredCategory === category.id ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                        >
                            {/* Card Header with Illustration */}
                            <div className="card-header" style={{ background: category.gradient }}>
                                <div className="header-content">
                                    {category.icon}
                                    <h2>{category.title}</h2>
                                    <span className="subtitle">{category.subtitle}</span>
                                </div>
                                <div className="illustration-wrapper">
                                    {category.illustration}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="card-body">
                                <p className="card-description">{category.description}</p>

                                {/* Features */}
                                <div className="features-list">
                                    {category.features.map((feature, idx) => (
                                        <span key={idx} className="feature-tag" style={{ backgroundColor: category.bgLight }}>
                                            {feature}
                                        </span>
                                    ))}
                                </div>

                                {/* Grade Buttons */}
                                <div className="grades-list">
                                    {category.grades.map((grade) => (
                                        <button
                                            key={grade.id}
                                            className="grade-btn"
                                            onClick={() => {
                                                const id = parseInt(grade.id);
                                                if (id >= 1 && id <= 4) {
                                                    navigate(`/junior/grade/${grade.id}`);
                                                } else if (id >= 5 && id <= 7) {
                                                    navigate(`/middle/grade/${grade.id}`);
                                                } else {
                                                    navigate(`/math/grade/${grade.id}`);
                                                }
                                            }}
                                            style={{ '--accent-gradient': category.gradient }}
                                        >
                                            <span>{grade.label}</span>
                                            <ChevronRight className="btn-arrow" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="bottom-cta">
                <p>🎯 Pick your grade and start solving problems today!</p>
            </section>
        </div>
    );
};

export default MathSelection;
