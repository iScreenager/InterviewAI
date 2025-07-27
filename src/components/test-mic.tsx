import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

export default function TestMic() {
  const { transcript, listening } = useSpeechRecognition();

  return (
    <div className="p-8">
      <button
        onClick={() => {
          console.log("Start button clicked");
          SpeechRecognition.startListening({ continuous: true });
        }}
        className="bg-green-500 text-white px-4 py-2 rounded">
        Start Listening
      </button>
      <button
        onClick={() => {
          console.log("Stop button clicked");
          SpeechRecognition.stopListening();
        }}
        className="bg-red-500 text-white px-4 py-2 rounded ml-4">
        Stop Listening
      </button>
      <p className="mt-4">Listening: {listening ? "Yes" : "No"}</p>
      <p className="mt-2">Transcript: {transcript}</p>
    </div>
  );
}
