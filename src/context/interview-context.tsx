import React, { createContext, useContext, useState, ReactNode } from 'react';

interface InterviewContextType {
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  interviewStarted: boolean;
  setInterviewStarted: (started: boolean) => void;
  goToNextQuestion: () => void;
}

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

interface InterviewProviderProps {
  children: ReactNode;
}

export const InterviewProvider: React.FC<InterviewProviderProps> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const goToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const value: InterviewContextType = {
    currentQuestionIndex,
    setCurrentQuestionIndex,
    interviewStarted,
    setInterviewStarted,
    goToNextQuestion,
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}; 