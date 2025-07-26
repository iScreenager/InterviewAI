import { AuthContext } from "@/context/auth-context";
import { Interview, questionSchema } from "@/types";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { QuestionSection } from "@/components/QuestionSection/question-section";

export const PracticeInterviewPage = () => {
  const { interviewId, questionIndex } = useParams<{
    interviewId: string;
    questionIndex: string;
  }>();

  const [interview, setInterview] = useState<Interview>();

  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }
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
            setInterview({ ...interviewDoc.data() } as Interview);
            console.log("interview", interview);
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
  }, [interviewId, navigate, user?.uid]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[70vh]" />;
  }

  const totalQuestions = interview?.questions?.length ?? 0;
  const progress =
    Number(questionIndex) === 0
      ? 0
      : Math.round((Number(questionIndex) / totalQuestions) * 100);
  return (
    <div className="w-full max-w-5xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl space-y-12">
      <header className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <h6 className="text-2xl font-semibold">Technical Interview</h6>
            <span className="text-gray-500 text-sm">{`Questions ${Number(questionIndex)} of 5`}</span>
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
            interview?.questions[Number(questionIndex)] as questionSchema
          }
          currentQuestion={Number(questionIndex)}
          totalQuestions={totalQuestions}
        />
      </div>
    </div>
  );
};
