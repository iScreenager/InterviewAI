import { Send, SkipForwardIcon } from "lucide-react";
import { Button } from "../ui/button";
import { questionSchema } from "@/types";
import { toast } from "sonner";

import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { generateResult } from "@/utils/generateResult";
import { db } from "@/config/firebase.config";
import { generateAndStoreOverallFeedback } from "@/utils/generateOverallFeedback";
import { useInterview } from "@/context/interview-context";

interface QuestionSectionFooterProps {
  userAnswer: string;
  question: questionSchema;
  currentQuestion: number;
  setUserAnswer: (val: string) => void;
  totalQuestions: number;
}

export const QuestionSectionFooter = ({
  userAnswer,
  totalQuestions,
  question,
  currentQuestion,
  setUserAnswer,
}: QuestionSectionFooterProps) => {
  const { user } = useContext(AuthContext);
  const { interviewId } = useParams();
  const { goToNextQuestion } = useInterview();
  const navigate = useNavigate();

  async function submitAndEndInterview() {
    if (user?.uid && interviewId) {
      await generateAndStoreOverallFeedback(user.uid, interviewId);
      navigate(`/generate/feedback/${interviewId}`);
    } else {
      console.warn("User ID or Interview ID is missing");
    }
  }

  const handleSkip = async () => {
    if (!user?.uid || !interviewId) {
      navigate("/generate", { replace: true });
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

      toast.success("Question skipped!");
      setUserAnswer("");

      if (currentQuestion + 1 >= totalQuestions) {
        submitAndEndInterview();
      } else {
        goToNextQuestion();
      }
    } catch (error) {
      console.error("Error skipping question:", error);
      toast.error("Failed to skip question, try again!");
    }
  };

  const onSubmit = async () => {
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

        toast.success("Answer submitted!");
        setUserAnswer("");

        if (currentQuestion + 1 >= totalQuestions) {
          submitAndEndInterview();
        } else {
          goToNextQuestion();
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Submission failed, try again!");
    }
  };

  return (
    <div className="flex justify-between items-center gap-4 w-full flex-row mt-10">
      <Button
        className="border-none bg-transparent hover:bg-transparent text-red-600 flex items-center gap-1 justify-center"
        onClick={submitAndEndInterview}>
        <span className="hidden sm:inline">End Interview</span>
      </Button>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-md border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 flex items-center gap-2 text-sm shadow-md justify-center"
          onClick={handleSkip}>
          <span className="flex items-center gap-1">
            <SkipForwardIcon width={12} height={12}/>
            Skip
          </span>
        </Button>
        <Button
          className="rounded-md bg-[#3E517F] hover:bg-[#2f52a6] text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md justify-center"
          onClick={onSubmit}>
          <span className="hidden sm:inline">Submit answer</span>
          <span className="sm:hidden inline">Submit</span>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
