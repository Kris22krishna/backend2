import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { api } from '../../services/api';
import SEO from '../../components/common/SEO';
import {
    Grid, Layers, Triangle, Zap, Calculator, PieChart,
    ArrowRight, Box, Compass, Cuboid
} from 'lucide-react';
import './MiddleGradeSyllabus.css';

const SkillItem = ({ skill }) => (
    <Link to={`/middle/practice/${skill.skill_id}`} className="middle-skill-item">
        <ArrowRight size={16} className="skill-arrow" />
        <span className="skill-text">{skill.skill_name}</span>
    </Link>
);

SkillItem.propTypes = {
    skill: PropTypes.object.isRequired
};

// Helper to get icon based on topic name
const getTopicIcon = (topicName) => {
    const lower = topicName.toLowerCase();
    if (lower.includes('geometry') || lower.includes('shape')) return <Triangle size={24} />;
    if (lower.includes('algebra') || lower.includes('equation')) return <Calculator size={24} />;
    if (lower.includes('data') || lower.includes('graph')) return <PieChart size={24} />;
    if (lower.includes('fraction') || lower.includes('decimal')) return <Grid size={24} />;
    if (lower.includes('measurement')) return <Compass size={24} />;
    if (lower.includes('volume') || lower.includes('3d')) return <Cuboid size={24} />;
    return <Layers size={24} />; // Default
};

// Helper to get color accent based on index
const getAccentColor = (index) => {
    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    return colors[index % colors.length];
};

const MiddleGradeSyllabus = () => {
    const { grade } = useParams();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const gradeNum = grade.replace('grade', '');
                const response = await api.getSkills(gradeNum);
                setSkills(response || []);
            } catch (error) {
                console.error("Failed to fetch skills", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [grade]);

    // Group skills by topic
    const skillsByTopic = skills.reduce((acc, skill) => {
        const topic = skill.topic || 'General';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(skill);
        return acc;
    }, {});

    if (loading) return <div className="middle-loading">Loading syllabus...</div>;

    if (!skills || skills.length === 0) return (
        <div className="middle-syllabus-page">
            <header className="middle-header">
                <h1>Class {grade.replace('grade', '')} Maths</h1>
                <p>No active content found for this grade.</p>
            </header>
        </div>
    );

    return (
        <div className="middle-syllabus-page">
            <SEO title={`Class ${grade.replace('grade', '')} Maths - Skill100`} description={`Complete syllabus for Class ${grade.replace('grade', '')}`} />

            <div className="middle-container">
                <div className="middle-nav-controls">
                    <Link to="/math" className="middle-back-btn">
                        ← Back to Grades
                    </Link>
                </div>

                <header className="middle-header-bold">
                    <div className="header-decoration">
                        <div className="geo-shape shape-1"></div>
                        <div className="geo-shape shape-2"></div>
                    </div>
                    <div className="header-content">
                        <div className="grade-badge">GRADE {grade.replace('grade', '')}</div>
                        <h1>Mathematics</h1>
                        <p>Master advanced concepts with interactive problem solving.</p>
                    </div>
                </header>

                <div className="middle-masonry-grid">
                    {Object.entries(skillsByTopic).map(([topic, topicSkills], index) => {
                        const accentColor = getAccentColor(index);
                        return (
                            <div key={topic} className="middle-topic-card" style={{ '--card-accent': accentColor }}>
                                <div className="topic-header">
                                    <div className="topic-icon-wrapper">
                                        {getTopicIcon(topic)}
                                    </div>
                                    <h3 className="category-header">{topic}</h3>
                                </div>
                                <div className="skills-list">
                                    {topicSkills.map(skill => (
                                        <SkillItem key={skill.skill_id} skill={skill} />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MiddleGradeSyllabus;
