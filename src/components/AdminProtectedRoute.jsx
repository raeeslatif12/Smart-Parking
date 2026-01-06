import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (user?.role !== 'super_admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminProtectedRoute;
