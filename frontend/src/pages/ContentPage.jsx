import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    BookOpen, Calculator, Shapes, PieChart, Ruler,
    Hash, Percent, Grid, Target, TrendingUp,
    Star, Sparkles, Brain, Lightbulb, Rocket
} from 'lucide-react';
import SEO from '../components/common/SEO';
import Navbar from '../components/Navbar';
import '../styles/LearnPage.css';

// Topic avatars with gradient backgrounds
const TopicAvatar = ({ icon: Icon, gradient }) => (
    <div className="topic-avatar" style={{ background: gradient }}>
        <Icon className="topic-icon" />
    </div>
);

TopicAvatar.propTypes = {
    icon: PropTypes.elementType.isRequired,
    gradient: PropTypes.string.isRequired
};

const ContentPage = ({ topic }) => {
    const navigate = useNavigate();

    // Sample topics from different grades
    const featuredTopics = [
        { id: 1, name: 'Place Values', grade: 3, icon: Hash, gradient: 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)', category: 'Numbers' },
        { id: 2, name: 'Fractions', grade: 5, icon: PieChart, gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', category: 'Fractions' },
        { id: 3, name: 'Geometry Basics', grade: 6, icon: Shapes, gradient: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)', category: 'Geometry' },
        { id: 4, name: 'Algebra', grade: 7, icon: Calculator, gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', category: 'Algebra' },
        { id: 5, name: 'Percentages', grade: 6, icon: Percent, gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)', category: 'Ratio' },
        { id: 6, name: 'Measurement', grade: 4, icon: Ruler, gradient: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', category: 'Measurement' },
        { id: 7, name: 'Data & Graphs', grade: 8, icon: TrendingUp, gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', category: 'Statistics' },
        { id: 8, name: 'Multiplication', grade: 3, icon: Grid, gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', category: 'Operations' },
    ];

    const learningTips = [
        { icon: Brain, title: 'Active Recall', desc: 'Test yourself repeatedly to strengthen memory' },
        { icon: Lightbulb, title: 'Spaced Repetition', desc: 'Review at increasing intervals for long-term retention' },
        { icon: Target, title: 'Focus Practice', desc: 'Work on weak areas with targeted exercises' },
        { icon: Rocket, title: 'Daily Streaks', desc: 'Build consistency with daily practice sessions' },
    ];

    // Specialized data for learn-to-learn page
    if (topic === 'learn-to-learn') {
        return (
            <div className="learn-page">
                <SEO title="Learn to Learn | Skill100.AI" description="Discover topics and master mathematics with smart learning techniques." />
                <Navbar />

                {/* Learning Tips */}
                <section className="tips-section">
                    <h2>📚 Learning Strategies</h2>
                    <div className="tips-grid">
                        {learningTips.map((tip, idx) => (
                            <div key={idx} className="tip-card">
                                <div className="tip-icon-wrapper">
                                    <tip.icon className="tip-icon" />
                                </div>
                                <h3>{tip.title}</h3>
                                <p>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Topics */}
                <section className="topics-section">
                    <div className="section-header">
                        <h2>🔥 Popular Topics Across Grades</h2>
                        <p>Explore topics from different grade levels</p>
                    </div>
                    <div className="topics-grid">
                        {featuredTopics.map((topicItem) => (
                            <div
                                key={topicItem.id}
                                className="topic-card"
                                onClick={() => navigate(`/math/grade/${topicItem.grade}`)}
                            >
                                <TopicAvatar icon={topicItem.icon} gradient={topicItem.gradient} />
                                <div className="topic-info">
                                    <h3>{topicItem.name}</h3>
                                    <div className="topic-meta">
                                        <span className="grade-badge">Grade {topicItem.grade}</span>
                                        <span className="category-tag">{topicItem.category}</span>
                                    </div>
                                </div>
                                <div className="topic-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Quick Start Section */}
                <section className="quickstart-section">
                    <div className="quickstart-content">
                        <Star className="quickstart-icon" />
                        <h2>Ready to Start Learning?</h2>
                        <p>Choose your grade level and begin your math journey today!</p>
                        <button onClick={() => navigate('/practice')} className="start-btn">
                            Browse All Grades
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    // Default content for other topics
    const topicData = {
        'math': { title: 'Mathematics', desc: 'Mathematical concepts and tutorials.' },
        'ai': { title: 'Artificial Intelligence', desc: 'AI models, theory, and application.' }
    };

    const data = topicData[topic] || { title: 'Topic Not Found', desc: 'The requested content does not exist.' };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <SEO title={`${data.title} - Learner's Hub`} description={data.desc} />
            <h1>{data.title}</h1>
            <p>{data.desc}</p>
        </div>
    );
};

ContentPage.propTypes = {
    topic: PropTypes.string.isRequired
};

export default ContentPage;
