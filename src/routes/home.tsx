// import { About } from "@/components/about";
import { AboutPage } from "@/components/aboutPage";
import { ContactPage } from "@/components/contactPage";
import { Guide } from "@/components/guide";
import { Hero } from "@/components/hero";

const HomePage = () => {
  return (
    <div id="home" className="flex-col w-full mt-5 ">
      <Hero />
      <Guide />
      <AboutPage />
      <ContactPage />
    </div>
  );
};

export default HomePage;
