import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { toast } from "sonner";
import { chatSession } from "@/scripts";

import { Interview, questionSchema } from "@/types";

import { cleanAiOverall } from "./cleanAiOverall";

export const generateAndStoreOverallFeedback = async (
  userId: string,
  interviewId: string
): Promise<void> => {
  try {
    const interviewRef = doc(db, "users", userId, "interviews", interviewId);
    const interviewSnap = await getDoc(interviewRef);

    if (!interviewSnap.exists()) {
      toast.error("Interview not found");
      return;
    }

    const interviewData = interviewSnap.data() as Interview;

    if (!interviewData.questions || interviewData.questions.length === 0) {
      toast.error("No questions found in this interview");
      return;
    }

    const questionSummaries = interviewData.questions
      .filter(
        (q: questionSchema) =>
          q.rating !== undefined &&
          q.feedback !== undefined &&
          q.userAnswer !== undefined
      )
      .map((q) => ({
        question: q.question,
        answer: q.answer,
        userAnswer: q.userAnswer!,
        feedback: q.feedback!,
        rating: q.rating!,
      }));

    if (questionSummaries.length === 0) {
      toast.error("No valid question feedback found.");
      return;
    }

    const averageRating =
      questionSummaries.reduce((acc, q) => acc + q.rating, 0) /
      questionSummaries.length;
    const overallScore = Math.round((averageRating / 10) * 100);

    const prompt = `
As an AI interview assistant, analyze a candidate's technical interview performance and generate an overall feedback object.

Instructions:
- Use the provided interview data to extract insights.
- Return only a single valid JSON object. Do not include any explanation, markdown, or formatting.

Each object must include:
{
  "strengths": [ up to 5 specific strengths each of 5 words only ],
  "improvements": [ up to 5 specific improvements each of 5 words only ],
  "overallScore": <average score as a percentage (0-100)>,
  "summary": "<exactly 10-word summary  of the candidate's performance>"
}

Data:
${JSON.stringify(questionSummaries, null, 2)}

Candidate's average rating score across all questions: ${overallScore}

Return only the JSON object.
`;

    const aiResponse = await chatSession.sendMessage(prompt);

    const overallFeedback = cleanAiOverall(aiResponse.response.text());

    console.log(overallFeedback);

    await updateDoc(interviewRef, {
      overallFeedback,
      status: "completed",
      updateAt: serverTimestamp(),
      interviewSubmitted: true,
    });

    toast.success("Overall feedback generated and saved!");
  } catch (error) {
    console.error("Error generating overall feedback:", error);
    toast.error("Failed to generate overall feedback.");
  }
};
