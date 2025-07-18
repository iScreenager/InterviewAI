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
  position: string;
  description: string;
  experience: number;
  userId: string;
  questions: { question: string; answer: string }[];
  createdAt: Timestamp;
  updateAt: Timestamp;
  techStack: string;
}

export interface UserAnswer {
  id: string;
  mockIdRef: string;
  question: string;
  correct_ans: string;
  user_ans: string;
  feedback: string;
  rating: number;
  userId: string;
  createdAt: Timestamp;
  updateAt: Timestamp;
}

export interface CategoryItem {
  stack: string;
  select: boolean;
}

export interface Category {
  key: string;
  title: string;
  heading?: string,
  description?: string,
  icon?: LucideIcon;
  default: CategoryItem[];
}

export interface AllselectedItemsState {
   techStacks: string[];
  role: string;
  experience: string;
}