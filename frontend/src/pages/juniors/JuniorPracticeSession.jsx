import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Flag, Home, RefreshCw, Star } from 'lucide-react';
import { api } from '../../services/api'; // Correct import
import './JuniorPracticeSession.css';

const JuniorPracticeSession = () => {
    const { grade } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const skillId = searchParams.get('skillId');
    const skillName = searchParams.get('skillName');

    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState({}); // { questionIndex: { selected: ..., correct: boolean } }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
    const [showResults, setShowResults] = useState(false);

    // Fetch questions
    useEffect(() => {
        const fetchQuestions = async () => {
            if (!skillId) return;
            try {
                setLoading(true);
                // Fetch 10 questions for the skill
                const response = await api.getPracticeQuestionsBySkill(skillId, 10);

                // Handle different response structures
                let rawQuestions = [];
                if (response && response.questions) {
                    rawQuestions = response.questions; // Standard APIResponse format
                } else if (Array.isArray(response)) {
                    rawQuestions = response; // Direct array
                }

                // Ensure questions are valid
                const validQuestions = rawQuestions.map(q => {
                    // Normalize standard and generated questions
                    return {
                        id: q.id || q.question_id,
                        text: q.question_text || q.question,
                        options: q.options || [],
                        correctAnswer: q.correct_answer || q.answer,
                        type: q.type || 'MCQ'
                    };
                });

                setQuestions(validQuestions);
            } catch (error) {
                console.error('Error fetching questions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [skillId]);

    // Timer logic
    useEffect(() => {
        if (showResults) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitSession(); // Auto submit
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [showResults]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (option) => {
        if (isSubmitted) return;
        setSelectedOption(option);
    };

    const handleNext = () => {
        if (!selectedOption && !showResults) return; // Require answer

        // Save answer
        const currentQuestion = questions[currentIndex];
        const isCorrect = selectedOption === currentQuestion.correctAnswer;

        setAnswers(prev => ({
            ...prev,
            [currentIndex]: {
                selected: selectedOption,
                isCorrect
            }
        }));

        setSelectedOption(null);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmitSession();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            // Restore previous selection if needed for review, 
            // but usually we clear for a "fresh" look unless implementing review mode.
            // For now, simpler is better.
        }
    };

    const handleSubmitSession = async () => {
        // Calculate stats
        let correctCount = 0;
        Object.values(answers).forEach(ans => {
            if (ans.isCorrect) correctCount++;
        });

        // Submit report
        try {
            const reportData = {
                title: skillName || 'Junior Math Practice',
                type: 'practice',
                score: (correctCount / questions.length) * 100,
                parameters: {
                    skill_id: skillId,
                    skill_name: skillName,
                    total_questions: questions.length,
                    correct_answers: correctCount,
                    timestamp: new Date().toISOString()
                },
                user_id: 1 // Should be fetched from context/auth
            };

            await api.createReport(reportData);
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting report:', error);
            setShowResults(true); // Show results anyway
        }
    };

    if (loading) return <div className="loading-junior">Loading your adventure...</div>;

    if (!questions || questions.length === 0) {
        return (
            <div className="junior-practice-page">
                <header className="junior-practice-header">
                    <button className="back-btn-large" onClick={() => navigate(-1)} style={{ border: 'none', background: 'transparent' }}>
                        <ChevronLeft size={32} color="#2C3E50" />
                    </button>
                    <h1>Oops!</h1>
                </header>
                <main className="practice-content" style={{ flexDirection: 'column', textAlign: 'center' }}>
                    <div className="mascot-container" style={{ marginRight: 0 }}>
                        <img
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=confused`}
                            alt="Confused Mascot"
                            className="mascot-image"
                        />
                    </div>
                    <div className="question-board" style={{ minHeight: 'auto', padding: '3rem' }}>
                        <h2>No questions found for this topic yet!</h2>
                        <p>Ask a grown-up to check back later.</p>
                        <button className="retry-btn-large" onClick={() => navigate(-1)} style={{ marginTop: '2rem' }}>
                            <Home /> Go Back
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    if (showResults) {
        const score = Object.values(answers).filter(a => a.isCorrect).length;
        const percentage = Math.round((score / questions.length) * 100);

        return (
            <div className="junior-practice-page results-page">
                <div className="junior-container results-container">
                    <h1>Adventure Complete! 🎉</h1>
                    <div className="stars-result">
                        {[1, 2, 3].map(i => (
                            <Star key={i} size={60}
                                fill={percentage >= (i * 33) ? "#FFD700" : "none"}
                                color={percentage >= (i * 33) ? "#FFD700" : "#CBD5E0"}
                            />
                        ))}
                    </div>
                    <p className="score-text">You got {score} out of {questions.length} correct!</p>
                    <button className="back-btn-large" onClick={() => navigate(-1)}>
                        <Home /> Back to Topics
                    </button>
                    <button className="retry-btn-large" onClick={() => window.location.reload()}>
                        <RefreshCw /> Play Again
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];
    const getStepStatus = (index) => {
        if (index === currentIndex) return 'current';
        if (index < currentIndex) return 'completed';
        return '';
    };

    return (
        <div className="junior-practice-page">
            {/* Header */}
            <header className="junior-practice-header">
                {/* Sun Timer */}
                <div className="sun-timer-container">
                    <div className="sun-timer">
                        <div className="sun-rays"></div>
                        <span className="timer-text">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps-container">
                    <button className="nav-arrow prev" onClick={handlePrev} disabled={currentIndex === 0}>
                        <ChevronLeft size={20} />
                    </button>

                    <div className="progress-steps">
                        {questions.map((_, idx) => (
                            <div key={idx} className={`step-circle ${getStepStatus(idx)}`}>
                                {idx + 1}
                            </div>
                        ))}
                    </div>

                    <button className="nav-arrow next" onClick={handleNext} disabled={!selectedOption}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="practice-content">
                {/* Mascot - Positioned to interact with board */}
                <div className="mascot-container">
                    <img
                        src={skillName && skillName.includes('animal') ? "https://api.dicebear.com/7.x/fun-emoji/svg?seed=bear" : "https://api.dicebear.com/7.x/bottts/svg?seed=Felix"}
                        alt="Mascot"
                        className="mascot-image"
                    />
                </div>

                {/* Question Board */}
                <div className="question-board">
                    <div className="board-header">
                        <h2 className="question-text">
                            <span className="question-number">{currentIndex + 1}.</span>
                            {currentQuestion?.text}
                        </h2>
                        <button className="review-later-btn">
                            Review later? <Flag size={14} />
                        </button>
                    </div>

                    <div className="options-grid">
                        {currentQuestion?.options.map((option, idx) => (
                            <button
                                key={idx}
                                className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Bottom Actions Bar */}
            <div className="bottom-actions-bar">
                <button className="magic-pad-btn">
                    Magic Pad <span style={{ fontSize: '1.2rem' }}>✏️</span>
                </button>

                <div className="right-controls">
                    <button className="start-over-btn" onClick={() => window.location.reload()}>
                        <RefreshCw size={18} /> Start Over
                    </button>

                    <button className="nav-circle-btn prev" onClick={handlePrev} disabled={currentIndex === 0}>
                        <ChevronLeft size={32} />
                    </button>

                    <button className="nav-circle-btn next" onClick={handleNext} disabled={!selectedOption}>
                        <ChevronRight size={32} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JuniorPracticeSession;
