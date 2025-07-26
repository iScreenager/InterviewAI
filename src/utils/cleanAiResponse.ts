export const cleanAiResponse = (responseText: string) => {
  let cleanText = responseText.trim();

  cleanText = cleanText
    .replace(/(```|`|json)/gi, "")
    .replace(/[\r\n\t]/g, " ")
    .trim();

  const jsonArrayMatch = cleanText.match(/\[.*\]/s);

  try {
    if (jsonArrayMatch) {
      return JSON.parse(jsonArrayMatch[0]);
    } else {
      return JSON.parse(cleanText);
    }
  } catch (error) {
    throw new Error("Invalid JSON format: " + (error as Error).message);
  }
};
