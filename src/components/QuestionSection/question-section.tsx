import Webcam from "react-webcam";
import {
  CameraOffIcon,
  Mic,
  MicOff,
  RotateCcw,
  Video,
  VideoOff,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { QuestionSectionFooter } from "./question-section-footer";
import { MediaPermissionsContext } from "@/context/media-permissions-context";
import { questionSchema } from "@/types";

interface QuestionSectionProps {
  question: questionSchema;
  currentQuestion: number;
  totalQuestions: number;
  questions: questionSchema[];
  setInterview: React.Dispatch<React.SetStateAction<any>>;
}

export const QuestionSection = ({
  question,
  currentQuestion,
  totalQuestions,
  questions,
  setInterview,
}: QuestionSectionProps) => {
  const {
    isCamAllowed,
    isMicAllowed,
    setCamAllowed,
    setMicAllowed,
  } = useContext(MediaPermissionsContext);

  const {
    error,
    interimResult,
    results,
    isRecording,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
    speechRecognitionProperties: { interimResults: true },
  });

  const [userAnswer, setUserAnswer] = useState("");

  useEffect(() => {
    if (error) {
      console.warn("Speech recognition error:", error);
      return;
    }

    const final =
      results?.length > 0
        ? typeof results[results.length - 1] === "string"
          ? results[results.length - 1]
          : (results[results.length - 1] as any).transcript ?? ""
        : "";

    const combined = `${final} ${interimResult}`.trim();

    if (combined && combined !== userAnswer) {
      setUserAnswer(combined);
    }
  }, [interimResult, results, error]);

  const recordUserAnswer = () => {
    if (isRecording) {
      stopSpeechToText();
      setMicAllowed(false);
    } else {
      startSpeechToText();
      setMicAllowed(true);
    }
  };

  const recordNewAnswer = () => {
    setUserAnswer("");
    setMicAllowed(true);
    setResults([]);
    stopSpeechToText();
    startSpeechToText();
  };

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between gap-6">
        <div className="flex-1">
          <div className="flex flex-col border p-4 rounded-md min-w-80 h-auto">
            <span className="font-medium mb-2">Question:</span>
            <span>{question?.question}</span>
          </div>

          <div className="mt-10 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold">Your Answer:</span>
              <span
                className="text-xs text-red-500 flex items-center gap-1 cursor-pointer"
                onClick={recordNewAnswer}
              >
                <RotateCcw size={15} />
                Reset Answer
              </span>
            </div>

            <div className="w-full mt-4 p-4 border rounded-md bg-gray-50 h-48">
              <textarea
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="w-full h-full resize-none bg-transparent text-sm text-gray-700 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[300px] flex flex-col rounded-md gap-2">
          {isCamAllowed ? (
            <Webcam className="rounded-lg w-full h-[220px] object-cover" />
          ) : (
            <div className="w-full h-[220px] flex flex-col justify-center items-center bg-[#EAEFF5] rounded-lg text-gray-500">
              <CameraOffIcon size={40} />
              <span className="text-sm mt-2">Camera is off</span>
            </div>
          )}
          <div className="space-y-1">
            <span className="text-sm font-medium">Question Progress</span>
            <div className="flex gap-2">
              {questions.map((q, i) => {
                const color = q.skiped
                  ? "bg-yellow-400"
                  : q.userAnswer
                    ? "bg-green-400"
                    : "bg-gray-400";
                return (
                  <span
                    key={i}
                    className={`block h-[5px] w-20 rounded-xl ${color}`}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex gap-8 justify-center mt-2">
            <span
              className="cursor-pointer"
              onClick={() => setCamAllowed(!isCamAllowed)}>
              {isCamAllowed ? (
                <Video className="text-gray-500" size={20} />
              ) : (
                <VideoOff className="text-gray-500" size={20} />
              )}
            </span>
            <span className="cursor-pointer" onClick={recordUserAnswer}>
              {isMicAllowed && isRecording ? (
                <Mic className="text-gray-500" size={20} />
              ) : (
                <MicOff className="text-gray-500" size={20} />
              )}
            </span>
          </div>
        </div>
      </div>

      <hr className="mt-10 w-full" />
      
      <QuestionSectionFooter
        userAnswer={userAnswer}
        totalQuestions={totalQuestions}
        question={question}
        currentQuestion={currentQuestion}
        setUserAnswer={setUserAnswer}
        setInterview={setInterview}
      />
    </>
  );
};
