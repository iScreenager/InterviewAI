import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MainRoutes } from "@/lib/helpers";
import { cn } from "@/lib/utils";

interface NavigationRoutesProps {
  isMobile?: boolean;
}

export const NavigationRoutes = ({
  isMobile = false,
}: NavigationRoutesProps) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", ""); // Extract section ID

      if (location.pathname !== "/") {
        navigate("/"); // Navigate to home first
        setTimeout(() => {
          document
            .getElementById(sectionId)
            ?.scrollIntoView({ behavior: "smooth" });
        }, 300);
      } else {
        document
          .getElementById(sectionId)
          ?.scrollIntoView({ behavior: "smooth" });
      }

      setActiveSection(sectionId); // Update active section
    } else {
      navigate(href);
      setActiveSection(null);
    }
  };

  return (
    <ul
      className={cn(
        "flex items-center gap-6",
        isMobile && "items-start flex-col gap-8"
      )}>
      {MainRoutes.map((route) => (
        <li key={route.href}>
          <button
            onClick={() => handleNavigation(route.href)}
            className={cn(
              "text-base text-neutral-600 hover:text-neutral-900",
              activeSection === route.href.replace("/#", "") && "font-bold"
            )}>
            {route.label}
          </button>
        </li>
      ))}
    </ul>
  );
};
