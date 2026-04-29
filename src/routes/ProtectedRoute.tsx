import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const currentUser = localStorage.getItem("currentUser");

  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
