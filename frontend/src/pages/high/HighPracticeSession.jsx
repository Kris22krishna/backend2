import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, X, RefreshCw, Zap, Award, ArrowRight, Target, Clock, BookOpen } from 'lucide-react';
import Whiteboard from '../../components/Whiteboard';
import { api } from '../../services/api';
import './HighPracticeSession.css';
import Navbar from '../../components/Navbar';

const HighPracticeSession = () => {
    const { skillId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [stats, setStats] = useState({ correct: 0, wrong: 0, skipped: 0, total: 0, streak: 0 });
    const [completed, setCompleted] = useState(false);
    const [skillName, setSkillName] = useState('Practice Session');
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    // Time Tracking
    const startTimeRef = useRef(Date.now());
    const [timeTaken, setTimeTaken] = useState(0);

    // Format time helper
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        fetchQuestions();
        startTimeRef.current = Date.now();
    }, [skillId]);

    const fetchQuestions = async (retryType = null) => {
        setLoading(true);
        setError(null); // Clear previous errors
        try {
            console.log(`[HighPractice] Fetching questions for skillId: ${skillId}, type: ${retryType}`);
            const response = await api.getPracticeQuestionsBySkill(skillId, 10, retryType);
            console.log("[HighPractice] Raw API Response:", response);

            // Handle Type Selection Request from Backend
            if (response && response.selection_needed && response.available_types?.length > 0) {
                const defaultType = response.available_types[0];
                console.log(`[HighPractice] Selection needed. Auto-selecting: ${defaultType}`);
                // Recursively fetch with the selected type
                return fetchQuestions(defaultType);
            }

            let rawQuestions = [];

            // Handle various possible response structures
            if (response && Array.isArray(response.questions)) {
                rawQuestions = response.questions;
            } else if (response && Array.isArray(response.preview_samples)) {
                rawQuestions = response.preview_samples;
            } else if (Array.isArray(response)) {
                rawQuestions = response;
            } else if (response && typeof response === 'object') {
                // Last ditch effort: key search
                const possibleKeys = ['data', 'items', 'content'];
                for (const key of possibleKeys) {
                    if (Array.isArray(response[key])) {
                        rawQuestions = response[key];
                        break;
                    }
                }
            }

            console.log(`[HighPractice] Found ${rawQuestions.length} questions.`);

            if (rawQuestions.length === 0) {
                console.warn("[HighPractice] No questions found in parsed data.");
                setError("No questions could be generated for this skill. Please try again later."); // Set error if no questions
            }

            const normalized = rawQuestions.map((q, idx) => ({
                id: q.id || q.question_id || q.generated_question_id || idx,
                text: q.question_text || q.question || q.question_html || "Question Text Missing",
                options: q.options || (q.variables_used?.options) || [],
                correctAnswer: q.correct_answer || q.answer || q.answer_value || q.answer_key,
                solution: q.solution || q.solution_html || q.explanation || "No detailed explanation available.",
                type: q.type || q.question_type || (q.variables_used?.question_type) || 'MCQ',
                imageUrl: q.imageUrl || q.image_url
            }));

            setQuestions(normalized);
            // Metadata fallback
            if (response.skill_name) setSkillName(response.skill_name);
            else if (response.topic) setSkillName(response.topic);
            else if (response.template_metadata?.skill_name) setSkillName(response.template_metadata.skill_name); // Added fallback

        } catch (err) { // Changed error to err
            console.error("Error fetching high grade practice:", err);
            setError(err.message || "Failed to load practice session."); // Set error state
        } finally {
            setLoading(false);
        }
    };

    const handleCheck = () => {
        const currentQ = questions[currentIndex];
        if (!currentQ) return;

        const isCorrect = userAnswer.toString().trim().toLowerCase() === currentQ.correctAnswer.toString().trim().toLowerCase();

        setFeedback(isCorrect ? 'correct' : 'incorrect');

        const attempt = {
            question: currentQ,
            userVal: userAnswer,
            status: isCorrect ? 'correct' : 'wrong',
            solution: currentQ.solution
        };

        if (!history.find(h => h.question.id === currentQ.id)) {
            setHistory(prev => [...prev, attempt]);
        }

        if (isCorrect) {
            setStats(prev => ({
                ...prev,
                correct: prev.correct + 1,
                total: prev.total + 1,
                streak: prev.streak + 1
            }));
        } else {
            setStats(prev => ({
                ...prev,
                wrong: prev.wrong + 1,
                total: prev.total + 1,
                streak: 0
            }));
        }
    };

    const handleSkip = () => {
        const currentQ = questions[currentIndex];
        const attempt = {
            question: currentQ,
            userVal: 'Skipped',
            status: 'skipped',
            solution: currentQ.solution
        };

        setHistory(prev => [...prev, attempt]);
        setStats(prev => ({
            ...prev,
            skipped: prev.skipped + 1,
            total: prev.total + 1,
            streak: 0
        }));

        handleNextStep();
    };

    const handleNextStep = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setUserAnswer('');
            setFeedback(null);
        } else {
            finishSession();
        }
    };

    const finishSession = () => {
        const endTime = Date.now();
        const durationSeconds = Math.floor((endTime - startTimeRef.current) / 1000);
        setTimeTaken(durationSeconds);
        setCompleted(true);
    };

    // Live Timer
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        let timer;
        if (!loading && !completed) {
            timer = setInterval(() => {
                const seconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
                setElapsedTime(seconds);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [loading, completed]);

    const getQuestionStatus = (idx) => {
        if (idx === currentIndex) return 'current';
        const historyItem = history.find(h => h.question.id === questions[idx]?.id);
        if (historyItem) return historyItem.status;
        return 'pending';
    };

    if (loading) return <div className="high-practice-page high-loading"><h3>Loading Materials...</h3></div>;

    if (error) return (
        <div className="high-practice-page">
            <main className="high-main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="question-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ color: '#e11d48', marginBottom: '1rem' }}><Zap size={48} /></div>
                    <h2 style={{ fontFamily: 'Merriweather, serif', marginBottom: '1rem' }}>Unable to Load Session</h2>
                    <p style={{ color: '#64748b', marginBottom: '2rem' }}>{error}</p>
                    <button onClick={() => window.location.reload()} className="high-btn primary">Try Again</button>
                    <br /><br />
                    <Link to="/math" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.9rem' }}>Return to Dashboard</Link>
                </div>
            </main>
        </div>
    );



    if (completed) {
        const accuracy = Math.round((stats.correct / stats.total) * 100) || 0;
        return (
            <div className="high-practice-page">
                <Navbar />
                <main className="high-main-content" style={{ marginTop: '0' }}> {/* Navbar handles its own spacing usually, or we adjust */}
                    <div className="high-header">
                        <div className="high-title-group">
                            <h1>Session Complete</h1>
                            <div className="high-subtitle">
                                <Award size={18} />
                                Result Summary
                            </div>
                        </div>
                    </div>

                    <div className="question-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                        <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontFamily: 'Merriweather, serif' }}>{accuracy}%</h2>
                        <p style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600' }}>Accuracy Score</p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', marginBottom: '4rem' }}>
                            <div>
                                <strong style={{ fontSize: '1.5rem', display: 'block' }}>{stats.correct}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>CORRECT</span>
                            </div>
                            <div>
                                <strong style={{ fontSize: '1.5rem', display: 'block' }}>{stats.wrong}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>WRONG</span>
                            </div>
                            <div>
                                <strong style={{ fontSize: '1.5rem', display: 'block' }}>{formatTime(timeTaken)}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>TIME</span>
                            </div>
                        </div>

                        <div style={{ textAlign: 'left', borderTop: '2px solid #f1f5f9', paddingTop: '3rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                                <h3 style={{ fontFamily: 'Merriweather, serif', color: '#334155', fontSize: '1.5rem', margin: 0 }}>Session Review</h3>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></div> Correct</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e' }}></div> Wrong</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b' }}></div> Skipped</span>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                {questions.map((q, idx) => {
                                    const historyItem = history.find(h => h.question.id === q.id);
                                    const status = historyItem ? historyItem.status : 'skipped';
                                    const userVal = historyItem ? historyItem.userVal : '-';

                                    let statusColor = '#94a3b8'; // gray
                                    let statusIcon = <Clock size={16} />;
                                    if (status === 'correct') {
                                        statusColor = '#10b981';
                                        statusIcon = <Check size={16} />;
                                    }
                                    if (status === 'wrong') {
                                        statusColor = '#f43f5e';
                                        statusIcon = <X size={16} />;
                                    }
                                    if (status === 'skipped') {
                                        statusColor = '#f59e0b';
                                        statusIcon = <ArrowRight size={16} />;
                                    }

                                    return (
                                        <div key={idx} className={`review-item ${status}`}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <span style={{ fontWeight: '700', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                    Question {idx + 1}
                                                </span>
                                                <span style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    color: statusColor, fontWeight: '700', fontSize: '0.85rem',
                                                    textTransform: 'uppercase', background: status === 'correct' ? '#ecfdf5' : (status === 'wrong' ? '#fff1f2' : '#fffbeb'),
                                                    padding: '4px 10px', borderRadius: '20px'
                                                }}>
                                                    {statusIcon} {status}
                                                </span>
                                            </div>

                                            <div style={{ marginBottom: '1.5rem', fontFamily: 'Merriweather, serif', color: '#334155', fontSize: '1.1rem', lineHeight: '1.7' }} dangerouslySetInnerHTML={{ __html: q.text }} />

                                            {status !== 'correct' && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', marginTop: '1.5rem', fontSize: '0.95rem' }}>
                                                    <div style={{ padding: '1rem', background: '#fff1f2', borderLeft: '3px solid #f43f5e', borderRadius: '0 4px 4px 0', color: '#be123c' }}>
                                                        <strong style={{ display: 'block', fontSize: '0.7rem', marginBottom: '6px', opacity: 0.8, textTransform: 'uppercase' }}>Your Answer</strong>
                                                        {userVal}
                                                    </div>
                                                    <div style={{ padding: '1rem', background: '#ecfdf5', borderLeft: '3px solid #10b981', borderRadius: '0 4px 4px 0', color: '#047857' }}>
                                                        <strong style={{ display: 'block', fontSize: '0.7rem', marginBottom: '6px', opacity: 0.8, textTransform: 'uppercase' }}>Correct Answer</strong>
                                                        {q.correctAnswer}
                                                    </div>
                                                </div>
                                            )}

                                            {status === 'correct' && (
                                                <div style={{ padding: '1rem', background: '#ecfdf5', borderLeft: '3px solid #10b981', borderRadius: '0 4px 4px 0', color: '#047857', fontSize: '0.95rem' }}>
                                                    <strong style={{ display: 'block', fontSize: '0.7rem', marginBottom: '6px', opacity: 0.8, textTransform: 'uppercase' }}>Correct Answer</strong>
                                                    {q.correctAnswer}
                                                </div>
                                            )}

                                            {q.solution && status !== 'correct' && (
                                                <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                                    <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                                        <BookOpen size={14} /> Explanation
                                                    </strong>
                                                    <div style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#475569' }} dangerouslySetInnerHTML={{ __html: q.solution }} />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="high-actions" style={{ justifyContent: 'center', marginTop: '4rem' }}>
                            <Link to="/math" className="high-btn primary">Back to Topics</Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="high-practice-page">
            <div className="high-practice-layout">
                {/* Sidebar */}
                <aside className="high-sidebar">
                    <div className="high-logo">
                        <BookOpen size={24} />
                        <span>Skill100</span>
                    </div>

                    <div>
                        <span className="high-palette-label">Question Palette</span>
                        <div className="high-palette-grid">
                            {questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`high-palette-item ${getQuestionStatus(idx)}`}
                                    onClick={() => setCurrentIndex(idx)}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>
                    </div>

                    <Link to="/math" className="high-exit-btn">Exit Session</Link>
                </aside>

                {/* Main Content */}
                <main className="high-main-content">
                    <div className="high-header">
                        <div className="high-title-group">
                            <h1>{skillName}</h1>
                            <div className="high-subtitle">
                                <span className="high-badge">Practice Mode</span>
                            </div>
                        </div>
                        <div className="high-subtitle">
                            <Clock size={16} />
                            {formatTime(elapsedTime)}
                        </div>
                    </div>

                    <div className="question-card">
                        <div className="question-meta">
                            Question {currentIndex + 1} of {questions.length}
                        </div>

                        <div className="question-content">
                            {currentQ?.text && (
                                <div className="question-text" dangerouslySetInnerHTML={{ __html: currentQ.text }} />
                            )}
                            {currentQ?.imageUrl && (
                                <img src={currentQ.imageUrl} alt="Question" style={{ maxWidth: '100%', marginBottom: '2rem', borderRadius: '4px' }} />
                            )}
                        </div>

                        <div className="high-options-grid">
                            {currentQ?.options?.map((opt, idx) => {
                                const isSelected = userAnswer === opt;
                                let btnClass = `high-option-btn ${isSelected ? 'selected' : ''}`;

                                if (feedback) {
                                    if (opt === currentQ.correctAnswer) btnClass += ' correct';
                                    else if (isSelected && feedback === 'incorrect') btnClass += ' wrong';
                                }

                                return (
                                    <button
                                        key={idx}
                                        className={btnClass}
                                        onClick={() => !feedback && setUserAnswer(opt)}
                                        disabled={!!feedback}
                                    >
                                        <span className="high-key">{String.fromCharCode(65 + idx)}.</span>
                                        <span>{opt}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {currentQ?.type === 'input' && (
                            <input
                                type="text"
                                className="high-text-input"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Enter answer here..."
                                disabled={!!feedback}
                            />
                        )}

                        {feedback && (
                            <div className="high-feedback-row">
                                <span className={`high-feedback-msg ${feedback}`}>
                                    {feedback === 'correct' ? 'Correct Answer' : 'Incorrect Answer'}
                                </span>
                                {feedback === 'incorrect' && (
                                    <span style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                        Correct: {currentQ.correctAnswer}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="high-actions">
                            {!feedback ? (
                                <>
                                    <button className="high-btn secondary" onClick={handleSkip}>Skip</button>
                                    <button className="high-btn primary" onClick={handleCheck} disabled={!userAnswer}>Submit</button>
                                </>
                            ) : (
                                <button className="high-btn primary" onClick={handleNextStep}>Next Question</button>
                            )}
                        </div>
                    </div>
                </main>

                {/* Tools Column */}
                <aside className="high-tools-col">
                    <div className="high-notebook">
                        <div className="high-notebook-header">Scratchpad</div>
                        <div style={{ flex: 1, position: 'relative' }}>
                            <Whiteboard isOpen={true} />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HighPracticeSession;
