import { Link } from "react-router-dom";

export const LogoContainer = () => {
  return (
    <Link to={"/"}>
      <img src="/assets/img/logo/logo.png" className="w-48" />
    </Link>
  );
};
