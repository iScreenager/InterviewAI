import { Send, SkipForwardIcon } from "lucide-react";
import { Button } from "../ui/button";
import { questionSchema } from "@/types";
import { toast } from "sonner";

import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { generateResult } from "@/utils/generateResult";
import { db } from "@/config/firebase.config";
import { generateAndStoreOverallFeedback } from "@/utils/generateOverallFeedback";
import { useInterview } from "@/context/interview-context";
import { MediaPermissionsContext } from "@/context/media-permissions-context";

interface QuestionSectionFooterProps {
  userAnswer: string;
  question: questionSchema;
  currentQuestion: number;
  setUserAnswer: (val: string) => void;
  totalQuestions: number;
  setInterview: React.Dispatch<React.SetStateAction<unknown>>;
}

export const QuestionSectionFooter = ({
  userAnswer,
  totalQuestions,
  question,
  currentQuestion,
  setUserAnswer,
  setInterview,
}: QuestionSectionFooterProps) => {
  const { user } = useContext(AuthContext);
  const { setCamAllowed, setMicAllowed } = useContext(MediaPermissionsContext);
  const { interviewId } = useParams();
  const { goToNextQuestion } = useInterview();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function submitAndEndInterview() {
    if (loading) return;
    setLoading(true);
    try {
      if (user?.uid && interviewId) {
        await generateAndStoreOverallFeedback(user.uid, interviewId);
        setCamAllowed(false);
        setMicAllowed(false);
        navigate(`/feedback/${interviewId}`);
      } else {
        console.warn("User ID or Interview ID is missing");
      }
    } finally {
      setLoading(false);
    }
  }

  const handleSkip = async () => {
    if (loading) return;
    setLoading(true);
    if (!user?.uid || !interviewId) {
      navigate("/generate", { replace: true });
      setLoading(false);
      return;
    }

    try {
      const updatedQuestion: questionSchema = {
        ...question,
        userAnswer: "",
        feedback: "Question skipped",
        rating: 0,
        skiped: true,
      };

      const interviewRef = doc(
        db,
        "users",
        user.uid,
        "interviews",
        interviewId
      );

      const docSnap = await getDoc(interviewRef);
      const data = docSnap.data();

      if (!data?.questions || !Array.isArray(data.questions)) {
        throw new Error("Questions array not found");
      }

      const questions = [...data.questions];
      questions[currentQuestion] = updatedQuestion;

      await updateDoc(interviewRef, {
        questions,
      });

      setInterview((prev:unknown) => (prev ? { ...prev, questions } : prev));

      toast.success("Question skipped!");
      setUserAnswer("");

      if (currentQuestion + 1 >= totalQuestions) {
        await submitAndEndInterview();
      } else {
        goToNextQuestion();
      }
    } catch (error) {
      console.error("Error skipping question:", error);
      toast.error("Failed to skip question, try again!");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    if (loading) return;
    if (!userAnswer) {
      toast.error("Please Answer", {
        description: "Please provide an answer",
      });
      return;
    }

    if (!user?.uid || !interviewId) {
      navigate("/generate", { replace: true });
      return;
    }

    if (userAnswer.trim().length < 30) {
      toast.error("Answer too short", {
        description: "Please provide an answer longer than 30 characters.",
      });
      return;
    }

    setLoading(true);
    try {
      const aiResult = await generateResult(
        question.question,
        question.answer,
        userAnswer
      );

      if (aiResult) {
        const updatedQuestion: questionSchema = {
          ...question,
          userAnswer: userAnswer.trim(),
          feedback: aiResult.feedback,
          rating: aiResult.ratings,
        };

        const interviewRef = doc(
          db,
          "users",
          user.uid,
          "interviews",
          interviewId
        );

        const docSnap = await getDoc(interviewRef);
        const data = docSnap.data();

        if (!data?.questions || !Array.isArray(data.questions)) {
          throw new Error("Questions array not found");
        }

        const questions = [...data.questions];
        questions[currentQuestion] = updatedQuestion;

        await updateDoc(interviewRef, {
          questions,
        });

        setInterview((prev: unknown) => (prev ? { ...prev, questions } : prev));

        toast.success("Answer submitted!");
        setUserAnswer("");

        if (currentQuestion + 1 >= totalQuestions) {
          await submitAndEndInterview();
        } else {
          goToNextQuestion();
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Submission failed, try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300"
          onClick={submitAndEndInterview}
          disabled={loading}
        >
          End Interview
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="px-6 py-2.5 border-gray-300 hover:bg-gray-50"
            onClick={handleSkip}
            disabled={loading}
          >
            <SkipForwardIcon size={16} className="mr-2" />
            Skip Question
          </Button>
          <Button
            className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSubmit}
            disabled={
              loading || !userAnswer.trim() || userAnswer.trim().length < 30
            }
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                </svg>
                Submitting...
              </>
            ) : (
              <>
                Submit Answer
                <Send size={16} className="ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
