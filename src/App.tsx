import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "./layouts/public-layout";
import HomePage from "./routes/home";

import AuthenticationLayout from "./layouts/auth-layout";
import SignInPage from "./routes/sing-in";
import SignUpPage from "./routes/sing-up";

import ProtectRoutes from "./layouts/protected-routes";
import { MainLayout } from "./layouts/main-layout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route element={<AuthenticationLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route
          element={
            <ProtectRoutes>
              <MainLayout />
            </ProtectRoutes>
          }></Route>
      </Routes>
    </Router>
  );
};

export default App;
