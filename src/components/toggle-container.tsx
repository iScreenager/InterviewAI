import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { NavigationRoutes } from "./navigation-routes";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export const ToggleContainer = () => {
  const { user } = useContext(AuthContext);
  return (
    <Sheet>
      <SheetTrigger className="block md:hidden">
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>

        <nav className="gap-8 flex flex-col items-start">
          <NavigationRoutes isMobile />
          {user && (
            <NavLink
              to={"/generate"}
              className={({ isActive }) =>
                cn(
                  "text-base text-neutral-600 ",
                  isActive && "text-neutral-900 font-semibold"
                )
              }>
              Take An Interview
            </NavLink>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
