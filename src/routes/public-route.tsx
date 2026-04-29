import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const currentUser = localStorage.getItem("currentUser");

  return currentUser ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;
