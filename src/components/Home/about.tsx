import { Target, Users, Zap } from "lucide-react";
import { Container } from "../container";

 const About = () => {
  const aboutPoints = [
    {
      id: 1,
      icon: Users,
      title: "Who We Are",
      desc: "InterviewAI is founded by engineers to revolutionize interview preparation with AI-driven mock interviews and intelligent feedback.",
    },
    {
      id: 2,
      icon: Target,
      title: "Our Mission",
      desc: "We believe everyone deserves the opportunity to showcase their skills confidently. Our goal is to democratize access to high-quality interview preparation.",
    },
    {
      id: 3,
      icon: Zap,
      title: "What We Do",
      desc: "We combine industry-specific interview questions with AI-powered feedback to help you identify strengths and areas for improvement before your real interview.",
    },
  ];

  return (
    <div id="about" className="py-10">
      <Container>
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-2">
          About InterviewAI
        </h1>
        <p className="text-center text-lg text-gray-600">
          We're on a mission to help job seekers prepare for interviews with
          confidence.
        </p>
        <div className="grid gap-10 md:grid-cols-3 my-12">
          {aboutPoints.map((point) => (
            <div
              key={point.id}
              className="bg-white p-6 flex flex-col items-center text-center shadow-md rounded-lg">
              <div className="mb-4 p-4 bg-purple-100 text-purple-500 rounded-full">
                <point.icon size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-600 text-md">{point.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-violet-50 text-center p-4">
          <h1 className="mb-3 text-2xl font-medium text-gray-800">
            Our Vision
          </h1>
          <p className="text-lg text-gray-600">
            "To create a world where every job seeker walks into their interview
            with the confidence and <br />
            preparation they need to succeed."
          </p>
        </div>
      </Container>
    </div>
  );
};

export default About;