
import About from "@/components/Home/about";
import  Guide  from "@/components/Home/guide";
import { Hero } from "@/components/Home/hero";

const HomePage = () => {
  return (
    <div id="home" className="flex-col w-full mt-5 ">
      <Hero />
      <Guide />
      <About />
     
    </div>
  );
};

export default HomePage;
