import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItems?: { link: string; label: string }[];
}

export const CustomBreadCrumb = ({
  breadCrumbPage,
  breadCrumbItems,
}: CustomBreadCrumbProps) => {
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    navigate(url, { replace: true });
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            // href="/"
            onClick={() => handleNavigation("/")}
            className="flex items-center justify-center hover:text-emerald-500">
            <Home className="w-3 h-3 mr-2" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItems &&
          breadCrumbItems.map((item, i) => (
            <React.Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href={item.link}
                  onClick={() => handleNavigation(item.link)}
                  className="hover:text-emerald-500">
                  {item.label}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
