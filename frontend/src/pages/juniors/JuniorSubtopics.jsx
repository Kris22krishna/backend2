import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Home, Check, Sparkles } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Navbar from '../../components/Navbar';
import { api } from '../../services/api';
import './JuniorSubtopics.css';

// Colors for subtopics
const subtopicColors = [
    { color: '#FFE66D', gradient: 'linear-gradient(135deg, #FFE66D 0%, #FFF4A3 100%)' },
    { color: '#98D8C8', gradient: 'linear-gradient(135deg, #98D8C8 0%, #B8E6D5 100%)' },
    { color: '#FFB6B9', gradient: 'linear-gradient(135deg, #FFB6B9 0%, #FFC8CB 100%)' },
    { color: '#87CEEB', gradient: 'linear-gradient(135deg, #87CEEB 0%, #B8D8F5 100%)' },
    { color: '#C9A9E9', gradient: 'linear-gradient(135deg, #C9A9E9 0%, #E0CFFA 100%)' },
    { color: '#FFDAB9', gradient: 'linear-gradient(135deg, #FFDAB9 0%, #FFE5CC 100%)' },
];

const JuniorSubtopics = () => {
    const { grade, topic } = useParams();
    const navigate = useNavigate();
    const [subtopics, setSubtopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredSubtopic, setHoveredSubtopic] = useState(null);
    const decodedTopic = decodeURIComponent(topic);

    useEffect(() => {
        const fetchSubtopics = async () => {
            try {
                setLoading(true);
                const gradeNum = grade.replace('grade', '');

                // Fetch both skills and user stats in parallel, handling stats failure gracefully
                const [skillsResponse, statsResponse] = await Promise.all([
                    api.getSkills(gradeNum),
                    api.getStudentStats().catch(err => {
                        console.warn('Failed to fetch stats:', err);
                        return null;
                    })
                ]);

                // Create a map of skill scores
                const skillScores = {};
                if (statsResponse) {
                    [...(statsResponse.mastered_skills || []), ...(statsResponse.in_progress_skills || [])].forEach(s => {
                        skillScores[s.name] = s.score;
                    });
                }

                // Filter by topic and get unique skills
                const filteredSkills = (skillsResponse || [])
                    .filter(skill => skill.topic === decodedTopic)
                    .filter((skill, index, self) =>
                        skill.skill_name && self.findIndex(s => s.skill_id === skill.skill_id) === index
                    );

                const subtopicList = filteredSkills.map((skill, index) => {
                    const score = skillScores[skill.skill_name] || 0;
                    return {
                        id: skill.skill_id,
                        name: skill.skill_name,
                        score: score,
                        completed: score >= 85, // Consider completed if score >= 85
                        colorIndex: index % subtopicColors.length
                    };
                });

                setSubtopics(subtopicList);
            } catch (error) {
                console.error('Error fetching subtopics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubtopics();
    }, [grade, decodedTopic]);

    const completedCount = subtopics.filter(s => s.completed).length;

    return (
        <div className="junior-subtopics-page">
            <SEO title={`${decodedTopic} - Grade ${grade}`} description={`Learn ${decodedTopic} in Grade ${grade}`} />
            <Navbar />

            {/* Floating decorations */}
            <div className="junior-decorations">
                <div className="floating-cloud cloud-1"></div>
                <div className="floating-cloud cloud-2"></div>
                <div className="floating-cloud cloud-3"></div>
            </div>

            <div className="junior-container">
                {/* Back Button */}
                <button className="back-btn" onClick={() => navigate(`/junior/grade/${grade}`)}>
                    <Home className="back-icon" />
                    <span>Back to Topics</span>
                </button>

                {/* Header */}
                <div className="junior-header">
                    <h1>Choose a Topic! 📚</h1>
                    <div className="completion-badge">
                        <Sparkles className="sparkle-icon" />
                        <span>{completedCount} of {subtopics.length} completed! 🎉</span>
                    </div>
                    <p className="topic-title">{decodedTopic}</p>
                </div>

                {/* Subtopics List */}
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Loading activities...</p>
                    </div>
                ) : (
                    <div className="subtopics-container">
                        <div className="subtopics-list">
                            {subtopics.map((subtopic, index) => {
                                const style = subtopicColors[subtopic.colorIndex];
                                return (
                                    <button
                                        key={subtopic.id}
                                        className={`subtopic-pill ${hoveredSubtopic === subtopic.id ? 'hovered' : ''} ${subtopic.completed ? 'completed' : ''}`}
                                        style={{
                                            '--pill-color': style.color,
                                            '--pill-gradient': style.gradient,
                                            '--animation-delay': `${index * 0.1}s`
                                        }}
                                        onMouseEnter={() => setHoveredSubtopic(subtopic.id)}
                                        onMouseLeave={() => setHoveredSubtopic(null)}
                                        onClick={() => navigate(`/junior/grade/${grade}/practice?topic=${encodeURIComponent(decodedTopic)}&skillId=${subtopic.id}&skillName=${encodeURIComponent(subtopic.name)}`)}
                                    >
                                        {/* Glow effect */}
                                        <div className="pill-glow"></div>

                                        {/* Icon container */}
                                        <div className="pill-icon">
                                            {subtopic.completed ? (
                                                <Check className="check-icon" />
                                            ) : (
                                                <span className="number-icon">{index + 1}</span>
                                            )}
                                        </div>

                                        {/* Text */}
                                        <span className="pill-text">{subtopic.name}</span>

                                        {/* Completed checkmark */}
                                        {subtopic.completed && (
                                            <div className="completed-badge">
                                                <Check className="badge-check" />
                                            </div>
                                        )}

                                        {/* Hover label */}
                                        {hoveredSubtopic === subtopic.id && !subtopic.completed && (
                                            <div className="hover-label">
                                                Click to start! 🚀
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JuniorSubtopics;
