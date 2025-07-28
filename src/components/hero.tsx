import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";
import { FaArrowRight } from "react-icons/fa";

import { Link } from "react-router-dom";

export const Hero = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Container>
        <div className=" flex flex-col-reverse md:flex-row md:items-center justify-between gap-1 mt-5">
          <div className="text-center md:text-left w-full">
            <h2 className="md:text-left text-3xl md:text-5xl font-extrabold text-gray-700">
              Boost your
              <br className="hidden md:block" /> confidence,
              <br className="hidden md:block" /> ace the job interview
            </h2>

            <p className="mt-4 text-muted-foreground text-sm md:text-xl">
              Practice job interview questions based on your job role. Get
              instant AI feedback and expert tips to improve your answers.
            </p>
            <div className="mt-6">
              <Link to={user ? "/generate/create" : "/signin"}>
                <Button className="px-6 py-3 text-white font-semibold text-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition">
                  Start Free Interview <FaArrowRight />
                </Button>
              </Link>
            </div>
          </div>
          <div className="w-full ">
            <img src="/assets/img/hero.jpg" alt="" />
          </div>
        </div>
      </Container>
    </div>
  );
};
