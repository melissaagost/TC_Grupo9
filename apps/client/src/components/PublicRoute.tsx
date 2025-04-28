import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { token } = useAuth();

  if (token) {
    // Ya estoy logueado, me voy al home
    return <Navigate to="/" replace />;
  }

  // No estoy logueado, puedo ver el login
  return children;
};

export default PublicRoute;
