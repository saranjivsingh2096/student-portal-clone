import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <img src="./images/wait.gif" alt="Loading..." />
        <p>Loading...</p>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};
