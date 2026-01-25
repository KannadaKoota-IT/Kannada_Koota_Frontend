import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.replace("/admin-login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken"); // Clean up expired token
        router.replace("/admin-login");
        return;
      }
    } catch (err) {
      localStorage.removeItem("adminToken"); // Handle malformed tokens
      router.replace("/admin-login");
      return;
    }
  }, [router]);

  return children;
}
