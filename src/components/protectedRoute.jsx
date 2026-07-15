import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

// Guards the app routes: only logged-in users get past this point.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
