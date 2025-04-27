import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowedUserTypes?: number[];
}

const PrivateRoute = ({ children, redirectTo = "/auth", allowedUserTypes }: PrivateRouteProps) => {
  const { token, userType } = useAuth();

  if (!token) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType!)) {
    return <Navigate to="/" replace />; // o a /unauthorized
  }

  return children;
};

export default PrivateRoute;
