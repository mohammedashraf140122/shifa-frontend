import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/router/AppRouter.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AlertsProvider } from "./modules/Alerts/alerts.store";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./core/utils/ErrorBoundary";
import "react-toastify/dist/ReactToastify.css";
import './css/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false, // Don't refetch on window focus
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AlertsProvider>
            <AppRouter />
            <ToastContainer 
              position="top-right" 
              autoClose={3000} 
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              limit={5}
              className="toast-container"
            />
          </AlertsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
