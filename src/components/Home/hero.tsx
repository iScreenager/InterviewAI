import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext, useState, useEffect } from "react";
import { FaArrowRight, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Hero = () => {
  const { user } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white flex items-center">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 pb-20">
          <div
            className={`text-center lg:text-left w-full lg:w-1/2 space-y-4 transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-gray-800">Ace Your Next</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Job Interview
                </span>
              </h1>
            </div>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Master job interviews with our AI-powered platform. Practice with
              role-specific questions, get instant feedback, and receive expert
              tips to boost your confidence and land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              {user ? (
                <>
                  <Link to="/dashboard">
                    <Button className="group px-8 py-4 text-white font-semibold text-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      <span className="flex items-center">
                        Go to Dashboard
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </Button>
                  </Link>
                  <Link to="/create">
                    <Button
                      variant="outline"
                      className="group px-8 py-4 text-lg rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <span className="flex items-center">
                        Start New Interview
                        <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/signin">
                    <Button className="group px-8 py-4 text-white font-semibold text-lg rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                      <span className="flex items-center">
                        Start Free Interview
                        <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </Button>
                  </Link>
                  <Link to="#guide">
                    <Button
                      onClick={() => {
                        const element = document.getElementById("guide");
                        if (element) {
                          element.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                            inline: "nearest",
                          });
                        }
                      }}
                      variant="outline"
                      className="group px-8 py-4 text-lg rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    >
                      <span className="flex items-center">
                        See How It Works
                        <FaChevronRight className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="relative w-full lg:w-1/2">
            <div className="relative z-10">
              <div className="relative rounded-3xl overflow-hidden">
                <img
                  src="/assets/img/hero.jpg"
                  alt="InterviewAI Hero"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
