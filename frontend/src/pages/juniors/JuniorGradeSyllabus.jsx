import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Star, ChevronRight, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/Navbar';
import { api } from '../../services/api';
import './JuniorGradeSyllabus.css';

// Topic icons with pastel colors for children
const topicIcons = {
    'Numbers': { emoji: '🔢', color: '#FFE66D', gradient: 'linear-gradient(135deg, #FFE66D 0%, #FFF4A3 100%)' },
    'Addition': { emoji: '➕', color: '#98D8C8', gradient: 'linear-gradient(135deg, #98D8C8 0%, #B8E6D5 100%)' },
    'Subtraction': { emoji: '➖', color: '#FFB6B9', gradient: 'linear-gradient(135deg, #FFB6B9 0%, #FFC8CB 100%)' },
    'Multiplication': { emoji: '✖️', color: '#87CEEB', gradient: 'linear-gradient(135deg, #87CEEB 0%, #B8D8F5 100%)' },
    'Division': { emoji: '➗', color: '#C9A9E9', gradient: 'linear-gradient(135deg, #C9A9E9 0%, #E0CFFA 100%)' },
    'Shapes': { emoji: '🔷', color: '#FFDAB9', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFE5CC 100%)' },
    'Patterns': { emoji: '🎨', color: '#FFB6B9', gradient: 'linear-gradient(135deg, #FFB6B9 0%, #FFC8CB 100%)' },
    'Counting': { emoji: '🔟', color: '#98D8C8', gradient: 'linear-gradient(135deg, #98D8C8 0%, #B8E6D5 100%)' },
    'Fractions': { emoji: '🍕', color: '#FFE66D', gradient: 'linear-gradient(135deg, #FFE66D 0%, #FFF4A3 100%)' },
    'Measurement': { emoji: '📏', color: '#87CEEB', gradient: 'linear-gradient(135deg, #87CEEB 0%, #B8D8F5 100%)' },
    'Time': { emoji: '⏰', color: '#C9A9E9', gradient: 'linear-gradient(135deg, #C9A9E9 0%, #E0CFFA 100%)' },
    'Money': { emoji: '💰', color: '#98D8C8', gradient: 'linear-gradient(135deg, #98D8C8 0%, #B8E6D5 100%)' },
    'Geometry': { emoji: '📐', color: '#FFDAB9', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFE5CC 100%)' },
    'Data': { emoji: '📊', color: '#FFB6B9', gradient: 'linear-gradient(135deg, #FFB6B9 0%, #FFC8CB 100%)' },
    'default': { emoji: '⭐', color: '#FFE66D', gradient: 'linear-gradient(135deg, #FFE66D 0%, #FFF4A3 100%)' }
};

const getTopicStyle = (topicName) => {
    for (const [key, value] of Object.entries(topicIcons)) {
        if (topicName.toLowerCase().includes(key.toLowerCase())) {
            return value;
        }
    }
    return topicIcons.default;
};

