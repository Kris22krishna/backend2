import React from 'react';
import { useApp } from '../store';
import { Check, Lock, MapPin, Star, Clock, Flag, PauseCircle } from 'lucide-react';

export const SidePanel: React.FC = () => {
  const { gradeLevel, questions, currentQuestionIndex, setCurrentQuestionIndex, answers, reviewList, toggleReview } = useApp();
  const currentQ = questions[currentQuestionIndex];
  const isMarked = reviewList.has(currentQ.id);

  // G1-4 Adventure Path (Handled by Header)
  if (gradeLevel === '1-4') {
    return null; 
  }

  // G5-8 Mission Nodes (Right Side)
  if (gradeLevel === '5-8') {
    return (
      <aside className="hidden md:flex flex-col w-72 h-full bg-[#1A1B4B] border-l border-[#4300FF] overflow-hidden z-20 shadow-2xl">
        <div className="p-4 bg-[#31326F] border-b border-[#4300FF] space-y-5">
           
           {/* Timer Section */}
           <div className="space-y-1">
              <div className="flex justify-between items-center text-[#4FB7B3] text-xs font-mono uppercase tracking-widest">
                  <span>Time Rem.</span>
                  <span className="text-white">45:00</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-sm overflow-hidden border border-slate-600 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4FB7B3] to-[#00CAFF] w-3/4 shadow-[0_0_10px_#00CAFF]"></div>
                  {/* Grid overlay */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
              </div>
           </div>

           {/* Priority Button */}
           <button 
              onClick={() => toggleReview(currentQ.id)}
              className={`w-full py-2.5 rounded-sm border font-mono text-xs uppercase tracking-wider transition-all
              ${isMarked 
                ? 'bg-[#0065F8] border-[#0065F8] text-white shadow-[0_0_15px_#0065F8]' 
                : 'bg-transparent border-[#637AB9] text-[#637AB9] hover:bg-[#637AB9]/20'}`}
            >
              {isMarked ? '★ PRIORITY HIGH' : '☆ MARK NODE'}
           </button>
        </div>
        
        <div className="p-3 bg-[#1A1B4B] border-b border-[#4300FF]/30">
           <h3 className="text-[#00FFDE] font-mono tracking-widest text-xs text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-[#00FFDE] rounded-full animate-pulse"></span>
              MISSION_LOG
           </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-4 gap-3 content-start">
           {questions.map((q, idx) => {
              const isCurrent = idx === currentQuestionIndex;
              const isAnswered = !!answers[q.id];
              const isFlagged = reviewList.has(q.id);

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`aspect-square rounded-sm border flex items-center justify-center relative transition-all group
                    ${isCurrent ? 'bg-[#0065F8] border-[#00CAFF] text-white shadow-[0_0_10px_#0065F8] scale-110 z-10' : ''}
                    ${!isCurrent && isAnswered ? 'bg-[#4FB7B3]/10 border-[#4FB7B3] text-[#4FB7B3]' : ''}
                    ${!isCurrent && !isAnswered ? 'bg-transparent border-[#637AB9]/30 text-[#637AB9]/50 hover:border-[#637AB9] hover:text-[#637AB9]' : ''}
                  `}
                >
                   <span className="font-mono text-sm font-bold">{idx + 1}</span>
                   {isFlagged && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse border border-[#1A1B4B]"></div>}
                </button>
              );
           })}
        </div>
        <div className="mt-auto p-4 border-t border-[#4300FF] bg-[#222358]">
            <button className="w-full py-3 bg-[#4300FF] hover:bg-[#5218FA] text-white font-mono text-sm tracking-widest border border-[#0065F8] uppercase shadow-lg transition-all hover:shadow-[0_0_20px_#4300FF]">
                Submit Mission
            </button>
        </div>
      </aside>
    );
  }

  // G9-12 Standard (Right Side)
  const isExam = gradeLevel === '9-12';
  return (
    <aside className={`hidden md:flex flex-col w-72 h-full border-l overflow-y-auto z-20 shadow-lg
        bg-slate-50 border-slate-300`}>
      
      {/* Header: Timer + Tools */}
      <div className={`p-4 border-b bg-white border-slate-300 space-y-4`}>
         
         {/* Timer */}
         <div className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
                <Clock size={18} className="text-slate-400" />
                <span className="font-variant-numeric tabular-nums font-bold text-lg">45:00</span>
            </div>
            {isExam && <span className="text-xs font-bold text-red-500 uppercase">Exam Mode</span>}
         </div>

         {/* Review Button */}
         <button 
            onClick={() => toggleReview(currentQ.id)}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded text-sm transition-colors border
            ${isMarked 
                ? 'bg-orange-50 text-orange-600 border-orange-200 font-semibold' 
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'}`}
        >
            <Flag size={16} className={isMarked ? 'fill-current' : ''} />
            {isMarked ? 'Marked for Review' : 'Mark for Review'}
        </button>
      </div>

      <div className="p-4 border-b border-slate-200">
        <h3 className={`font-semibold text-sm uppercase tracking-wide mb-3 text-slate-800`}>
            Question Palette
        </h3>
        <div className="flex gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-slate-300 rounded-sm"></div> Unanswered</div>
            <div className="flex items-center gap-1"><div className={`w-3 h-3 rounded-sm bg-slate-300`}></div> Answered</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-5 gap-2 content-start">
            {questions.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = !!answers[q.id];
                const isFlagged = reviewList.has(q.id);

                return (
                <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`aspect-square rounded flex flex-col items-center justify-center text-sm font-medium border relative
                    ${isCurrent 
                        ? 'bg-[#31326F] text-white border-[#31326F]'
                        : ''}
                    ${!isCurrent && isAnswered 
                        ? 'bg-slate-300 text-slate-700 border-slate-400' 
                        : ''}
                    ${!isCurrent && !isAnswered 
                        ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50' 
                        : ''}
                    `}
                >
                    {idx + 1}
                    {isFlagged && (
                        <div className="absolute top-0.5 right-0.5">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        </div>
                    )}
                </button>
                );
            })}
        </div>
      </div>
      
      <div className="mt-auto p-6 bg-white border-t border-slate-200">
         <button className={`w-full py-2.5 rounded font-medium transition-colors shadow-sm
            bg-slate-800 text-white hover:bg-slate-900`}>
            Submit Test
         </button>
      </div>
    </aside>
  );
};
