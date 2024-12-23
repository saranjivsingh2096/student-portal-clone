import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { validateToken } from "../utils/authUtils";

export const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      const isValid = await validateToken();
      setIsAuthenticated(isValid);
    };

    checkToken();
  }, []);

  if (isAuthenticated === null) {
    return;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};
