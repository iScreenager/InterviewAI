import { AllselectedItemsState } from "@/types";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { chatSession } from "@/scripts";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/auth-context";

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

  const cleanAiResponse = (responseText: string) => {
    let cleanText = responseText.trim();
    cleanText = cleanText.replace(/[`]|json/g, "");
    const jsonArrayMatch = cleanText.match(/\[.*\]/s);

    if (!jsonArrayMatch) {
      throw new Error("No JSON array found in response");
    }

    try {
      return JSON.parse(jsonArrayMatch[0]);
    } catch (error) {
      throw new Error("Invalid JSON format: " + (error as Error).message);
    }
  };

  const generateAiResponse = async ({
    techStacks,
    role,
    experience,
  }: AllselectedItemsState) => {
    const prompt = `
As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information.

Each object in the array must follow this format:
[
  {
    "question": "<Question text>",
    "answer": "<Answer text>"
  },
  ...
]

Job Information:
- Job Position: ${role}
- Job Description: Interview for a ${role} role with ${experience} of experience
- Years of Experience Required: ${experience}
- Tech Stacks: ${techStacks.join(", ")}

The questions should assess:
- Skills in ${techStacks.join(", ")} development
- Best practices, architecture, debugging, and real-world scenarios
- Problem-solving ability and handling of complex requirements

Return only the JSON array. Do not include any explanations, markdown, or extra formatting.
`;

    const aiResult = await chatSession.sendMessage(prompt);
    const cleanedResponse = cleanAiResponse(await aiResult.response.text());
    return cleanedResponse;
  };

  const handleSubmit = async () => {
    if (!techStacks.length || !role || !experience) {
      toast.error("Please fill all details before proceeding.");
      return;
    }

    try {
      setIsLoading(true);

      const questions = await generateAiResponse({
        techStacks,
        role,
        experience,
      });

      await addDoc(collection(db, "interviews"), {
        position: role,
        description: `Interview for ${role} with ${experience} experience`,
        experience: parseInt(experience),
        techStack: techStacks.join(", "),
        questions,
        userId: user?.uid,
        createdAt: serverTimestamp(),
      });

      toast(toastMessage.title, {
        description: toastMessage.description,
      });

      navigate("/generate", { replace: true });
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
    <div className="space-y-4 bg-indigo-50 p-5 rounded-2xl shadow-sm flex flex-col gap-5 ">
      <h6 className="text-lg font-semibold text-indigo-700">
        Interview Summary
      </h6>
      <div className="flex flex-col gap-3 justify-start">
        <div>
          <p className="text-sm font-medium">Technologies:</p>
          {techStacks.length ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStacks.map((stack, index) => (
                <span
                  key={index}
                  className="bg-[#e2d6f8] px-4 py-2 text-xs rounded-full shadow-md">
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
            <span className="bg-[#e2d6f8] px-4 py-2 text-xs rounded-full shadow-md">
              {role}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not selected</span>
          )}
        </div>
        <div>
          <p className="font-medium text-sm mb-2">Experience Level:</p>
          {experience ? (
            <span className="bg-[#e2d6f8] px-4 py-2 text-xs rounded-full shadow-md">
              {experience}
            </span>
          ) : (
            <span className="text-xs text-gray-400">Not selected</span>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
          onClick={goToBackTab}>
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
          onClick={handleSubmit}
          disabled={isLoading || allselectedItems.techStacks.length === 0 || allselectedItems.role === "" || allselectedItems.experience === ""}>
          {isLoading ? (
            <Loader className="text-gray-50 animate-spin" />
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
