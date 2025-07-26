type OverallFeedback = {
  strengths: string[];
  improvements: string[];
  overallScore: number;
  summary: string;
};

export function cleanAiOverall(response: string): OverallFeedback {
  try {
    const firstBrace = response.indexOf("{");
    if (firstBrace === -1) throw new Error("No JSON object found");

    let openBraces = 0;
    let lastBraceIndex = -1;

    for (let i = firstBrace; i < response.length; i++) {
      if (response[i] === "{") openBraces++;
      else if (response[i] === "}") openBraces--;

      if (openBraces === 0) {
        lastBraceIndex = i;
        break;
      }
    }

    if (lastBraceIndex === -1) throw new Error("Incomplete JSON block");

    const jsonString = response.slice(firstBrace, lastBraceIndex + 1);
    const parsed = JSON.parse(jsonString);

    if (
      !Array.isArray(parsed.strengths) ||
      !Array.isArray(parsed.improvements) ||
      typeof parsed.overallScore !== "number" ||
      typeof parsed.summary !== "string"
    ) {
      throw new Error("Invalid feedback format");
    }
    console.log("AI Raw Response:\n", parsed);
    return parsed;
  } catch (error) {
    console.error("cleanAiOverall error:", error);
    throw new Error(
      "Failed to extract valid overall feedback object from AI response."
    );
  }
}
