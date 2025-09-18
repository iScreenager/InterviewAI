import { Container } from "@/components/container";
import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#EAEFF5] ">
      <Container className="overflow-auto flex-1 mt-8">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
