import { Outlet } from "react-router-dom";

export const Generate = () => {
  return (
    <div className=" md:px-12 min-h-screen flex flex-col">
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};
