import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'
import { useAuth } from '../../context/AuthContext'
import { LoadingScreen } from '../ui/LoadingScreen'

export default function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingScreen />

  if (user) return <Navigate to="/app" replace />

  return <>{children}</>
}
