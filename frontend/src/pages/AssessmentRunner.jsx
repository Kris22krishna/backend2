import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Menu, X, BookOpen, Grid, FileText } from 'lucide-react';
import { api } from '../services/api';
import MathRenderer from '../components/MathRenderer';
import Whiteboard from '../components/Whiteboard';
import logo from '../assets/logo.jpg';
import renderMathInElement from 'katex/dist/contrib/auto-render.mjs';
import 'katex/dist/katex.min.css';

const AssessmentRunner = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { session_id, questions, duration_minutes } = location.state || {};
    const questionRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    // ... existing state ...

    // Auto-render math in the question body whenever it changes
    useEffect(() => {
        if (questionRef.current && questions && questions[currentIndex]) {
            // Manual DOM update to prevent React from overwriting KaTeX changes on re-renders
            const q = questions[currentIndex];
            questionRef.current.innerHTML = q.question_html || '';

            // Render math on the content we just injected
            renderMathInElement(questionRef.current, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$$", right: "$$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ],
                throwOnError: false
            });
        }
    }, [currentIndex, questions]);

    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(duration_minutes ? duration_minutes * 60 : 30 * 60);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notepadMode, setNotepadMode] = useState('text'); // 'text' or 'draw'

    useEffect(() => {
        if (!questions || questions.length === 0) {
            navigate('/assessment-student-dashboard');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [questions, navigate]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAnswerChange = (val) => {
        setAnswers({
            ...answers,
            [questions[currentIndex].id]: val
        });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentIndex(index);
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        console.log("Submitting Assessment:", { session_id, answersCount: Object.keys(answers).length });

        if (!session_id) {
            alert("Error: Session ID is missing. Please restart the assessment.");
            setIsSubmitting(false);
            return;
        }

        try {
            // Ensure all answers are strings for Pydantic validation
            const formattedAnswers = {};
            Object.keys(answers).forEach(key => {
                formattedAnswers[key] = String(answers[key]);
            });

            await api.submitAssessment(session_id, formattedAnswers);
            setIsSubmitted(true);

            // Wait a bit then redirect
            setTimeout(() => {
                navigate('/assessment-access');
            }, 3000);
        } catch (error) {
            console.error("Submission failed:", error);
            alert(`Submission failed: ${error.message}`);
            setIsSubmitted(false); // Ensure it stays false
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Assessment Submitted!</h2>
                        <p className="text-gray-500 mt-2">Your answers have been securely recorded.</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600">
                        Redirecting to login page in a few seconds...
                    </div>
                    <button
                        onClick={() => navigate('/assessment-access')}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Return to Login Now
                    </button>
                </div>
            </div>
        );
    }



    if (!questions) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;

    const currentQuestion = questions[currentIndex];

    // Safety check: if currentQuestion is undefined, show error or loading
    if (!currentQuestion) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div>Question not found.</div></div>;

    const isLastQuestion = currentIndex === questions.length - 1;
    const progress = ((Object.keys(answers).length) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">

            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-8 shadow-sm z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 lg:hidden"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Skill100.AI" className="h-8 w-auto rounded-full" />
                        <span className="font-extrabold text-xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-green-500 hidden sm:inline">
                            Skill100.AI
                        </span>
                    </div>
                </div>

                <div className={`flex items-center gap-2 font-mono text-lg font-bold px-4 py-1.5 rounded-full border ${timeLeft < 300 ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                    <Clock className="h-4 w-4" />
                    {formatTime(timeLeft)}
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs text-gray-500 font-medium">Progress</span>
                        <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        Submit
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Question Palette Sidebar */}
                <aside
                    className={`fixed lg:static inset-y-0 left-0 z-10 w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:block overflow-y-auto flex flex-col`}
                    style={{ top: '64px', height: 'calc(100vh - 64px)' }}
                >
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Grid className="h-5 w-5 text-indigo-500" />
                            Question Palette
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">Navigate through questions</p>
                    </div>

                    <div className="p-6 grid grid-cols-5 gap-3 content-start flex-1 overflow-y-auto">
                        {questions.map((q, idx) => {
                            const isAnswered = answers[q.id];
                            const isCurrent = currentIndex === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        jumpToQuestion(idx);
                                        if (window.innerWidth < 1024) setSidebarOpen(false);
                                    }}
                                    className={`
                                        h-10 w-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all
                                        ${isCurrent
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-2 ring-offset-2 ring-indigo-600'
                                            : isAnswered
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                                        }
                                    `}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-indigo-600"></div> Current
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div> Answered
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200"></div> Not Visited
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    <div className="max-w-4xl mx-auto h-full flex flex-col">

                        {/* Question Card */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 overflow-hidden flex flex-col flex-1">

                            {/* Card Header: Topic & Difficulty */}
                            <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm">
                                        {currentIndex + 1}
                                    </span>
                                    <div>
                                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Question {currentIndex + 1}</h2>
                                        {currentQuestion.topic && (
                                            <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-base mt-0.5">
                                                <BookOpen className="h-4 w-4" />
                                                {currentQuestion.topic}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {currentQuestion.difficulty && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                                        ${currentQuestion.difficulty.toLowerCase().includes('hard') ? 'bg-red-50 text-red-600 border-red-100' :
                                            currentQuestion.difficulty.toLowerCase().includes('medium') ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-green-50 text-green-600 border-green-100'}`}>
                                        {currentQuestion.difficulty}
                                    </span>
                                )}
                            </div>

                            {/* Card Body: Question Content */}
                            <div className="p-8 md:p-10 flex-1 overflow-y-auto">
                                <div
                                    key={currentQuestion.id}
                                    ref={questionRef}
                                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-8"
                                >
                                    {/* Detect if HTML or just text. If simple text with $$, use renderer. If HTML, we might need a different approach but usually it's text wrapped in <p> */}
                                    {/* For now, let's try to use MathRenderer on the raw HTML string if it's simple, or just replace the dangerouslySetInnerHTML */}
                                    {/* Actually, the backend sends HTML. Let's parse it or just render it. 
                                        If the user says "numbers are not in katex", it means the backend generated `$$` in the HTML.
                                        We can't easily put React components inside dangerouslySetInnerHTML. 
                                        However, we can render the text using MathRenderer if we strip tags, OR we can use a library to parse HTML to React.
                                        Given the constraint, let's assume the question text is simple enough or we treat it as text for the renderer if possible. 
                                        
                                        Better approach for now: The backend logic generates simple strings often wrapped in simple tags. 
                                        Let's try to render the options first as that's the main complaint in the screenshot (options showing $$).
                                        For the main question, if it's complex HTML, `MathRenderer` won't work inside `dangerouslySetInnerHTML`.
                                        We will swap the Options rendering first.
                                    */}
                                    {/* Content managed by useEffect to avoid React reconciliation conflicts */}

                                    {/* Note: If the question body also has $$, we need to fix that too. But per screenshot, the options are the big issue. 
                                    The screenshot shows the question body also has `$$ 8.44 $$`.
                                    
                                    To fix the question body locally:
                                    Instead of dangerouslySetInnerHTML, we should ideally use a parser. 
                                    But as a quick fix, we can try to render it as MathRenderer text if it doesn't contain complex HTML tags other than <p>.
                                    
                                    Let's stick to fixing formatting for the OPTIONS first, as that's explicitly shown.
                                    For the question body, we can try to just use MathRenderer on the plain text version if we can extract it, or leave it for now if complex.
                                    Actually, looking at the code, `question_html` is often just text or simple markdown converted.
                                    Let's try to replace the whole `dangerouslySetInnerHTML` with `<MathRenderer text={currentQuestion.question_html.replace(/<[^>]*>?/gm, '')} />` 
                                    if we assume it's text. 
                                    
                                    Wait, the backend generates HTML. If we stripped tags we lose structure.
                                    The correct way is using `html-react-parser` or similar, but I can't check/install that easily without risk.
                                    
                                    Alternative: Post-process the DOM? No, that's messy.
                                    
                                    Let's just fix the OPTIONS for this step.
                                    */}
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Your Answer</h3>

                                    {(currentQuestion.question_type === 'mcq' || currentQuestion.question_type === 'MCQ') && currentQuestion.options ? (() => {
                                        let options = [];
                                        try {
                                            options = JSON.parse(currentQuestion.options);
                                            if (!Array.isArray(options)) options = [];
                                        } catch (e) {
                                            console.error("Invalid options JSON:", currentQuestion.options);
                                            options = [];
                                        }

                                        if (options.length === 0) return <div className="text-red-500 text-sm">Error loading options.</div>;

                                        return (
                                            <div className="grid grid-cols-1 gap-3">
                                                {options.map((opt, idx) => (
                                                    <label
                                                        key={idx}
                                                        className={`
                                                        group flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                        ${answers[currentQuestion.id] === opt
                                                                ? 'border-indigo-500 bg-indigo-50/50 shadow-sm'
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                            }
                                                    `}
                                                    >
                                                        <div className={`
                                                        w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                                        ${answers[currentQuestion.id] === opt ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 group-hover:border-gray-400'}
                                                    `}>
                                                            {answers[currentQuestion.id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                                        </div>
                                                        <input
                                                            type="radio"
                                                            name={`q-${currentQuestion.id}`}
                                                            value={opt}
                                                            checked={answers[currentQuestion.id] === opt}
                                                            onChange={() => handleAnswerChange(opt)}
                                                            className="hidden"
                                                        />
                                                        <span className={`text-base font-medium ${answers[currentQuestion.id] === opt ? 'text-indigo-900' : 'text-gray-700'}`}>
                                                            <MathRenderer text={opt} />
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        );
                                    })() : (
                                        <div className="relative">
                                            <input
                                                type="text"
                                                className="w-full p-6 text-xl border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm placeholder-gray-400 font-medium"
                                                placeholder="Enter your answer here..."
                                                value={answers[currentQuestion.id] || ''}
                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Card Footer: Navigation Buttons */}
                            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentIndex === 0}
                                    className={`
                                        flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all
                                        ${currentIndex === 0
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-900'
                                        }
                                    `}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                    Previous
                                </button>

                                {isLastQuestion ? (
                                    <button
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                                    >
                                        <CheckCircle className="h-5 w-5" />
                                        Complete & Submit
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-8 py-3 bg-white border border-gray-300 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md text-gray-700 rounded-xl font-bold transition-all group"
                                    >
                                        Next Question
                                        <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Notepad Sidebar (Right) */}
                <aside className="hidden xl:flex flex-col w-80 bg-white border-l border-gray-200 shadow-sm z-10">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-gray-500" />
                            <h3 className="font-bold text-gray-800">Notepad</h3>
                        </div>
                        {/* Toggle Tabs */}
                        <div className="flex bg-gray-200/60 p-1 rounded-lg">
                            <button
                                onClick={() => setNotepadMode('text')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${notepadMode === 'text' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Text
                            </button>
                            <button
                                onClick={() => setNotepadMode('draw')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${notepadMode === 'draw' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Draw
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative overflow-hidden bg-yellow-50/10">
                        {notepadMode === 'text' ? (
                            <div className="absolute inset-0 p-4 bg-yellow-50/30">
                                <textarea
                                    className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-gray-700 leading-relaxed font-mono text-sm"
                                    placeholder="Use this space for rough work..."
                                    spellCheck="false"
                                ></textarea>
                            </div>
                        ) : (
                            <div className="absolute inset-0">
                                <Whiteboard isOpen={true} />
                            </div>
                        )}
                    </div>

                    {notepadMode === 'text' && (
                        <div className="p-3 text-xs text-center text-gray-400 bg-white border-t border-gray-100">
                            Content is temporary
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default AssessmentRunner;
