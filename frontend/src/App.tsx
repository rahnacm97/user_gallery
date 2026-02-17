import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { FRONTEND_ROUTES } from "./shared/constants/constants";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? <>{children}</> : <Navigate to={FRONTEND_ROUTES.LOGIN} />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path={FRONTEND_ROUTES.LOGIN} element={<Login />} />
          <Route path={FRONTEND_ROUTES.REGISTER} element={<Register />} />
          <Route
            path={FRONTEND_ROUTES.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
          <Route
            path={FRONTEND_ROUTES.RESET_PASSWORD}
            element={<ResetPassword />}
          />
          <Route
            path={FRONTEND_ROUTES.ROOT}
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
