import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
  redirectTo?: string;
  allowedUserTypes?: number[]; // Ej: [1, 2] para Admin y Mozo
}

const PrivateRoute = ({ children, redirectTo = "/auth", allowedUserTypes }: PrivateRouteProps) => {
  const { token, userType } = useAuth();

  if (!token) {
    // si no esta log redirige login
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedUserTypes && !allowedUserTypes.includes(userType ?? -1)) {
    // está logueado pero no tiene permiso
    return <Navigate to="/" replace />; // quizas unauthorized
  }

  return <>{children}</>;
};

export default PrivateRoute;
