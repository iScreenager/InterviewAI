import { AuthContext } from "@/context/auth-context";
import { Interview, questionSchema } from "@/types";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { QuestionSection } from "@/components/QuestionSection/question-section";
import { useInterview } from "@/context/interview-context";

export const PracticeInterviewPage = () => {
  const { interviewId } = useParams<{
    interviewId: string;
  }>();

  const [interview, setInterview] = useState<Interview>();
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const { 
    currentQuestionIndex, 
    setCurrentQuestionIndex, 
    interviewStarted, 
    setInterviewStarted
  } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (interviewStarted) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your interview progress may be lost.";
        return e.returnValue;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F5" ||
        (e.ctrlKey && e.key === "r") ||
        (e.ctrlKey && e.shiftKey && e.key === "R")
      ) {
        e.preventDefault();
        toast.error("Please don't refresh the page during the interview!");
        return false;
      }
    };

    if (interviewStarted) {
      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [interviewStarted]);

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        setIsLoading(true);
        if (!user?.uid || !interviewId) {
          navigate("/generate", { replace: true });
          return;
        }
        try {
          const interviewDoc = await getDoc(
            doc(db, "users", user.uid, "interviews", interviewId)
          );
          if (interviewDoc.exists()) {
            const interviewData = { ...interviewDoc.data() } as Interview;
            setInterview(interviewData);
            
            // const lastAnsweredIndex = interviewData.questions?.findIndex(q => q.userAnswer) ?? -1;
            setInterviewStarted(true);
            // if (lastAnsweredIndex >= 0) {
            //   setCurrentQuestionIndex(Math.max(lastAnsweredIndex, 0));
            // } else {
            //   setCurrentQuestionIndex(0);
              
            //   await updateDoc(doc(db, "users", user.uid, "interviews", interviewId), {
            //     status: "in_progress",
            //     updateAt: new Date()
            //   });
            // }
          } else {
            navigate("/generate", { replace: true });
          }
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchInterview();
    }
  }, [interviewId, navigate, user?.uid, setCurrentQuestionIndex, setInterviewStarted]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  const totalQuestions = interview?.questions?.length ?? 0;
  const progress =
    currentQuestionIndex === 0
      ? 0
      : Math.round((currentQuestionIndex / totalQuestions) * 100);
  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl space-y-12">
      {interviewStarted && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Interview in Progress
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Please do not refresh or reload this page.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h6 className="text-2xl font-semibold">Technical Interview</h6>
            <span className="text-gray-500 text-sm">{`Questions ${currentQuestionIndex + 1} of ${totalQuestions}`}</span>
          </div>
        </div>
        <div className="w-full h-2 border rounded-lg bg-gray-200">
          <div
            className="bg-[#283e70] h-1.5 transition-all duration-300 ease-in-out rounded-lg "
            style={{ width: `${progress}%` }}></div>
        </div>
      </header>
      <div>
        <QuestionSection
          question={
            interview?.questions[currentQuestionIndex] as questionSchema
          }
          currentQuestion={currentQuestionIndex}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
};
