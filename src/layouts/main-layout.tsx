import { Container } from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#EAEFF5] ">
      <Header />
      <Container className="overflow-auto flex-1 mt-32  ">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};

export default MainLayout;
