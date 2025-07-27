import { useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition | undefined;
    webkitSpeechRecognition: typeof SpeechRecognition | undefined;
  }
}

export default function TestMic() {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      console.warn("SpeechRecognition API not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();

    recognition.onstart = () => console.log("SpeechRecognition started");
    recognition.onresult = (event: any) => {
      console.log("SpeechRecognition result:", event.results[0][0].transcript);
    };
    recognition.onerror = (event: any) => {
      console.error("SpeechRecognition error:", event.error);
    };
    recognition.onend = () => console.log("SpeechRecognition ended");
  }, []);

  const handleStart = () => {
    console.log("Start button clicked");
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    console.log("Stop button clicked");
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleStart} style={{ marginRight: 10 }}>
        Start Listening
      </button>
      <button onClick={handleStop}>Stop Listening</button>

      <p>Listening: {listening ? "Yes" : "No"}</p>
      <p>Transcript: {transcript}</p>
    </div>
  );
}
