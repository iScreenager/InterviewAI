import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "react-circular-progressbar/dist/styles.css";
import { ToasterProvider } from "./provider/toast-provider.tsx";
import { AuthProvider } from "./context/auth-context.tsx";
import { MediaPermissionsProvider } from "./context/media-permissions-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <MediaPermissionsProvider>
        <App />
      </MediaPermissionsProvider>
    </AuthProvider>
    <ToasterProvider />
  </StrictMode>
);
