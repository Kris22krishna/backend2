import React, { createContext, useContext, useState, useMemo } from 'react';
import { GradeLevel, Question } from './types';
import { QUESTIONS } from './data';

interface AppState {
  gradeLevel: GradeLevel;
  setGradeLevel: (g: GradeLevel) => void;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (i: number) => void;
  answers: Record<string, string>;
  setAnswer: (qId: string, val: string) => void;
  reviewList: Set<string>;
  toggleReview: (qId: string) => void;
  isDrawingOpen: boolean;
  setIsDrawingOpen: (v: boolean) => void;
  questions: Question[];
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('1-4');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reviewList, setReviewList] = useState<Set<string>>(new Set());
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);

  const questions = QUESTIONS;

  const setAnswer = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const toggleReview = (qId: string) => {
    setReviewList(prev => {
        const next = new Set(prev);
        if (next.has(qId)) next.delete(qId);
        else next.add(qId);
        return next;
    });
  };

  const value = useMemo(() => ({
    gradeLevel,
    setGradeLevel,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswer,
    reviewList,
    toggleReview,
    isDrawingOpen,
    setIsDrawingOpen,
    questions
  }), [gradeLevel, currentQuestionIndex, answers, reviewList, isDrawingOpen]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
