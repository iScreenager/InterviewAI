import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { ArrowRight, Camera, Mic } from "lucide-react";

import Webcam from "react-webcam";

import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MediaPermissionsContext } from "@/context/media-permissions-context";
import { LoaderPage } from "./loader-page";

const PreInterviewPermissions = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();

  const { isMicAllowed, setMicAllowed } = useContext(MediaPermissionsContext);

  useEffect(() => {
    const requestMicAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMicAllowed(true);

        const audioContext = new (window.AudioContext ||
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(volume * 10);
          requestAnimationFrame(updateVolume);
        };

        updateVolume();
      } catch (error) {
        console.error("Microphone access denied:", error);
        setMicAllowed(false);
      }
    };

    requestMicAccess();
  }, [setMicAllowed]);

  const handleMicToggle = async (checked: boolean) => {
    if (!checked) {
      setMicAllowed(false);
      setAudioLevel(0);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicAllowed(true);

      const audioContext = new (window.AudioContext ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(volume * 10);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch (error) {
      console.error("Microphone access denied:", error);
      setMicAllowed(false);
      alert(
        "Microphone access was denied. Please enable it in your browser settings."
      );
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
  const canProceed = isMicAllowed;

  return (
    <div className="">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Interview Setup Required
          </h1>
          <p className="text-gray-600">
            Microphone access is required to proceed with your interview
          </p>
        </div>

       
        <div className="bg-white border rounded-lg p-6 space-y-6">
    
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-700">Camera</span>
            </div>

            <div className="flex justify-center">
              <Webcam className="w-64 h-48 object-cover rounded-lg border" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mic className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Microphone</span>
              </div>
              <Switch
                checked={isMicAllowed}
                onCheckedChange={handleMicToggle}
              />
            </div>

            {isMicAllowed && (
              <div className="space-y-2">
                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-green-500 rounded transition-all duration-100"
                    style={{ width: `${Math.min(audioLevel, 100)}%` }}></div>
                </div>
                <p className="text-xs text-gray-500">Audio level indicator</p>
              </div>
            )}
          </div>

          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-medium text-gray-700 mb-2">
              Important Information
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Microphone is required to proceed with the interview</li>
              <li>
                • You can enable/disable microphone anytime during the interview
              </li>
              <li>• Text input is always available as an alternative</li>
            </ul>
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleNavigation("/dashboard")}>
              Continue Later
            </Button>
            <Button
              className={`${
                canProceed
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              onClick={() =>
                canProceed &&
                handleNavigation(`/interview/${interviewId}/start`)
              }
              disabled={!canProceed}>
              Start Interview
              {canProceed && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreInterviewPermissions;
