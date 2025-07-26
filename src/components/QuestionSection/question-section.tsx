import Webcam from "react-webcam";
import {
  CameraOffIcon,
  Mic,
  MicOff,
  RotateCcw,
  Video,
  VideoOff,
} from "lucide-react";
import { QuestionSectionFooter } from "./question-section-footer";
import { MediaPermissionsContext } from "@/context/media-permissions-context";
import { useContext, useEffect, useState } from "react";
import { questionSchema } from "@/types";
import useSpeechToText from "react-hook-speech-to-text";

interface QuestionSectionProps {
  question: questionSchema;
  currentQuestion: number;
  totalQuestions: number;
}

export const QuestionSection = ({
  question,
  currentQuestion,
  totalQuestions,
}: QuestionSectionProps) => {
  const { startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const { isCamAllowed, isMicAllowed, setCamAllowed } = useContext(
    MediaPermissionsContext
  );

  const [userAnswer, setUserAnswer] = useState("");

  const recordNewAnswer = () => {
    setUserAnswer("");
    setResults([]);
    stopSpeechToText();
    startSpeechToText();
  };

  const recordUserAnswer = async () => {
    if (isMicAllowed) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  };
  useEffect(() => {
    setUserAnswer("");
    setResults([]);
    stopSpeechToText();
  }, [currentQuestion]);
  // useEffect(() => {
  //   const combinedTranscripts = results
  //     .filter((result): result is ResultType => typeof result !== "string")
  //     .map((result) => result.transcript)
  //     .join(" ");

  //   setUserAnswer(combinedTranscripts);
  //   return () => {
  //     stopSpeechToText();
  //   };
  // }, [results, stopSpeechToText]);

  return (
    <>
      <div className="flex flex-col xl:flex-row justify-between  gap-6">
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
                onClick={recordNewAnswer}>
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
              {/* <p className="text-sm text-gray-700 whitespace-normal">
                {userAnswer
                  ? userAnswer
                  : isMicAllowed
                    ? "Mic on — start speaking"
                    : "Mic off — please unmute"}
              </p>

              {interimResult && (
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Current Speech:</strong>
                  {interimResult}
                </p>
              )} */}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[300px] flex flex-col   rounded-md gap-2">
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
              {[...Array(totalQuestions)].map((_, i) => (
                <span
                  key={i}
                  className={`block  h-[5px] w-20 rounded-xl ${currentQuestion > i ? "bg-green-400" : "bg-gray-400"}`}></span>
              ))}
            </div>
          </div>
          <div className="flex gap-8 justify-center mt-2">
            <span
              className="cursor-pointer"
              onClick={() => {
                setCamAllowed(!isCamAllowed);
              }}>
              {isCamAllowed ? (
                <Video className="text-gray-500" size={20} />
              ) : (
                <VideoOff className="text-gray-500" size={20} />
              )}
            </span>
            <span className="cursor-pointer" onClick={recordUserAnswer}>
              {isMicAllowed ? (
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
 
      />
    </>
  );
};
