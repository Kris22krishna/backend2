import { motion, AnimatePresence } from "motion/react";
import { useNavigate, useParams } from "react-router";
import { PageWrapper } from "../components/PageWrapper";
import { Home, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import mascotStanding from "figma:asset/0a112212701e9977806405dd46a16d44e3e7fa0d.png";
import mascotFlying from "figma:asset/30756ca85f4fc28f675b411b03a3b94194c56d13.png";

interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
  icon?: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is 2 + 3?",
    answers: ["4", "5", "6", "7"],
    correctAnswer: 1,
    icon: "➕"
  },
  {
    id: 2,
    question: "How many sides does a triangle have?",
    answers: ["2", "3", "4", "5"],
    correctAnswer: 1,
    icon: "🔺"
  },
  {
    id: 3,
    question: "What comes after 7?",
    answers: ["6", "7", "8", "9"],
    correctAnswer: 2,
    icon: "🔢"
  }
];

export default function PracticePage() {
  const { subSkillId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [mascotAnimation, setMascotAnimation] = useState("idle");
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: number}>({});

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const isComplete = currentQuestion >= questions.length;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !isComplete) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isComplete]);

  useEffect(() => {
    // Reset mascot animation when question changes
    setMascotAnimation("point");
    const timer = setTimeout(() => setMascotAnimation("idle"), 2000);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  useEffect(() => {
    // Check if the current question has already been answered
    const answeredIndex = answeredQuestions[question.id];
    if (answeredIndex !== undefined) {
      setSelectedAnswer(answeredIndex);
      setShowResult(true);
    } else {
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQuestion, answeredQuestions, question.id]);

  const handleAnswerClick = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === question.correctAnswer) {
      setScore(score + 1);
      setMascotAnimation("celebrate");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setMascotAnimation("encourage");
    }

    // Record the answer
    setAnsweredQuestions(prev => ({
      ...prev,
      [question.id]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setMascotAnimation("idle");
    } else {
      // Quiz complete
      setCurrentQuestion(questions.length);
      setIsTimerRunning(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setMascotAnimation("idle");
    }
  };

  const handleQuestionSelect = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setMascotAnimation("idle");
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setMascotAnimation("idle");
    setTimeElapsed(0);
    setIsTimerRunning(true);
    setAnsweredQuestions({});
  };

  if (isComplete) {
    return (
      <PageWrapper background="lavender">
        <div className="container mx-auto px-8 py-12 min-h-screen flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
            className="bg-white rounded-[3rem] p-12 shadow-2xl border-8 border-white/50 max-w-2xl text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
              className="text-9xl mb-8"
            >
              🎉
            </motion.div>
            <h1 className="text-5xl font-bold text-[#2C3E50] mb-6">
              Amazing Work!
            </h1>
            <p className="text-3xl text-[#2C3E50] mb-8">
              You got <span className="text-green-500 font-bold">{score}</span> out of{" "}
              <span className="font-bold">{questions.length}</span> correct!
            </p>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
              className="mb-8 px-8 py-4 bg-gradient-sky rounded-full inline-block"
            >
              <p className="text-2xl font-bold text-white">
                ⏱️ Time: {formatTime(timeElapsed)}
              </p>
            </motion.div>

            <div className="flex gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetQuiz}
                className="px-10 py-5 bg-gradient-yellow rounded-full text-[#2C3E50] font-bold text-2xl shadow-xl btn-3d"
              >
                Try Again 🔄
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="px-10 py-5 bg-gradient-sky rounded-full text-white font-bold text-2xl shadow-xl btn-3d"
              >
                Choose Another ✨
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Celebrating Mascot */}
        <motion.div
          className="fixed right-8 bottom-8 w-40 h-40"
          animate={{
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
        >
          <img src={mascotFlying} alt="Mascot" className="w-full h-full object-contain drop-shadow-2xl" />
        </motion.div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper background="peach">
      <div className="container mx-auto px-8 py-8 min-h-screen">
        {/* Header with Back Button, Timer, and Score */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg text-[#2C3E50] font-bold text-lg btn-3d"
          >
            <Home className="w-6 h-6" />
            Back
          </motion.button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.6 }}
            className="px-8 py-4 bg-white rounded-full shadow-lg"
          >
            <p className="text-2xl font-bold text-[#2C3E50]">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <motion.div
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.6 }}
              className="relative"
            >
              {/* Sun Timer */}
              <div className="relative flex items-center justify-center">
                {/* Sun rays (outer circle) */}
                <div className="absolute w-24 h-24">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-400 rounded-full"
                      style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'center',
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-14px)`
                      }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </div>

                {/* Sun center with time */}
                <motion.div
                  className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 shadow-2xl border-4 border-yellow-200 flex items-center justify-center z-10"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 230, 109, 0.6), 0 0 40px rgba(255, 230, 109, 0.3)",
                      "0 0 30px rgba(255, 230, 109, 0.8), 0 0 60px rgba(255, 230, 109, 0.5)",
                      "0 0 20px rgba(255, 230, 109, 0.6), 0 0 40px rgba(255, 230, 109, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-white drop-shadow-md leading-tight">
                      {formatTime(timeElapsed)}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Score */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-8 py-4 bg-gradient-yellow rounded-full shadow-lg"
            >
              <p className="text-2xl font-bold text-[#2C3E50]">
                Score: {score} 🌟
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-5xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              {/* Question Area with Mascot and Speech Bubble */}
              <div className="flex items-start gap-8 mb-16">
                {/* Mascot */}
                <motion.div
                  className="w-48 h-48 flex-shrink-0"
                  animate={{
                    y: mascotAnimation === "idle" ? [0, -10, 0] : undefined,
                    rotate: mascotAnimation === "celebrate" ? [0, 10, -10, 10, 0] : mascotAnimation === "point" ? [0, 5, 0] : undefined,
                    scale: mascotAnimation === "celebrate" ? [1, 1.1, 1] : undefined
                  }}
                  transition={{
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 0.5, repeat: mascotAnimation === "celebrate" ? 3 : 2 },
                    scale: { duration: 0.5, repeat: mascotAnimation === "celebrate" ? 3 : 0 }
                  }}
                >
                  <img
                    src={mascotAnimation === "celebrate" || mascotAnimation === "point" ? mascotFlying : mascotStanding}
                    alt="Learning Buddy"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Speech Bubble with Question */}
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  className="flex-1 relative"
                >
                  <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-4 border-[#87CEEB] relative">
                    {/* Question Icon */}
                    {question.icon && (
                      <div className="text-6xl mb-6 text-center">
                        {question.icon}
                      </div>
                    )}
                    
                    {/* Question Text */}
                    <p className="text-4xl font-bold text-[#2C3E50] text-center">
                      {question.question}
                    </p>

                    {/* Speech bubble tail */}
                    <div 
                      className="absolute -left-8 top-1/2 -translate-y-1/2 w-0 h-0"
                      style={{
                        borderTop: "20px solid transparent",
                        borderBottom: "20px solid transparent",
                        borderRight: "30px solid white"
                      }}
                    />
                  </div>
                </motion.div>
              </div>

              {/* Answer Buttons */}
              <div className="grid grid-cols-2 gap-6 max-w-3xl mx-auto">
                {question.answers.map((answer, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrectAnswer = index === question.correctAnswer;
                  const showCorrect = showResult && isCorrectAnswer;
                  const showWrong = showResult && isSelected && !isCorrect;

                  return (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.4 + index * 0.1,
                        type: "spring",
                        bounce: 0.6
                      }}
                      whileHover={!showResult ? { 
                        scale: 1.08, 
                        y: -8,
                        rotate: Math.random() > 0.5 ? 2 : -2
                      } : {}}
                      whileTap={!showResult ? { scale: 0.95 } : {}}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showResult}
                      className={`relative px-10 py-8 rounded-[2rem] font-bold text-3xl shadow-xl border-4 transition-all ${
                        showCorrect
                          ? "bg-green-400 border-green-500 text-white"
                          : showWrong
                          ? "bg-red-400 border-red-500 text-white animate-shake"
                          : "bg-white border-[#87CEEB] text-[#2C3E50] btn-3d"
                      }`}
                      style={{
                        boxShadow: isSelected && !showResult
                          ? "0 0 30px rgba(135, 206, 235, 0.6)"
                          : undefined
                      }}
                    >
                      {/* Answer letter badge */}
                      <div 
                        className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg ${
                          showCorrect ? "bg-green-500 text-white" : showWrong ? "bg-red-500 text-white" : "bg-[#FFE66D] text-[#2C3E50]"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>

                      {answer}

                      {/* Checkmark or X */}
                      {showCorrect && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-3 -right-3 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-xl"
                        >
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.div>
                      )}
                      {showWrong && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="absolute -top-3 -right-3 w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-xl"
                        >
                          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Next Button (appears after answering) */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNextQuestion}
                    className="px-16 py-6 bg-gradient-sky rounded-full text-white font-bold text-3xl shadow-2xl btn-3d"
                  >
                    {currentQuestion < questions.length - 1 ? "Next Question →" : "See Results! 🎉"}
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 1,
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 100,
                  rotate: 360,
                  opacity: 0
                }}
                transition={{
                  duration: 2 + Math.random(),
                  ease: "easeOut"
                }}
                className="absolute w-4 h-4 rounded-full"
                style={{
                  backgroundColor: ["#FFE66D", "#87CEEB", "#FFB6B9", "#98D8C8", "#C9A9E9"][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}

        {/* Encouraging Message */}
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.6 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 px-8 py-4 bg-white rounded-full shadow-2xl border-4 border-[#87CEEB] z-40"
          >
            <p className="text-2xl font-bold text-[#2C3E50]">
              {isCorrect ? "🎉 Awesome! You got it right!" : "💪 Good try! Keep going!"}
            </p>
          </motion.div>
        )}

        {/* Question Navigator - Fixed at Bottom */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center gap-4 bg-white/95 backdrop-blur-sm px-6 py-4 rounded-full shadow-2xl border-4 border-[#87CEEB] z-30"
        >
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-all ${
              currentQuestion === 0
                ? "bg-gray-300 border-gray-400 opacity-50 cursor-not-allowed"
                : "bg-gradient-mint border-[#98D8C8] btn-3d cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </motion.button>

          {/* Question Selector Pills */}
          <div className="flex gap-3">
            {questions.map((q, index) => {
              const isAnswered = answeredQuestions[q.id] !== undefined;
              const isCurrentQuestion = index === currentQuestion;
              const wasCorrect = isAnswered && answeredQuestions[q.id] === q.correctAnswer;

              return (
                <motion.button
                  key={q.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, type: "spring", bounce: 0.6 }}
                  whileHover={{ scale: 1.2, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleQuestionSelect(index)}
                  className={`relative w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl shadow-lg border-4 transition-all ${
                    isCurrentQuestion
                      ? "bg-gradient-sky border-[#87CEEB] text-white scale-110 ring-4 ring-[#87CEEB]/30"
                      : isAnswered && wasCorrect
                      ? "bg-green-400 border-green-500 text-white"
                      : isAnswered && !wasCorrect
                      ? "bg-red-400 border-red-500 text-white"
                      : "bg-white border-[#FFE66D] text-[#2C3E50] btn-3d"
                  }`}
                >
                  {index + 1}
                  {isAnswered && !isCurrentQuestion && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center">
                      {wasCorrect ? (
                        <svg className="w-5 h-5 text-green-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-red-600 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: 3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                handleQuestionSelect(currentQuestion + 1);
              }
            }}
            disabled={currentQuestion === questions.length - 1}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 transition-all ${
              currentQuestion === questions.length - 1
                ? "bg-gray-300 border-gray-400 opacity-50 cursor-not-allowed"
                : "bg-gradient-mint border-[#98D8C8] btn-3d cursor-pointer"
            }`}
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </motion.button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}