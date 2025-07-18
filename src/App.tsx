import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import { PublicLayout } from "./layouts/public-layout";
import AuthenticationLayout from "./layouts/auth-layout";
import MainLayout from "./layouts/main-layout";
import ProtectRoutes from "./layouts/protected-routes";

const HomePage = lazy(() => import("./routes/home"));
const SignInPage = lazy(() => import("./routes/sing-in"));
const SignUpPage = lazy(() => import("./routes/sing-up"));
const Dashboard = lazy(() => import("./routes/dashboard"));
const CreateEditPage = lazy(() => import("./routes/create-edit-page"));
const MockLoadPage = lazy(() => import("./routes/mock-load-page"));
const MockInterviewPage = lazy(() => import("./routes/mock-interview-page"));
const Feedback = lazy(() => import("./routes/feedback"));
const Generate = lazy(() => import("./components/generate"));
const Guide = lazy(() => import("./components/guide"));
const AboutPage = lazy(() => import("./components/aboutPage"));

import { useAuth } from "./hooks/useAuth";

const App = () => {
  useAuth({ fetchOnLoad: true });

  return (
    <Router>
      <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
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
              <Route path="interview/:interviewId" element={<MockLoadPage />} />
              <Route
                path="interview/:interviewId/start"
                element={<MockInterviewPage />}
              />
              <Route path="feedback/:interviewId" element={<Feedback />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
