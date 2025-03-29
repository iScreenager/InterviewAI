// import { About } from "@/components/about";
import { AboutPage } from "@/components/aboutPage";
import { Guide } from "@/components/guide";
import { Hero } from "@/components/hero";

const HomePage = () => {
  return (
    <div className="flex-col w-full pb-24 ">
      <Hero />
      <Guide />
      <AboutPage />
    </div>
  );
};

export default HomePage;
