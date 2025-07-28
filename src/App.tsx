import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "./layouts/public-layout";
import AuthenticationLayout from "./layouts/auth-layout";
import MainLayout from "./layouts/main-layout";
import ProtectRoutes from "./layouts/protected-routes";

import HomePage from "./routes/home";
import SignInPage from "./routes/sing-in";
import SignUpPage from "./routes/sing-up";
import Dashboard from "./routes/dashboard";
import PreInterviewPermissions from "./routes/pre-interview-permissions";
import Feedback from "./routes/feedback";
import Generate from "./components/generate";
import Guide from "./components/Home/guide";

import { useAuth } from "./hooks/useAuth";
import { PracticeInterviewPage } from "./routes/practice-interview-page";
import { InterviewProvider } from "./context/interview-context";
import About from "./components/Home/about";
import SetupInterview from "./routes/setup-interview";

const App = () => {
  useAuth({ fetchOnLoad: true });

  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route element={<AuthenticationLayout />}>
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        <Route
          element={
            <ProtectRoutes>
              <InterviewProvider>
                <MainLayout />
              </InterviewProvider>
            </ProtectRoutes>
          }>
          <Route element={<Generate />} path="/">
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="create" element={<SetupInterview />} />
            {/* <Route path="edit/:interviewId" element={<SetupInterview />} /> */}
            <Route
              path="interview/:interviewId"
              element={<PreInterviewPermissions />}
            />
            <Route
              path="interview/:interviewId/start"
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
