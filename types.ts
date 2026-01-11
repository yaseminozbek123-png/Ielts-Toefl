
// Define CEFR levels for academic vocabulary
export type CEFRLevel = 'B1' | 'B2' | 'C1';

export interface VocabWord {
  word: string;
  correctMeaning: string;
  wrongOptions: string[];
  definition: string;
  exampleSentence: string;
  level: CEFRLevel;
}

export interface QuizState {
  currentWordIndex: number;
  score: number;
  streak: number;
  maxStreak: number;
  showFeedback: boolean;
  selectedOption: string | null;
  isCorrect: boolean | null;
  quizCompleted: boolean;
  wrongAnswers: VocabWord[];
}

export enum AppMode {
  GAME = 'GAME',
  REVIEW = 'REVIEW',
  LAB = 'LAB'
}