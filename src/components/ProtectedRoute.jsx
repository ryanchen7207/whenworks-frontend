import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container" style={{ padding: "40px 24px" }}>Loading…</div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}
