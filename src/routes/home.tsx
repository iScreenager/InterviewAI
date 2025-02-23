import { Container } from "@/components/container";
import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24">
      <Container>
        <div className="my-8">
          <h2 className="text-31 text-center md:text-left md:text-6xl">
            <span className="text-outline font-extrabold md:text-8xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-extrabold md:text-8xl">
                InterviewAI
              </span>
            </span>
            <span className="text-gray-500 font-extrabold md:text-5xl">
              - The smarter way to
            </span>
            <br />
            improve your interview chances and skills.
          </h2>
          <p className="mt-4 text-muted-foreground text-sm">
            Boost your interview skills and success rate with AI-driven insights
            – prepare, practice, and stand out smarter.
          </p>
        </div>

        <div className="mt-6">
          <Link to={"/generate"} className="w-full">
            <button className="px-6 py-3 text-white font-semibold text-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition">
              Get Started
            </button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;
