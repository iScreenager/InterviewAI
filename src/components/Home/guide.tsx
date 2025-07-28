import { Container } from "@/components/container";
import { Card, CardDescription, CardTitle } from "../ui/card";
import { useState } from "react";
import { CircleCheckBigIcon } from "lucide-react";

interface GuideStep {
  id: number;
  text: string;
  image: string;
}

 const Guide = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(1);
  const [onHover, setOnHover] = useState<number | null>(null);

  const chooseInterviewAi = [
    { id: 1, text: "Role-specific questions tailored to you" },
    { id: 2, text: "Instant AI feedback on your responses" },
    { id: 3, text: "Expert tips from industry professionals" },
    { id: 4, text: "Track your progress over multiple sessions" },
    { id: 5, text: "Practice anytime, anywhere at your convenience" },
    { id: 6, text: "Boost your interview confidence significantly" },
  ];

  const guideSteps: GuideStep[] = [
    {
      id: 1,
      text: "Enter your job role, description, and tech stack to generate a personalized mock interview experience.",
      image: "/assets/img/Create_interview.png",
    },
    {
      id: 2,
      text: "Answer role-specific interview questions with our interactive interface. Use audio and video to practice as if it's a real interview.",
      image: "/assets/img/Que_interview.png",
    },
    {
      id: 3,
      text: "Receive instant AI analysis with strengths, areas for improvement, and actionable tips to improve your performance.",
      image: "/assets/img/Feedback_interview.png",
    },
  ];

  const handleCardClick = (id: number) => {
    setSelectedCard(id);
  };

  const selectedImage =
    guideSteps.find((step) => step.id === selectedCard)?.image ||
    guideSteps[0].image;

  return (
    <div id="guide" className="bg-gray-50 py-6">
      <Container>
        <h1 className="text-center text-4xl font-bold text-gray-800 mb-3">
          How InterviewAI Works
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Our simple three-step process helps you prepare for your next
          interview with <br />
          confidence.
        </p>
        <div className="flex flex-wrap gap-8 justify-between">
          <div className="flex flex-col gap-6 lg:w-1/3">
            {guideSteps.map((step) => (
              <Card
                key={step.id}
                onClick={() => handleCardClick(step.id)}
                onMouseEnter={() => setOnHover(step.id)}
                onMouseLeave={() => setOnHover(null)}
                className={`p-5 lg:p-7 rounded-lg shadow-lg hover:shadow-xl cursor-pointer transition-all flex items-center space-x-6 ${
                  selectedCard === step.id ? "bg-violet-200" : "bg-white"
                } ${onHover === step.id ? "bg-violet-200" : ""}`}>
                <CardTitle
                  className={`p-6 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-md ${
                    selectedCard === step.id
                      ? "bg-fuchsia-500"
                      : " bg-purple-500"
                  } ${onHover === step.id ? "bg-fuchsia-500" : ""}`}>
                  {step.id}
                </CardTitle>
                <CardDescription className="text-md text-black">
                  {step.text}
                </CardDescription>
              </Card>
            ))}
          </div>
          <div className="lg:w-1/2 w-full flex items-center justify-center">
            <div className="w-full h-[470px]">
              <img
                src={selectedImage}
                alt="Guide Step Preview"
                className="w-full h-full rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-center text-2xl font-semibold mb-6">
            Why Choose InterviewAI?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {chooseInterviewAi.map((res) => (
              <Card
                key={res.id}
                className="flex items-center gap-4 p-4 bg-white shadow-md w-full md:w-1/3">
                <CircleCheckBigIcon className="text-violet-700 w-6 h-6" />
                <CardDescription className="text-md text-black">
                  {res.text}
                </CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Guide;