import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import mascotImg from 'figma:asset/4a6128b1ee9c443467e5f01abb788bd21fb8bf81.png';
import { RotateCcw, Flag, Sparkles } from 'lucide-react';
import { useApp } from '../store';

interface QuestionRendererProps {
  question: Question;
  questionNumber: number;
  selectedAnswer: string | undefined;
  onAnswer: (answer: string) => void;
  gradeLevel: '1-4' | '5-8' | '9-12';
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, questionNumber, selectedAnswer, onAnswer, gradeLevel }) => {
  const { setAnswer, reviewList, toggleReview } = useApp();
  const [showSolution, setShowSolution] = useState(false);
  const [shake, setShake] = useState(false);

  // Reset solution view when question changes
  useEffect(() => {
    setShowSolution(false);
    setShake(false);
  }, [question.id]);

  const handleAnswer = (option: string) => {
    // Grade 1-4 logic (now default)
    const isCorrect = option === question.correctAnswer;
    if (!isCorrect) {
        setShake(true);
        setTimeout(() => setShake(false), 500); 
    }
    onAnswer(option);
  };

  const handleClear = () => {
    setAnswer(question.id, undefined);
  };

  const isMarked = reviewList.has(question.id);

  // --- GRADE 1-4 MASCOT THOUGHT CLOUD LAYOUT ---
  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-2 relative overflow-hidden">
        
        {/* Mascot (Left Side) */}
        <div className={`hidden md:flex flex-col items-center justify-end shrink-0 relative z-20 mr-[-50px] mb-[-40px] transition-transform duration-300 ${shake ? 'animate-shake' : 'animate-[float_6s_ease-in-out_infinite]'}`}>
             <ImageWithFallback 
                src={mascotImg} 
                alt="Learning Mascot" 
                className="w-40 lg:w-56 h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.15)]"
             />
        </div>

        {/* Thought Cloud Container */}
        <div className="flex-1 w-full max-w-6xl h-full flex flex-col relative z-10 pl-2 md:pl-16 py-2">
            
            {/* Cloud Tail (SVG) */}
            <svg className="absolute left-4 bottom-20 w-16 h-16 md:w-20 md:h-20 text-white z-20 hidden md:block transform -scale-x-100 drop-shadow-md" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M100 0 C 80 40, 20 80, 0 100 C 40 80, 80 20, 100 0 Z" fill="currentColor" />
            </svg>

            {/* The Cloud Body - Fixed Height / No Scroll - MORE VIBRANT */}
            <div className={`w-full h-full bg-gradient-to-br from-white to-slate-50 rounded-[2rem] md:rounded-[3rem] shadow-[0_10px_40px_rgba(79,183,179,0.2)] border-8 border-white flex flex-col overflow-hidden relative transition-all duration-300
                ${shake ? 'translate-x-[-10px]' : ''}
            `}>
                
                {/* Mark for Review Flag */}
                <div className="absolute top-0 right-6 md:right-10 z-30 flex flex-col items-center">
                    <button 
                        onClick={() => toggleReview(question.id)}
                        className={`w-12 h-14 md:w-14 md:h-16 rounded-b-2xl flex flex-col items-center justify-end pb-3 shadow-[0_4px_10px_rgba(0,0,0,0.1)] transition-all border-x-2 border-b-2 border-black/5 relative z-20
                            ${isMarked ? 'bg-[#4300FF] text-white top-0' : 'bg-white text-slate-300 -top-2 hover:top-0'}
                        `}
                        title="Mark for Review"
                    >
                        <Flag size={24} strokeWidth={3} fill={isMarked ? "currentColor" : "none"} />
                    </button>
                    
                    {/* Visible Instruction Bubble - Hides when marked */}
                    {!isMarked && (
                        <div className="absolute top-0 right-full mr-3 w-max max-w-[100px] bg-white text-[#4300FF] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm text-center z-10 pointer-events-none flex items-center justify-center border border-[#4300FF]/10 opacity-80">
                            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-white transform rotate-45 -translate-y-1/2 border-t border-r border-[#4300FF]/10"></div>
                            Review later?
                        </div>
                    )}
                </div>

                {/* Main Content - Flex Column No Scroll */}
                <div className="w-full h-full p-4 md:p-6 flex flex-col items-center text-center">
                    
                    {/* Header Section: Question Number & Text */}
                    <div className="shrink-0 w-full flex flex-col items-center mb-2 md:mb-4 px-10 md:px-24">
                        <h2 className="md:text-2xl lg:text-3xl font-black text-[#31326F] leading-snug line-clamp-3 drop-shadow-sm text-[20px]">
                            <span className="text-[#00CAFF] mr-2 drop-shadow-none inline-block transform -rotate-6">{questionNumber}.</span>
                            {question.text}
                        </h2>
                    </div>

                    {/* Middle Content: FLEX COLUMN ALWAYS for G1-4 Image Layout */}
                    <div className="flex-1 w-full min-h-0 flex flex-col items-center justify-center gap-4 relative">
                        
                        {question.imageUrl && (
                            <div className="shrink-1 min-h-0 relative flex justify-center items-center w-full flex-grow max-h-[50%]">
                                <div className="relative p-2 bg-white rounded-3xl shadow-[0_0_20px_rgba(0,202,255,0.3)] border-4 border-[#00CAFF] h-full w-auto aspect-square flex items-center justify-center animate-pulse-slow">
                                    <ImageWithFallback 
                                        src={question.imageUrl} 
                                        alt="Visual" 
                                        className="max-h-full max-w-full object-contain rounded-2xl"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Options Grid - 2x2 Grid BELOW image */}
                        {(question.type === 'MCQ' || (question.type === 'IMAGE_BASED' && question.options)) ? (
                            <div className={`w-full max-w-2xl grid gap-3 md:gap-4 min-h-0
                                ${question.imageUrl ? 'grid-cols-2 flex-grow-0' : 'grid-cols-1 md:grid-cols-2 flex-1'}
                            `}>
                                {question.options?.map((option, idx) => {
                                    const isSelected = selectedAnswer === option;
                                    const isCorrect = option === question.correctAnswer;
                                    const showCorrectness = isSelected && isCorrect;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(option)}
                                            className={`relative w-full h-full min-h-[60px] p-2 md:p-4 rounded-2xl border-[3px] transition-all flex items-center justify-center group shadow-[0_4px_0_#E2E8F0] active:shadow-none active:translate-y-[4px]
                                                ${isSelected 
                                                    ? 'bg-gradient-to-b from-[#00CAFF] to-[#0065F8] border-[#0065F8] text-white shadow-[0_6px_0_#0047AB] scale-[1.02]' 
                                                    : 'bg-white border-[#E0F7FA] text-[#31326F] hover:border-[#4FB7B3] hover:bg-[#F0FDF4]'}
                                            `}
                                        >
                                            <span className="relative z-10 text-lg md:text-xl font-extrabold line-clamp-2">{option}</span>
                                            {showCorrectness && (
                                                <div className="absolute top-1 right-1 animate-spin-slow">
                                                    <Sparkles className="text-yellow-300 drop-shadow-md" size={24} fill="currentColor" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                        
                        {/* Input Field */}
                        {question.type === 'INPUT' && (
                            <div className="w-full max-w-lg mx-auto flex-1 flex items-center justify-center">
                                <input
                                    type="text"
                                    value={selectedAnswer || ''}
                                    onChange={(e) => onAnswer(e.target.value)}
                                    placeholder={question.placeholder}
                                    className="w-full p-4 md:p-6 text-2xl md:text-3xl rounded-3xl border-4 border-[#A8FBD3] text-center font-black text-[#31326F] focus:border-[#4300FF] focus:outline-none placeholder-slate-300 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] bg-[#F8FDFF]"
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer: Clear Button (Playful Tile) */}
                    <div className="shrink-0 mt-2 h-12 flex items-center justify-center">
                            {selectedAnswer && (
                            <button 
                                onClick={handleClear}
                                className="hidden"
                            >
                                <RotateCcw size={18} strokeWidth={3} />
                                <span>START OVER</span>
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};
