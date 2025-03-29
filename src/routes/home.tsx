
import { About } from "@/components/About";
import { Guide } from "@/components/guide";
import { Hero } from "@/components/hero";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24 ">
      <Hero />
      <Guide />
      <About />
    </div>
  );
};

export default HomePage;
