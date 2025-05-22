import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import Rounds from './pages/Rounds'
import RoundPage from './pages/RoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Rounds />} />
          <Route path="/rounds/:id" element={<RoundPage />} />
        </Route>
        <Route path="*" element={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, textAlign: 'center' }}>404</div>} />
      </Route>
    </Routes>
  )
}
