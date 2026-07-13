import { Navigate } from "react-router-dom";

// Placeholder auth guard. Swap `isAuthenticated` for real auth state
// (e.g. from context or a token check) once the backend is connected.
export default function ProtectedRoute({ children }) {
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
