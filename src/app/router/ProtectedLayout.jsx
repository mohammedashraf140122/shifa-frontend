import { Navigate } from "react-router-dom";
import MainLayout from "../../ui/layout/mainlayout.jsx";
import { isAuthenticated } from "../../core/utils/auth.js";

export default function ProtectedLayout() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <MainLayout />;
}
