import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // If the AuthProvider is still checking cookies/localStorage, show nothing or a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  // If no user, kick them to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the child component (the protected page)
  return <Outlet />;
}
