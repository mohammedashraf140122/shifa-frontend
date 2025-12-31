import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import MainLayout from "../../ui/layout/mainlayout.jsx";
import { isAuthenticated } from "../../core/utils/auth.js";

export default function ProtectedLayout() {
  const [authenticated, setAuthenticated] = useState(null); // null = checking, true/false = result

  useEffect(() => {
    // Check authentication in useEffect to avoid render loop
    setAuthenticated(isAuthenticated());
  }, []);

  // Show nothing while checking
  if (authenticated === null) {
    return null; // or a loading spinner
  }

  // Redirect if not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout />;
}
