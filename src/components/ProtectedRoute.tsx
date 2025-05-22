import { Navigate, Outlet } from 'react-router-dom'
import { useUserStore } from '../store/user'

export default function ProtectedRoute({ redirectPath = '/login' }: { redirectPath?: string }) {
  const user = useUserStore((s) => s.user)
  if (!user) {
    return <Navigate to={redirectPath} replace />
  }
  return <Outlet />
} 