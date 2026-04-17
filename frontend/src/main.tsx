import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./lib/AuthContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "./lib/SocketContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
    <Toaster
      position="bottom-right"
      gutter={10}
      containerClassName="toast"
      toastOptions={{
        duration: 4000,

        success: {
          style: {
            color: "#fff",
            backgroundColor: "rgb(34 197 94)",
            fontWeight: "semibold",
          },
        },
        error: {
          style: {
            color: "#fff",
            backgroundColor: "rgb(239 68 68)",
            fontWeight: "semibold",
          },
        },
      }}
    />
  </StrictMode>,
);
