import { AllselectedItemsState, questionSchema } from "@/types";
import { ChevronLeft, ChevronRight, Loader, FileText } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";
import { generateAiResponse } from "@/utils/generateAiResponse";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

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
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl border">
        <h6 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Interview Summary
        </h6>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-sm">Technologies</p>
            {techStacks.length ? (
              <div className="flex flex-wrap gap-1">
                {techStacks.map((stack, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 text-xs"
                  >
                    {stack}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No technologies selected</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-sm">Role</p>
            {role ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 text-xs"
              >
                {role}
              </Badge>
            ) : (
              <p className="text-xs text-gray-400">Not selected</p>
            )}
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-700 text-sm">
              Experience Level
            </p>
            {experience ? (
              <Badge
                variant="secondary"
                className="bg-purple-100 text-purple-800 text-xs"
              >
                {experience}
              </Badge>
            ) : (
              <p className="text-xs text-gray-400">Not selected</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          disabled={isLoading}
          variant="outline"
          className="flex items-center gap-2"
          onClick={goToBackTab}
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2"
          onClick={handleSubmit}
          disabled={
            isLoading ||
            allselectedItems.techStacks.length === 0 ||
            allselectedItems.role === "" ||
            allselectedItems.experience === ""
          }
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              Create Interview
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
