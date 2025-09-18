import Footer from "@/components/footer";
import Guide from "@/components/Home/guide";
import { Hero } from "@/components/Home/hero";
import { TrackProgress } from "@/components/Home/track-progress";

const HomePage = () => {
  return (
    <div id="home" className="flex-col w-full">
      <Hero />
      <Guide />
      <TrackProgress />
      <Footer />
    </div>
  );
};

export default HomePage;
