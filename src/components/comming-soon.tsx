import { Link } from "react-router-dom";
import { Container } from "./container";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Button } from "./ui/button";
import { FaArrowRight } from "react-icons/fa";

export const CommingSoon = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className=" w-full h-[70svh] flex justify-center items-center ">
      <Container className="flex flex-col justify-center items-center">
        <img src="/assets/img/coming-soon.png" className="w-1/2" />
        <div className="mt-6">
          <Link to={user ? "/generate" : "/signin"}>
            <Button className="px-6 py-3 text-white ">
              Explore More <FaArrowRight />
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
