import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { validateToken } from "./utils/authUtils";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import PersonalDetails from "./PersonalDetails";
import Attendance from "./Attendance";
import FeePayment from "./FeePayment";
import InternalMarks from "./InternalMarks";
import Grade from "./Grade";
import WIP from "./WIP";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      if (!token || !user) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }
      setIsAuthenticated(null);
      setIsLoading(true);
      const valid = await validateToken();
      setIsAuthenticated(valid);
      setIsLoading(false);
    };

    checkAuthentication();

    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === "authToken" || e.key === "user") {
        checkAuthentication();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (isLoading || isAuthenticated === null) {
    return <></>;
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-details"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <PersonalDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance-details"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee-payment"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FeePayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internal-marks"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <InternalMarks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wip"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-list"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/grade"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Grade />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abc-entry"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-hallticket"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summer-term-registration"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scribe-request"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revaluation-registration"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transcript"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/name-change"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community-certificate"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-insight"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-feedback"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <WIP />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
