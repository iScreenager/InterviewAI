import { FieldValue, Timestamp } from "firebase/firestore";
import { LucideIcon } from "lucide-react";

export interface User {
  uid: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  isAnonymous: boolean;
  photoURL: string;
  createdAt: Timestamp | FieldValue;
  updateAt: Timestamp | FieldValue;
}

export interface Interview {
  id: string;
  techStack: string;
  position: string;
  description: string;
  experience: number;
  userId: string;
  status: "in_progress" | "completed";
  createdAt: Timestamp;
  updateAt: Timestamp;
  overallFeedback?: overallFeedbackSchema;
  questions: questionSchema[];
  interviewSubmitted: boolean;
}

export interface questionSchema {
  question: string;
  answer: string;
  userAnswer: string;
  feedback: string;
  rating: number;
  skiped: boolean;
}

export interface overallFeedbackSchema {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  summary: string;
}


export interface CategoryItem {
  stack: string;
  select: boolean;
}

export interface Category {
  key: string;
  title: string;
  heading?: string;
  description?: string;
  icon?: LucideIcon;
  default: CategoryItem[];
}

export interface AllselectedItemsState {
  techStacks: string[];
  role: string;
  experience: string;
}
