import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";
import { PulseProvider } from "@/react-app/contexts/PulseContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PulseProvider>
      <App />
    </PulseProvider>
  </StrictMode>
);
