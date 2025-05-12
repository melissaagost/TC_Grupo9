import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
  redirectTo?: string
  allowedUserTypes?: string[] // Cambiamos number[] a string[]
}

const PrivateRoute = ({ children, redirectTo = '/auth', allowedUserTypes }: PrivateRouteProps) => {
  const { token, userType } = useAuth()

  if (!token) {
    // No está logueado → redirige al login
    return <Navigate to={redirectTo} replace />
  }

  if (
    allowedUserTypes &&
    (!userType || !allowedUserTypes.some(r => r.toLowerCase() === userType.toLowerCase()))
  ) {
    return <Navigate to="/" replace />;
  }

  console.log('userType desde contexto:', userType);

  return <>{children}</>
}

export default PrivateRoute
