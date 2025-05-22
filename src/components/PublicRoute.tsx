import { useEffect, useState, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useUserStore } from '../store/user'

export default function PublicRoute() {
  const [loading, setLoading] = useState(true)
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)
  const checkedRef = useRef(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      setLoading(false)
      if (location.pathname === '/login') {
        navigate('/', { replace: true })
      }
      return
    }
    if (checkedRef.current) return
    checkedRef.current = true
    fetch('http://localhost:3000/me', {
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('not auth')
        return res.json()
      })
      .then((data) => {
        setUser(data)
        setLoading(false)
        if (location.pathname === '/login') {
          navigate('/', { replace: true })
        }
      })
      .catch(() => {
        setLoading(false)
      })
  }, [user, setUser, location, navigate])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (user && location.pathname === '/login') {
    return null
  }

  return <Outlet />
} 