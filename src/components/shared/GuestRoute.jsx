import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
