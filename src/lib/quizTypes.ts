
export type ElectricianProfile = "mesterm" | "regev" | "smart" | "stilv";

export interface QuizAnswer {
  text: string;
  type: number; // 1-4 corresponding to profile types
}

export interface QuizQuestion {
  question: string;
  answers: QuizAnswer[];
}

export interface QuizData {
  questions: QuizQuestion[];
}

export interface ProfileData {
  title: string;
  description: string;
  icon: string;
  strengths: string[];
  shareText: string;
}

export interface ProfilesData {
  [key: string]: ProfileData;
}
