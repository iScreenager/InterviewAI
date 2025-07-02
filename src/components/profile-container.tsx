import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useContext, useState } from "react";
import { AuthContext } from "@/context/auth-context";
import { User as UserIcon } from "lucide-react";
import { LogoutModal } from "./log-out";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase.config";

export const ProfileContainer = () => {
  const { user, setUser, setIsLoading, isLoading } = useContext(AuthContext);
  const [profileClick, setProfileClick] = useState(false);

  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("userData");
      auth.signOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.log("error while logout", error);
    }
    setIsLoading(false);
    setProfileClick(false);
  };

  return (
    <div className="flex items-center gap-6">
      {user ? (
        <div className="profile_header">
          <div
            className="profile cursor-pointer"
            onClick={() => setProfileClick(true)}>
            {user?.photoURL ? (
              <img
                src={user?.photoURL ?? ""}
                draggable="false"
                className="w-10 h-10 rounded-3xl "></img>
            ) : (
              <UserIcon />
            )}
          </div>
        </div>
      ) : (
        <Link to={"/signin"}>
          <Button size={"sm"}>Get Started</Button>
        </Link>
      )}
      {profileClick && (
        <LogoutModal
          isOpen={profileClick}
          isLoading={isLoading}
          onClose={() => setProfileClick(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
};
