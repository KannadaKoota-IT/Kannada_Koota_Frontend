import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/admin-login" replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("adminToken"); // Clean up expired token
      return <Navigate to="/admin-login" replace />;
    }
  } catch (err) {
    localStorage.removeItem("adminToken"); // Handle malformed tokens
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
