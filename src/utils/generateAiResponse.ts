import { chatSession } from "@/scripts";
import { AllselectedItemsState } from "@/types";
import { cleanAiResponse } from "./cleanAiResponse";

export const generateAiResponse = async ({
  techStacks,
  role,
  experience,
}: AllselectedItemsState) => {
  const prompt = `As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information.

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
