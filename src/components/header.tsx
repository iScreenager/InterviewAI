import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { ProfileContainer } from "./profile-container";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";
import { Link } from "react-router-dom";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="w-full py-6">
      <Container>
        <div className="flex items-center justify-between">
          <LogoContainer />

          <div className="flex items-center gap-6">
            {user ? (
              <ProfileContainer />
            ) : (
              <Link
                to="/signup"
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