const JuniorGradeSyllabus = () => {
    const { grade } = useParams();
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredTopic, setHoveredTopic] = useState(null);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                setLoading(true);
                const gradeNum = grade.replace('grade', '');

                // Fetch both skills and user stats in parallel, but handle stats failure gracefully
                const [skillsResponse, statsResponse] = await Promise.all([
                    api.getSkills(gradeNum),
                    api.getStudentStats().catch(err => {
                        console.warn('Failed to fetch stats:', err);
                        return null;
                    })
                ]);

                // Create a map of skill scores for O(1) lookup
                // statsResponse.in_progress_skills and mastered_skills have {name, score}
                // But we need all skills. The stats API returns recent/mastered/in_progress. 
                // We really need a full map.
                // Let's use the raw reports data if available or rely on what we have.
                // Wait, get_student_stats is aggregated. 
                // Let's assume we map by skill name from the stats.

                // Better approach: Create a local map from the stats arrays
                const skillScores = {};
                if (statsResponse) {
                    [...(statsResponse.mastered_skills || []), ...(statsResponse.in_progress_skills || [])].forEach(s => {
                        skillScores[s.name] = s.score;
                    });
                }

                // Group by parent topic
                const topicMap = {};
                (skillsResponse || []).forEach(skill => {
                    const topicName = skill.topic || 'General';
                    if (!topicMap[topicName]) {
                        topicMap[topicName] = {
                            name: topicName,
                            skills: [],
                            progress: 0,
                            stars: 0,
                            totalScore: 0,
                            skillCount: 0
                        };
                    }

                    // Add unique skills
                    if (skill.skill_name && !topicMap[topicName].skills.find(s => s.id === skill.skill_id)) {
                        const score = skillScores[skill.skill_name] || 0;
                        topicMap[topicName].skills.push({
                            id: skill.skill_id,
                            name: skill.skill_name,
                            score: score
                        });
                        topicMap[topicName].totalScore += score;
                        topicMap[topicName].skillCount += 1;
                    }
                });

                // Calculate averages for topics
                Object.values(topicMap).forEach(topic => {
                    if (topic.skillCount > 0) {
                        topic.progress = Math.round(topic.totalScore / topic.skillCount);
                        // Stars calculation: 0-20: 1, 21-40: 2, 41-60: 3, 61-80: 4, 81-100: 5
                        topic.stars = Math.ceil(topic.progress / 20) || 1;
                    } else {
                        topic.progress = 0;
                        topic.stars = 0;
                    }
                });

                setTopics(Object.values(topicMap));
            } catch (error) {
                console.error('Error fetching topics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, [grade]);

    const gradeLabels = {
        '1': 'Grade 1',
        '2': 'Grade 2',
        '3': 'Grade 3',
        '4': 'Grade 4'
    };

    return (
        <div className="junior-page">
            <SEO title={`${gradeLabels[grade]} - Math Adventures`} description={`Fun math topics for ${gradeLabels[grade]}`} />
            <Navbar />

            {/* Floating decorations */}
            <div className="junior-decorations">
                <div className="floating-cloud cloud-1"></div>
                <div className="floating-cloud cloud-2"></div>
                <div className="floating-cloud cloud-3"></div>
            </div>

            <div className="junior-container">
                {/* Back Button */}
                <button className="back-btn" onClick={() => navigate('/practice')}>
                    <Home className="back-icon" />
                    <span>Back Home</span>
                </button>

                {/* Header */}
                <div className="junior-header">
                    <h1>Choose Your Adventure! 🚀</h1>
                    <div className="grade-badge-large">
                        <Sparkles className="sparkle-icon" />
                        <span>{gradeLabels[grade]} Math</span>
                    </div>
                    <p>Pick a topic to start learning and having fun!</p>
                </div>

                {/* Topics Grid */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading fun topics...</p>
                    </div>
                ) : (
                    <div className="topics-grid">
                        {topics.map((topic, index) => {
                            const style = getTopicStyle(topic.name);
                            return (
                                <div
                                    key={topic.name}
                                    className={`topic-card-junior ${hoveredTopic === topic.name ? 'hovered' : ''}`}
                                    style={{
                                        '--card-color': style.color,
                                        '--card-gradient': style.gradient,
                                        '--animation-delay': `${index * 0.1}s`
                                    }}
                                    onMouseEnter={() => setHoveredTopic(topic.name)}
                                    onMouseLeave={() => setHoveredTopic(null)}
                                    onClick={() => navigate(`/junior/grade/${grade}/topic/${encodeURIComponent(topic.name)}`)}
                                >
                                    {/* Background glow */}
                                    <div className="card-glow"></div>

                                    {/* Icon */}
                                    <div className="topic-icon-bubble">
                                        <span className="topic-emoji">{style.emoji}</span>
                                    </div>

                                    {/* Topic Name */}
                                    <h2 className="topic-name">{topic.name}</h2>

                                    {/* Progress Bar */}
                                    <div className="progress-section">
                                        <div className="progress-labels">
                                            <span>Progress</span>
                                            <span className="progress-percent">{topic.progress}%</span>
                                        </div>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${topic.progress}%`, background: style.gradient }}
                                            ></div>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className="star-rating">
                                        {[1, 2, 3, 4, 5].map((starNum) => (
                                            <Star
                                                key={starNum}
                                                className={`star ${starNum <= topic.stars ? 'filled' : 'empty'}`}
                                            />
                                        ))}
                                    </div>

                                    {/* Skills count */}
                                    <div className="skills-count">
                                        {topic.skills.length} sub-topics
                                    </div>

                                    {/* Hover CTA */}
                                    {hoveredTopic === topic.name && (
                                        <div className="hover-cta" style={{ background: style.gradient }}>
                                            Let's Go! <ChevronRight className="cta-arrow" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default JuniorGradeSyllabus;
