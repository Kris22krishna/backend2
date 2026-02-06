import React from 'react';
import { useApp, AppProvider } from './store'; 
import { BottomBar } from './components/BottomBar';
import { SidePanel } from './components/SidePanel';
import { QuestionRenderer } from './components/QuestionRenderer';
import { DrawingBoard } from './components/DrawingBoard';
import { GradeLevel } from './types';
import { AdventureMapHeader } from './components/AdventureMapHeader';

// The inner component that uses the context
const AppContent = () => {
  const { 
    gradeLevel, 
    setGradeLevel, 
    questions, 
    currentQuestionIndex, 
    answers, 
    setAnswer, 
    isDrawingOpen, 
    setIsDrawingOpen 
  } = useApp();

  const currentQ = questions[currentQuestionIndex];

  // Helper to determine background class based on mode
  const getBgClass = () => {
    switch (gradeLevel) {
      case '1-4': return 'bg-[#A8FBD3]'; // Mint base
      default: return 'bg-[#A8FBD3]';
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans transition-colors duration-500 ${getBgClass()} relative`}>
      
      {/* Grade 1-4 Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent"></div>
            
            {/* Floating Clouds */}
            <div className="absolute top-10 left-10 w-32 h-12 bg-white/60 rounded-full blur-xl opacity-70 animate-[float_10s_ease-in-out_infinite]"></div>
            <div className="absolute top-40 right-20 w-48 h-16 bg-white/50 rounded-full blur-xl opacity-60 animate-[float_15s_ease-in-out_infinite_reverse]"></div>
            <div className="absolute bottom-32 left-1/4 w-64 h-24 bg-white/40 rounded-full blur-2xl opacity-50 animate-[float_20s_ease-in-out_infinite]"></div>
            
            {/* Hills at bottom */}
            <div className="absolute -bottom-20 left-0 right-0 h-48 bg-[#4FB7B3]/20 rounded-[50%] blur-3xl transform scale-150"></div>
        </div>

      {/* Dev Controls - Mode Switcher Removed */}
      {/* The user asked to remove grades 5-8 and 9-12, effectively making the app Grade 1-4 only. 
          I have removed the switcher to enforce this and clean up the UI. */}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Map for Grade 1-4 */}
        <AdventureMapHeader />

        <div className="flex-1 flex overflow-hidden relative">
            {/* Changed layout logic to prevent scrolling and fit content */}
            <main className="flex-1 relative flex flex-col h-full overflow-hidden">
                <div className={`flex-1 flex flex-col justify-center w-full max-w-7xl mx-auto h-full overflow-y-auto md:overflow-hidden 
                    ${gradeLevel === '1-4' ? 'p-0' : 'p-4 md:p-6 lg:p-8'}`}>
                    {/* Main Content Card Wrapper */}
                    <div className={`w-full flex flex-col relative z-10 transition-all duration-500 max-h-full
                        ${gradeLevel === '1-4' ? 'bg-transparent h-full' : ''}
                    `}>
                        <QuestionRenderer 
                            question={currentQ}
                            questionNumber={currentQuestionIndex + 1}
                            selectedAnswer={answers[currentQ.id]}
                            onAnswer={(val) => setAnswer(currentQ.id, val)}
                            gradeLevel={gradeLevel}
                        />
                    </div>
                </div>
            </main>

            {/* Side Panel Removed as it was primarily for older grades or as an alternative nav not needed in 1-4 focused view */}
            {gradeLevel !== '1-4' && <SidePanel />}
        </div>
      </div>

      <BottomBar />

      <DrawingBoard isOpen={isDrawingOpen} onClose={() => setIsDrawingOpen(false)} />
    </div>
  );
};

// Export the wrapper that provides the context
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
