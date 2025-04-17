// AdminRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This component ensures only admin users can access certain routes
function AdminRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Only let admin users pass through
  if (isAuthenticated && isAdmin) {
    return <Outlet />;
  }
  
  // Redirect non-admin users to login
  return <Navigate to="/auth" replace />;
}

export default AdminRoute;