import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./app/router/AppRouter.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { AlertsProvider } from "./modules/Alerts/alerts.store";
import "react-toastify/dist/ReactToastify.css";
import './css/index.css'

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AlertsProvider>
        <AppRouter />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </AlertsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
