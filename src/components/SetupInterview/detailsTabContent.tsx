import { AllselectedItemsState, questionSchema } from "@/types";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { generateAiResponse } from "@/utils/generateAiResponse";
import { Button } from "../ui/button";

interface DetailsTabContentProps {
  allselectedItems: AllselectedItemsState;
  goToBackTab: () => void;
}

export const DetailsTabContent = ({
  allselectedItems,
  goToBackTab,
}: DetailsTabContentProps) => {
  const { techStacks, role, experience } = allselectedItems;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const toastMessage = {
    title: "Created..!",
    description: "New Mock Interview created...",
  };

  const handleSubmit = async () => {
    if (!techStacks.length || !role || !experience) {
      toast.error("Please fill all details before proceeding.");
      return;
    }

    if (!user?.uid) {
      toast.error("User not logged in. Please login again.");
      return;
    }

    try {
      setIsLoading(true);

      const questions = await generateAiResponse({
        techStacks,
        role,
        experience,
      });

      const mappedQuestions = questions.map((q: questionSchema) => ({
        question: q.question,
        answer: q.answer,
        userAnswer: "",
        feedback: "",
        rating: 0,
        skiped: false,
      }));

      const docRef = await addDoc(
        collection(db, "users", user.uid, "interviews"),
        {
          position: role,
          description: `Interview for ${role} with ${experience} experience`,
          experience,
          techStack: techStacks.join(", "),
          questions: mappedQuestions,
          userId: user?.uid,
          createdAt: serverTimestamp(),
          interviewSubmitted: false,
        }
      );

      const interviewID = docRef.id;

      toast(toastMessage.title, {
        description: toastMessage.description,
      });

      navigate(`/interview/${interviewID}`);
    } catch (error) {
      console.error("Interview generation error:", error);
      toast.error("Error....", {
        description: "Something went wrong. Please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-[#EAEFF5] p-5 rounded-2xl shadow-sm flex flex-col gap-8 ">
      <h6 className="text-lg font-semibold">Interview Summary</h6>
      <div className="flex flex-col gap-4 justify-start">
        <div>
          <p className="text-sm font-medium">Technologies:</p>
          {techStacks.length ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStacks.map((stack, index) => (
                <span
                  key={index}
                  className="bg-[#7cddec] px-4 py-2 text-xs rounded-full ">
                  {stack}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 mt-1">
              No technologies selected
            </p>
          )}
        </div>
        <div>
          <p className="font-medium text-sm mb-2">Role:</p>
          {role ? (
            <span className="bg-[#7cddec] px-4 py-2 text-xs rounded-full ">
              {role}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not selected</span>
          )}
        </div>
        <div>
          <p className="font-medium text-sm mb-2">Experience Level:</p>
          {experience ? (
            <span className="bg-[#7cddec] px-4 py-2 text-xs rounded-full ">
              {experience}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not selected</span>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          disabled={isLoading}
          className="rounded-full bg-[#3E517F] hover:bg-[#2f52a6] text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
          onClick={goToBackTab}>
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>
        <Button
          className="rounded-full bg-[#3E517F] hover:bg-[#2f52a6] text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            allselectedItems.techStacks.length === 0 ||
            allselectedItems.role === "" ||
            allselectedItems.experience === ""
          }>
          {isLoading ? (
            <Loader className="text-gray-50 animate-spin" />
          ) : (
            <>
              Create Interview
              <span className="hidden sm:inline">
                <ChevronRight className="w-4 h-4" />
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
