import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Flag, Star, ChevronLeft, ChevronRight, Sun } from 'lucide-react';

export const AdventureMapHeader: React.FC = () => {
  const { questions, currentQuestionIndex, setCurrentQuestionIndex, answers, reviewList, toggleReview } = useApp();
  const currentQ = questions[currentQuestionIndex];
  const isMarked = reviewList.has(currentQ.id);

  // Pagination State
  const ITEMS_PER_PAGE = 10;
  // Initialize page based on currentQuestionIndex
  const [page, setPage] = useState(Math.floor(currentQuestionIndex / ITEMS_PER_PAGE));

  // Sync page when current question changes externally
  useEffect(() => {
    setPage(Math.floor(currentQuestionIndex / ITEMS_PER_PAGE));
  }, [currentQuestionIndex]);

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIdx = page * ITEMS_PER_PAGE;
  // Ensure we only take 10 items
  const visibleQuestions = questions.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <div className="w-full bg-white/60 backdrop-blur-md border-b-4 border-[#A8FBD3] flex items-center justify-between px-4 py-3 gap-4 shadow-sm z-30 relative shrink-0">
      
      {/* 1. Timer (Sun Badge) */}
      <div className="hidden md:flex items-center justify-center relative w-16 h-16 mx-2">
         {/* Rotating Rays */}
         <div className="absolute inset-0 animate-[spin-slow_10s_linear_infinite]">
             {[...Array(12)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute w-2 h-3 bg-orange-300 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ transform: `rotate(${i * 30}deg) translateY(-36px)` }}
                ></div>
             ))}
         </div>
         
         {/* Static Sun Body & Text */}
         <div className="relative z-10 w-16 h-16 bg-yellow-300 rounded-full border-4 border-orange-300 shadow-[0_0_20px_rgba(253,224,71,0.6)] flex items-center justify-center">
             <div className="absolute inset-0 border-2 border-dashed border-orange-400 rounded-full opacity-50 animate-[spin_20s_linear_infinite]"></div>
             <span className="font-black text-orange-600 text-sm z-20">15:00</span>
         </div>
      </div>

      {/* 2. Paginator Controls + Tracker (Center) */}
      <div className="flex-1 flex items-center justify-center gap-2 md:gap-6 overflow-hidden relative">
          
          {/* Prev Button */}
          <button 
            onClick={handlePrevPage}
            disabled={page === 0}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
              ${page === 0 
                ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                : 'border-[#4FB7B3] text-[#4FB7B3] bg-white hover:bg-[#4FB7B3] hover:text-white hover:scale-105 active:scale-95 shadow-sm'}
            `}
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </button>

          {/* Question Circles Container */}
          <div className="flex items-center justify-center gap-2 md:gap-4 px-2">
              {visibleQuestions.map((q, localIdx) => {
                  const realIdx = startIdx + localIdx;
                  const isCurrent = realIdx === currentQuestionIndex;
                  const isAnswered = !!answers[q.id];
                  const isFlagged = reviewList.has(q.id);

                  // Styles based on state
                  let buttonStyle = "bg-white border-2 border-[#A8FBD3] text-[#4FB7B3] hover:scale-105"; // Default Unanswered
                  
                  if (isCurrent) {
                    buttonStyle = "bg-gradient-to-b from-blue-400 to-blue-500 border-4 border-blue-200 text-white shadow-[0_4px_0_#2563EB] scale-110 -translate-y-1"; // Current: 3D Blue Button
                  } else if (isAnswered) {
                    buttonStyle = "bg-[#4FB7B3] border-[#4FB7B3] text-white shadow-sm"; // Answered: Teal filled
                  }

                  return (
                  <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(realIdx)}
                      className={`relative w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-300 group ${buttonStyle}`}
                  >
                      {realIdx + 1}
                      
                      {/* Flag Indicator */}
                      {isFlagged && (
                        <div className="absolute -top-1 -right-1 bg-[#637AB9] text-white rounded-full p-1 shadow-md border-2 border-white">
                            <Flag size={10} fill="white" />
                        </div>
                      )}
                  </button>
                  );
              })}
          </div>

          {/* Next Button */}
          <button 
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
              ${page === totalPages - 1 
                ? 'border-slate-200 text-slate-300 cursor-not-allowed' 
                : 'border-[#4FB7B3] text-[#4FB7B3] bg-white hover:bg-[#4FB7B3] hover:text-white hover:scale-105 active:scale-95 shadow-sm'}
            `}
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>

      </div>

      {/* 3. Mark for Review (Desktop - redundant with flag on cloud, but good for completeness in header if needed, but prompt says flag is on cloud) */}
      <div className="hidden md:block w-32"></div> 
    </div>
  );
};
