import { RotateCcw } from "lucide-react";
import { useEffect, useState, useContext } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { QuestionSectionFooter } from "./question-section-footer";
import { questionSchema } from "@/types";
import { MediaPermissionsContext } from "@/context/media-permissions-context";

interface QuestionSectionProps {
  question: questionSchema;
  currentQuestion: number;
  totalQuestions: number;
  questions: questionSchema[];
  setInterview: React.Dispatch<React.SetStateAction<unknown>>;
}

export const QuestionSection = ({
  question,
  currentQuestion,
  totalQuestions,
  setInterview,
}: QuestionSectionProps) => {
  const {
    error,
    interimResult,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: { interimResults: true },
  });

  const { isMicAllowed, setMicAllowed } = useContext(MediaPermissionsContext);
  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    setResults([]);
  }, [question?.question, setResults]);

  useEffect(() => {
    if (isMicAllowed) {
      const timer = setTimeout(() => {
        startSpeechToText();
      }, 500);
      return () => clearTimeout(timer);
    } else {
      stopSpeechToText();
    }
  }, [isMicAllowed, startSpeechToText, stopSpeechToText]);

  useEffect(() => {
    if (isMicAllowed) {
      const timer = setTimeout(() => {
        startSpeechToText();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isMicAllowed, startSpeechToText]);

  useEffect(() => {
    if (error) {
      console.warn("Speech recognition error:", error);
      return;
    }

    if (!isMicAllowed) {
      return;
    }

    const allFinalResults =
      results
        ?.map((result) =>
          typeof result === "string"
            ? result
            : (result as { transcript: string })?.transcript || ""
        )
        .filter((result) => result.trim() !== "")
        .join(" ") || "";

    const currentInterim = interimResult || "";
    const currentSpeech = [allFinalResults, currentInterim]
      .filter((part) => part && part.trim() !== "")
      .join(" ")
      .trim();

    if (currentSpeech && !currentSpeech.includes("undefined")) {
      setUserAnswer(currentSpeech);
    }
  }, [interimResult, results, error, isMicAllowed]);

  const recordNewAnswer = () => {
    setUserAnswer("");
    setResults([]);
    stopSpeechToText();
    startSpeechToText();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="mb-6">
          <p className="text-gray-800 text-lg leading-relaxed">
            {question?.question}
          </p>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Answer</h3>
            <button
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={recordNewAnswer}
            >
              <RotateCcw size={14} />
              Reset Answer
            </button>
          </div>

          <div className="relative">
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here or use voice recording..."
              className="w-full h-40 resize-none border-2 border-gray-200 rounded-lg p-4 text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setMicAllowed(!isMicAllowed);
                }}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isMicAllowed
                    ? "text-red-600 hover:text-red-700"
                    : "text-green-600 hover:text-green-700"
                }`}
              >
                {isMicAllowed ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    Stop Listening
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 14l2 2m0 0l2-2m-2 2l-2-2m2 2V9a2 2 0 00-2-2H9"
                      />
                    </svg>
                    Start Listening
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-red-500">Min 30 characters</div>
          </div>
        </div>
      </div>

      <QuestionSectionFooter
        userAnswer={userAnswer}
        totalQuestions={totalQuestions}
        question={question}
        currentQuestion={currentQuestion}
        setUserAnswer={setUserAnswer}
        setInterview={setInterview}
      />
    </div>
  );
};
