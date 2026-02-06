import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { api } from '../services/api'; // Use real API
import SEO from '../components/common/SEO';
import '../styles/GradeSyllabus.css';

const SkillItem = ({ skill }) => (
    <Link to={`/practice/${skill.skill_id}`} className="skill-item">
        <span className="skill-code">&bull;</span>
        <span className="skill-title">{skill.skill_name}</span>
    </Link>
);

SkillItem.propTypes = {
    skill: PropTypes.object.isRequired
};

const GradeSyllabus = () => {
    const { grade } = useParams();
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);


    // Add logic to redirect to specialized views if applicable
    useEffect(() => {
        const gradeNum = parseInt(grade.replace('grade', ''));

        // Redirect logic for specialized grade designs
        if (gradeNum >= 1 && gradeNum <= 4) {
            // Junior Grades (1-4) Use the new Junior Design
            // We use window.location to force a full redirect if needed, but navigate is smoother
            // However, to ensure they see the new route clearly:
            if (!window.location.href.includes('/junior/')) {
                window.location.href = `/junior/grade/${gradeNum}`;
                return;
            }
        }
        else if (gradeNum >= 5 && gradeNum <= 7) {
            // Middle Grades (5-7) Use the new Professional Design
            if (!window.location.href.includes('/middle/')) {
                window.location.href = `/middle/grade/${gradeNum}`;
                return;
            }
        }

        const fetchData = async () => {

            setLoading(true);
            try {
                // Parse grade number from param (e.g., "1" from "grade1" or just "1")
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

    // Group skills by topic for better display
    const skillsByTopic = skills.reduce((acc, skill) => {
        const topic = skill.topic || 'General';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(skill);
        return acc;
    }, {});

    // Hover Preview Logic
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const [previewContent, setPreviewContent] = useState(null);
    const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });

    const handleMouseEnter = async (skill, e, typeOverride = null) => {
        setHoveredSkill(skill.skill_id);
        const rect = e.currentTarget.getBoundingClientRect();
        // Adjust position to avoid going off-screen
        let left = rect.right + 10;
        if (left + 320 > window.innerWidth) {
            left = rect.left - 320; // Show on left if no space on right
        }

        setPreviewPos({ x: left, y: rect.top });
        setPreviewContent("Loading preview...");

        try {
            // Fetch 1 practice question for preview
            const response = await api.getPracticeQuestionsBySkill(skill.skill_id, 1, typeOverride);

            if (response && response.selection_needed && response.available_types?.length > 0) {
                // Auto-select the first type and retry
                const firstType = response.available_types[0];
                await handleMouseEnter(skill, e, firstType);
                return;
            }

            if (response && response.preview_samples && response.preview_samples.length > 0) { // Support V2 format
                setPreviewContent(response.preview_samples[0].question_html);
            } else if (response && response.data && response.data.length > 0) { // Support V1 format
                setPreviewContent(response.data[0].question_html || response.data[0].question);
            } else {
                setPreviewContent("No preview available for this skill.");
            }
        } catch (err) {
            setPreviewContent("Preview unavailable.");
            // console.error(err); // Suppress console noise
        }
    };

    const handleMouseLeave = () => {
        setHoveredSkill(null);
        setPreviewContent(null);
    };

    if (loading) return <div className="loading-container">Loading syllabus...</div>;

    // Display if no skills found
    if (!skills || skills.length === 0) return (
        <div className="grade-syllabus-container">
            <header className="syllabus-header">
                <h1>Class {grade.replace('grade', '')} Maths</h1>
                <p>No active content found for this grade.</p>
            </header>
        </div>
    );

    return (
        <div className="grade-syllabus-container">
            <SEO title={`Class ${grade.replace('grade', '')} Maths - Skill100`} description={`Complete syllabus for Class ${grade.replace('grade', '')}`} />

            <header className="syllabus-header">
                <h1>Class {grade.replace('grade', '')} Maths</h1>
                <p>Here is a list of all of the maths skills students learn in Class {grade.replace('grade', '')}!</p>
            </header>

            <div className="syllabus-grid">
                {Object.entries(skillsByTopic).map(([topic, topicSkills]) => (
                    <div key={topic} className="category-block">
                        <h3 className="category-title">{topic}</h3>
                        <div className="category-content">
                            {topicSkills.map(skill => (
                                <div
                                    key={skill.skill_id}
                                    onMouseEnter={(e) => handleMouseEnter(skill, e)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ position: 'relative' }} // For positioning context if needed
                                >
                                    <SkillItem skill={skill} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Hover Preview Tooltip */}
            {hoveredSkill && previewContent && (
                <div
                    className="skill-preview-tooltip"
                    style={{
                        position: 'fixed',
                        left: previewPos.x,
                        top: previewPos.y,
                        width: '320px',
                        background: 'white',
                        padding: '16px',
                        borderRadius: '16px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                        zIndex: 1000,
                        border: '1px solid #e2e8f0',
                        pointerEvents: 'none',
                        fontSize: '0.95rem'
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '8px'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Quick Preview
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8', background: '#f8fafc', padding: '2px 6px', borderRadius: '4px' }}>
                            {/* Potential difficulty label here */}
                            Sample
                        </span>
                    </div>

                    {previewContent === "No preview available for this skill." || previewContent === "Preview unavailable." ? (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: '#94a3b8' }}>
                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚧</div>
                            <p style={{ margin: 0 }}>Preview coming soon!</p>
                        </div>
                    ) : (
                        <div
                            dangerouslySetInnerHTML={{ __html: previewContent }}
                            style={{ lineHeight: '1.6', color: '#334155' }}
                            className="preview-content-html"
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default GradeSyllabus;
