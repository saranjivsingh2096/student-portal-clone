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
import WIP from "./WIP";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const valid = await validateToken();
      setIsAuthenticated(valid);
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  if (isLoading) {
    return;
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
              <LoginPage />
            )
          }
        />

        {/* Default Route */}
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

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-details"
          element={
            <ProtectedRoute>
              <PersonalDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance-details"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee-payment"
          element={
            <ProtectedRoute>
              <FeePayment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wip"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-list"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/internal-marks"
          element={
            <ProtectedRoute>
              <InternalMarks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/abc-entry"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-hallticket"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summer-term-registration"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scribe-request"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/revaluation-registration"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transcript"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/name-change"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/community-certificate"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-insight"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-feedback"
          element={
            <ProtectedRoute>
              <WIP />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
