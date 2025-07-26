import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "./layouts/public-layout";
import AuthenticationLayout from "./layouts/auth-layout";
import MainLayout from "./layouts/main-layout";
import ProtectRoutes from "./layouts/protected-routes";

import HomePage from "./routes/home";
import SignInPage from "./routes/sing-in";
import SignUpPage from "./routes/sing-up";
import Dashboard from "./routes/dashboard";
import CreateEditPage from "./routes/create-edit-page";
import PreInterviewPermissions from "./routes/pre-interview-permissions";
import Feedback from "./routes/feedback";
import Generate from "./components/generate";
import Guide from "./components/guide";
import AboutPage from "./components/aboutPage";

import { useAuth } from "./hooks/useAuth";
import { PracticeInterviewPage } from "./routes/practice-interview-page";

const App = () => {
  useAuth({ fetchOnLoad: true });

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/about" element={<AboutPage />} />
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
          }>
          <Route element={<Generate />} path="/generate">
            <Route index element={<Dashboard />} />
            <Route path="create" element={<CreateEditPage />} />
            <Route path="edit/:interviewId" element={<CreateEditPage />} />
            <Route
              path="interview/:interviewId"
              element={<PreInterviewPermissions />}
            />
            <Route
              path="interview/:interviewId/start/:questionIndex"
              element={<PracticeInterviewPage />}
            />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
