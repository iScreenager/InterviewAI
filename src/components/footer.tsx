import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";

const Footer = () => {
  return (
    <footer className="w-full  border-t bg-white">
      <Container className="flex flex-wrap items-center justify-center md:justify-between text-center md:text-left gap-4">
        
        <div className="flex flex-col items-center md:items-start">
          <LogoContainer />
          <p className="text-sm text-gray-600">
            Your AI-powered interview partner.
          </p>
        </div>

       
        <div className="text-sm text-gray-600">
          © {new Date().getFullYear()} InterviewAI. All rights reserved.
        </div>

       
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-600 transition text-xl">
            <FaTwitter />
          </a>
          <a
            href="https://www.linkedin.com/in/vaishnavi-rastogi-104501194/"
            className="hover:text-gray-600 transition text-xl">
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/iScreenager"
            className="hover:text-gray-600 transition text-xl">
            <FaGithub />
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
