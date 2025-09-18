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
import { MediaPermissionsContext } from "@/context/media-permissions-context";
import Webcam from "react-webcam";

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
    setInterviewStarted,
  } = useInterview();
  const { setCamAllowed, setMicAllowed } = useContext(MediaPermissionsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const enableMicByDefault = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicAllowed(true);
        console.log("Microphone enabled by default");
      } catch (error) {
        console.error("Microphone access denied:", error);
        setMicAllowed(false);
      }
    };

    const timer = setTimeout(() => {
      enableMicByDefault();
    }, 100);

    return () => clearTimeout(timer);
  }, [setMicAllowed]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (interviewStarted) {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your interview progress may be lost.";
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
    return () => {
      setCamAllowed(false);
      setMicAllowed(false);
    };
  }, [setCamAllowed, setMicAllowed]);

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
            setInterviewStarted(true);
            if (interviewData.questions && interviewData.questions.length > 0) {
              const lastIndex = interviewData.questions.findIndex(
                (q) => !q.userAnswer && !q.skiped
              );
              if (lastIndex === -1) {
                setCurrentQuestionIndex(interviewData.questions.length - 1);
              } else {
                setCurrentQuestionIndex(lastIndex);
              }
            } else {
              setCurrentQuestionIndex(0);
            }
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
  }, [
    interviewId,
    navigate,
    user?.uid,
    setCurrentQuestionIndex,
    setInterviewStarted,
  ]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  const totalQuestions = interview?.questions?.length ?? 0;
  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 pt-0 pb-6">
        {interviewStarted && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <QuestionSection
              question={
                interview?.questions[currentQuestionIndex] as questionSchema
              }
              currentQuestion={currentQuestionIndex}
              totalQuestions={totalQuestions}
              questions={interview?.questions || []}
              setInterview={
                setInterview as React.Dispatch<React.SetStateAction<unknown>>
              }
            />
          </div>
          <div className="space-y-6">
            <div className="relative">
              <div className="relative">
                <Webcam
                  className="w-full h-64 object-cover rounded-lg border"
                  audio={false}
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  Live
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Question Progress
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Current:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                      {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-1.5">
                    {interview?.questions?.map((q, i) => {
                      const isCurrent = i === currentQuestionIndex;
                      const isCompleted = q.userAnswer && !q.skiped;
                      const isSkipped = q.skiped;

                      let color = "bg-gray-300";
                      let borderColor = "border-gray-300";

                      if (isCompleted) {
                        color = "bg-green-500";
                        borderColor = "border-green-500";
                      } else if (isSkipped) {
                        color = "bg-yellow-500";
                        borderColor = "border-yellow-500";
                      } else if (isCurrent) {
                        color = "bg-blue-100";
                        borderColor = "border-blue-400";
                      }

                      return (
                        <div
                          key={i}
                          className={`h-3 flex-1 rounded-full border-2 transition-all duration-300 ${color} ${borderColor}`}
                          title={`Question ${i + 1}${
                            isCurrent
                              ? " (Current)"
                              : isCompleted
                              ? " (Answered)"
                              : isSkipped
                              ? " (Skipped)"
                              : " (Not Started)"
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Answered</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Skipped</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-100 border border-blue-400 rounded-full"></div>
                        <span>Current</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
