import { chatSession } from "@/scripts";
import { toast } from "sonner";
import { cleanAiResponse } from "./cleanAiResponse";



interface AIResponse {
  ratings: number;
  feedback: string;
}

export const generateResult = async (
  question: string,
  correctAnswer: string,
  userAnswer: string
) => {
  const prompt = `
    Question: "${question}"
    Correct Answer: "${correctAnswer}"
    User Answer: "${userAnswer}"

    Please:
    1. Compare the user's answer to the correct one.
    2. Rate the user's answer out of 0 - 100%.
    3. Provide improvement feedback.
    Format response as:
    {
      "ratings": percentage (0-100),
      "feedback": string
    }
  `;

  try {
    const aiResult = await chatSession.sendMessage(prompt);
    const parsedResult: AIResponse = cleanAiResponse(aiResult.response.text());
    return parsedResult;

  } catch (error) {
    console.log(error);
    toast("Error", {
      description: "An error occurred while generating feedback.",
    });
  }
};
