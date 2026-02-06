import React from 'react';
import { useApp } from '../store';
import { ChevronRight, ChevronLeft, RotateCcw, Package } from 'lucide-react';

export const BottomBar: React.FC = () => {
  const { gradeLevel, currentQuestionIndex, questions, setCurrentQuestionIndex, setAnswer, setIsDrawingOpen } = useApp();
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleClear = () => {
    setAnswer(questions[currentQuestionIndex].id, '');
  };

  const isLast = currentQuestionIndex === questions.length - 1;
  const isFirst = currentQuestionIndex === 0;

  // --- GRADE 1-4 ADVENTURE ---
  if (gradeLevel === '1-4') {
    return (
      <div className="h-24 bg-white/90 backdrop-blur border-t-4 border-[#A8FBD3] px-4 md:px-8 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 relative">
        
        {/* Finish / Treasure Button (Left Side) */}
        {isLast ? (
            <button 
                className="flex flex-col items-center justify-center gap-1 group transition-transform hover:scale-105"
                title="Finish Adventure"
            >
                <div className="w-14 h-14 bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-2xl border-4 border-yellow-600 shadow-lg flex items-center justify-center animate-bounce">
                    <Package size={32} className="text-yellow-900" />
                </div>
                <span className="text-xs font-black text-yellow-600 uppercase tracking-widest">Finish</span>
            </button>
        ) : (
            // Placeholder or maybe Drawing Board Trigger on Left?
             <button 
             onClick={() => setIsDrawingOpen(true)}
             className="px-6 py-3 bg-[#637AB9] text-white rounded-2xl font-bold hover:bg-[#31326F] transition-transform active:scale-95 shadow-lg shadow-blue-200 flex items-center gap-2"
           >
             <span>Magic Pad</span>
             <span className="text-xl">✏️</span>
           </button>
        )}

        {/* Navigation Arrows (Right Side) */}
        <div className="flex items-center gap-4 md:gap-6">
           
           {!isLast && !isFirst && (
                <button 
                onClick={handleClear}
                className="hidden md:flex px-6 py-3 bg-[#E0F7FA] text-[#4FB7B3] rounded-2xl font-bold hover:bg-[#A8FBD3] hover:text-[#31326F] transition-transform active:scale-95 shadow-md items-center gap-2"
                >
                <RotateCcw size={20} strokeWidth={3} />
                <span>Start Over</span>
                </button>
           )}

           <button 
             disabled={isFirst}
             onClick={handlePrev}
             className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white border-4 border-[#A8FBD3] flex items-center justify-center text-[#4FB7B3] disabled:opacity-30 hover:bg-[#A8FBD3] hover:text-[#31326F] hover:scale-110 active:scale-95 transition-all font-bold shadow-sm"
           >
             <ChevronLeft size={32} strokeWidth={3} />
           </button>

           <button 
             onClick={handleNext}
             disabled={isLast}
             className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#0065F8] border-4 border-[#4300FF] flex items-center justify-center text-white disabled:opacity-50 disabled:grayscale hover:bg-[#4300FF] hover:scale-110 active:scale-95 transition-all shadow-xl shadow-blue-200"
           >
             <ChevronRight size={40} strokeWidth={4} />
           </button>
        </div>
      </div>
    );
  }

  // --- GRADE 5-8 MISSION ---
  if (gradeLevel === '5-8') {
    return (
      <div className="h-20 bg-[#31326F] border-t border-[#4300FF] px-8 flex items-center justify-between z-10">
        <button 
          onClick={handleClear}
          className="text-[#637AB9] hover:text-white text-xs uppercase tracking-widest font-mono"
        >
          [ RESET_DATA ]
        </button>

        <div className="flex gap-4">
            <button 
                onClick={handlePrev}
                disabled={isFirst}
                className="px-6 py-2 rounded border border-[#637AB9] text-[#A8FBD3] font-mono hover:bg-[#637AB9]/20 disabled:opacity-30 uppercase text-sm tracking-wider"
            >
                {'< PREV'}
            </button>
            
            <button 
             onClick={() => setIsDrawingOpen(true)}
             className="px-4 py-2 bg-[#0065F8] text-white rounded font-mono text-sm hover:bg-[#4300FF]"
           >
             NOTEPAD_TOOL
           </button>

            <button 
                onClick={handleNext}
                disabled={isLast}
                className="px-8 py-2 rounded bg-gradient-to-r from-[#00CAFF] to-[#0065F8] text-white font-bold font-mono tracking-widest hover:opacity-90 disabled:opacity-50 shadow-[0_0_15px_#0065F8]"
            >
                {isLast ? 'COMPLETE' : 'NEXT >'}
            </button>
        </div>
      </div>
    );
  }

  // --- GRADE 9-12 PROFESSIONAL ---
  const isExam = true; // Assuming 9-12 is always 'Pro' style for now
  return (
    <div className="h-14 px-4 flex items-center justify-between border-t z-10 bg-slate-100 border-slate-300">
      
      <button 
        onClick={handleClear}
        className="text-xs md:text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4"
      >
        Clear Answer
      </button>

      <div className="flex items-center gap-2 md:gap-3">
         <button 
            onClick={() => setIsDrawingOpen(true)}
            className="px-3 py-1.5 text-xs md:text-sm font-medium rounded border bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
         >
            Rough Work
         </button>

         <div className="h-5 w-px bg-slate-300 mx-1 md:mx-2"></div>

         <button 
            onClick={handlePrev}
            disabled={isFirst}
            className="px-3 py-1.5 text-xs md:text-sm rounded text-slate-700 hover:bg-slate-200 disabled:opacity-50 font-medium"
         >
            Previous
         </button>
         <button 
            onClick={handleNext}
            disabled={isLast}
            className="px-4 py-1.5 text-xs md:text-sm rounded text-white font-medium transition-colors bg-[#31326F] hover:bg-[#25265e]"
         >
            {isLast ? 'Finish' : 'Next'}
         </button>
      </div>
    </div>
  );
};
