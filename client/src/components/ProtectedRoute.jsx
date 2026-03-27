import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const FullPageLoader = () => (
  <div className="min-h-screen bg-gradient-to-b from-slate-100 to-amber-50 flex items-center justify-center">
    <div className="text-center">
      <p className="text-lg font-semibold text-slate-700">Loading your profile...</p>
      <p className="text-sm text-slate-500 mt-1">One moment please</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
