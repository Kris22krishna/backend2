export type GradeLevel = '1-4' | '5-8' | '9-12';

export type QuestionType = 'MCQ' | 'IMAGE_BASED' | 'INPUT';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // For MCQ
  imageUrl?: string; // For Image based
  hotspots?: { x: number; y: number; label: string }[]; // For Image based interactions (simplified)
  placeholder?: string; // For input
  hint?: string;
  correctAnswer: string;
}

export const BRAND_COLORS = {
  primary: {
    mint: '#A8FBD3',
    teal: '#4FB7B3',
    blue: '#637AB9',
    navy: '#31326F',
  },
  accents: {
    indigo: '#4300FF',
    royalBlue: '#0065F8',
    skyBlue: '#00CAFF',
    aqua: '#00FFDE',
  },
};
