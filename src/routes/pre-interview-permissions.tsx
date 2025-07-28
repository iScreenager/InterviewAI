import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { ArrowRight, Camera, Mic } from "lucide-react";

import Webcam from "react-webcam";

import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaPermissionsContext } from "@/context/media-permissions-context";
import { LoaderPage } from "./loader-page";

const PreInterviewPermissions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const { isCamAllowed, setCamAllowed, isMicAllowed, setMicAllowed } =
    useContext(MediaPermissionsContext);

  const handleCamToggle = async (checked: boolean) => {
    if (!checked) {
      setCamAllowed(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setCamAllowed(true);
    } catch (error) {
      console.error("Camera access denied:", error);
      setCamAllowed(false);
      alert(
        "Camera access was denied. Please enable it in your browser settings."
      );
    }
  };

  const handleMicToggle = async (checked: boolean) => {
    if (!checked) {
      setMicAllowed(false);
      setAudioLevel(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAllowed(true);

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(volume*10);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error("Microphone access denied:", error);
      setMicAllowed(false);
      alert("Microphone access was denied. Please enable it in your browser settings.");
    }
  };

  const handleNavigation = async (path: string) => {
    setIsLoading(false);
    window.scrollTo(0, 0);
    navigate(path);
  };

  if (isLoading) {
    <LoaderPage />;
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white shadow-xl rounded-2xl space-y-12">
      <div className="space-y-8">
        <h1 className="font-semibold text-3xl mb-2">
          Ready for your Interview?
        </h1>
        <span className="text-[16px] text-gray-500">
          Set up your camera and microphone for a better interview experience
        </span>
        <p className="text-gray-500 italic">
          Note: Camera and microphone access are optional but recommended for a
          more realistic interview experience.
        </p>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-4 text-gray-800 font-medium">
            <Camera className="w-5 h-5 text-[#1BB4C9]" />
            Camera
          </span>
          <Switch checked={isCamAllowed} onCheckedChange={handleCamToggle} />
        </div>

        {isCamAllowed && (
          <div className="mt-3 flex justify-center ">
            <Webcam className="w-96 h-80 object-cover rounded-lg" />
          </div>
        )}

        <hr />

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-4 text-gray-800 font-medium">
            <Mic className="w-5 h-5 text-[#1BB4C9]" />
            Microphone
          </span>
          <Switch checked={isMicAllowed} onCheckedChange={handleMicToggle} />
        </div>
        {isMicAllowed && (
          <div className="mt-3">
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded transition-all duration-100"
                style={{ width: `${Math.min(audioLevel, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 border rounded-md p-3 bg-[#EAEFF5] w-full">
        <h6 className="font-medium text-lg flex items-center mb-3">
          Important Information:
        </h6>
        <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
          <li>
            You can continue without turning on your camera or microphone.
          </li>
          <li>
            You can enable or disable them at any time during the interview.
          </li>
          <li>
            Your answers will still be captured through text input if preferred.
          </li>
        </ul>
      </div>

      <div className="flex justify-end">
        <Button
          className="border-none bg-transparent hover:bg-transparent text-black"
          onClick={() => handleNavigation("/generate")}>
          <span className="hidden sm:inline"> Continue Later </span>
        </Button>
        <Button
          className="rounded-full bg-[#3E517F] hover:bg-[#2f52a6] text-white px-4 py-2 flex items-center gap-2 text-sm shadow-md"
          onClick={() =>
            handleNavigation(`/interview/${interviewId}/start`)
          }>
          Start Interview
          <span className="hidden sm:inline">
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default PreInterviewPermissions;
