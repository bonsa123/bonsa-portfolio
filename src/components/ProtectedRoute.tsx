import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true'

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
