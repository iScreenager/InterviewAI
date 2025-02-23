import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/clerk-react";
import { Container } from "./container";
import { LogoContainer } from "./logo-container";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { ProfileContainer } from "./profile-container";
import { ToggleContainer } from "./toggle-container";

const Header = () => {
  const { userId } = useAuth();
  return (
    <header
      className={cn(
        "w-full h-20 border-b duration-150 transition-all ease-in-out"
      )}>
      <Container>
        <div className="flex items-center w-full justify-between">
          <LogoContainer />

          <nav className="hidden md:flex items-center gap-3">
            <NavigationRoutes />
            {userId && (
              <NavLink
                to={"/generate"}
                className={({ isActive }) =>
                  cn(
                    "text-base text-neutral-600",
                    isActive && "text-neutral-900 font-semibold"
                  )
                }>
                Take An Interview
              </NavLink>
            )}
          </nav>

          <div className=" flex items-center gap-4 justify-between">
            <ProfileContainer />
            <ToggleContainer />
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
