import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "sonner";
import { QueryProvider } from "./provider/QueryClientProvider.tsx";
import SyncCartLayer from "./provider/SyncCartLayer.tsx";
createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <QueryProvider>
      <Toaster />
      <AuthProvider>
        <SyncCartLayer>
          <App />
        </SyncCartLayer>
      </AuthProvider>
    </QueryProvider>
  </HelmetProvider>
);
