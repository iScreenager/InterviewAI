import { AuthContext } from "@/context/auth-context";
import { LoaderPage } from "@/routes/loader-page";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

const ProtectRoutes = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, user } = useContext(AuthContext);

  if (isLoading) {
    return <LoaderPage />;
  }

  if (!user) {
    return <Navigate to={"/signin"} replace />;
  }

  return children;
};

export default ProtectRoutes;
