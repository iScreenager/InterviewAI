import { cn } from "@/lib/utils";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header
      className={cn(
        "w-full h-20 border-b fixed top-0 left-0 z-50 bg-white shadow-md"
      )}>
      <Container>
        <div className="flex items-center gap-4">
          <LogoContainer />

          <nav className="hidden md:flex items-center gap-3 ">
            <NavigationRoutes />
            {user && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-900 bg-violet-200 py-1 px-2 rounded-xl",
                    isActive && "text-neutral-900 font-semibold"
                  )
                }>
                Take An Interview
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-6">
            <ProfileContainer />
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
