import { Outlet } from "react-router-dom";
import Header from "@/components/header";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
    </div>
  );
};
