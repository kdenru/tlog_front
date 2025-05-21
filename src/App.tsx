import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, textAlign: 'center' }}>
          Start page
        </div>
      } />
    </Routes>
  )
}
