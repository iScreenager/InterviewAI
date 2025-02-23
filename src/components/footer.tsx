import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Container } from "./container";
const Footer = () => {
  return (
    <footer className="w-full py-2 absolute bottom-0 border-t">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">InterviewAI</h2>
            <p className=" text-sm">Your AI-powered interview partner.</p>
          </div>

          <div className="text-center  text-sm mt-4">
            © {new Date().getFullYear()} InterviewAI. All rights reserved.
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className=" hover:text-gray-600  transition text-xl">
              <FaTwitter />
            </a>
            <a href="#" className=" hover:text-gray-600 transition text-xl">
              <FaLinkedin />
            </a>
            <a href="#" className=" hover:text-gray-600 transition text-xl">
              <FaGithub />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
