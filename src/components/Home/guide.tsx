import { Container } from "@/components/container";
import { useState } from "react";

interface GuideStep {
  id: number;
  title: string;
  text: string;
  image: string;
}

const Guide = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(1);

  const guideSteps: GuideStep[] = [
    {
      id: 1,
      title: "Setup Your Interview",
      text: "Enter your job role, description, and tech stack to generate a personalized mock interview experience.",
      image: "/assets/img/Create_interview.png",
    },
    {
      id: 2,
      title: "Practice & Answer",
      text: "Answer role-specific interview questions with our interactive interface. Use audio and video to practice as if it's a real interview.",
      image: "/assets/img/Que_interview.png",
    },
    {
      id: 3,
      title: "Get AI Feedback",
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
    <div id="guide" className="bg-white mb-20">
      <Container>
        <div className="text-center pt-2 mb-8">
          <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
            Our simple three-step process helps you prepare for your next
            interview with confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
         
          <div className="space-y-6">
            {guideSteps.map((step) => (
              <div
                key={step.id}
                onClick={() => handleCardClick(step.id)}
                className={`group cursor-pointer transition-all duration-300 ${
                  selectedCard === step.id ? "transform scale-105" : ""
                }`}
              >
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    selectedCard === step.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${
                        selectedCard === step.id
                          ? "bg-gradient-to-r from-blue-600 to-purple-600"
                          : "bg-gray-400 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500"
                      }`}
                    >
                      {step.id}
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                          selectedCard === step.id
                            ? "text-blue-700"
                            : "text-gray-800 group-hover:text-blue-600"
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

       
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src={selectedImage}
                alt="Guide Step Preview"
                className="w-full h-auto transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Guide;
