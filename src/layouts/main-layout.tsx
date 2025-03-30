import { Container } from "@/components/container";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Outlet } from "react-router-dom";

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <Container className="overflow-auto flex-1 mt-20 mb-10">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
};
