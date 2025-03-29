import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { PublicLayout } from "./layouts/public-layout";
import HomePage from "./routes/home";

import AuthenticationLayout from "./layouts/auth-layout";
import SignInPage from "./routes/sing-in";
import SignUpPage from "./routes/sing-up";

import ProtectRoutes from "./layouts/protected-routes";
import { MainLayout } from "./layouts/main-layout";
import { Generate } from "./components/generate";
import { Dashboard } from "./routes/dashboard";
import { CreateEditPage } from "./routes/create-edit-page";
import { MockLoadPage } from "./routes/mock-load-page";
import { MockInterviewPage } from "./routes/mock-interview-page";
import { Feedback } from "./routes/feedback";
import { useAuth } from "./hooks/useAuth";
import { CommingSoon } from "./components/comming-soon";
import { Guide } from "./components/guide";
import { About } from "./components/About";

const App = () => {
  useAuth({ fetchOnLoad: true });
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index path="/" element={<HomePage />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/about" element={<About />} />
          <Route path="/Q&A" element={<CommingSoon />} />
          <Route path="/contact" element={<CommingSoon />} />
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
            <Route index element={<Dashboard />}></Route>
            <Route path="create" element={<CreateEditPage />} />
            <Route path="edit/:interviewId" element={<CreateEditPage />} />
            <Route path="interview/:interviewId" element={<MockLoadPage />} />
            <Route
              path="interview/:interviewId/start"
              element={<MockInterviewPage />}
            />
            <Route path="feedback/:interviewId" element={<Feedback />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
