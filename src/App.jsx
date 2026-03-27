import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout     from './components/layout/Layout'
import Login      from './pages/Login'
import Dashboard  from './pages/Dashboard'
import Anggota    from './pages/Anggota'
import Paket      from './pages/Paket'
import Pembayaran from './pages/Pembayaran'
import Laporan    from './pages/Laporan'
import NabungBebas from './pages/NabungBebas'

function ProtectedRoute({ children }) {
  const isAuth = useAuthStore(s => s.isAuthenticated)
  return isAuth ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"  element={<Dashboard />} />
          <Route path="anggota"    element={<Anggota />} />
          <Route path="paket"      element={<Paket />} />
          <Route path="pembayaran" element={<Pembayaran />} />
          <Route path="nabung-bebas" element={<NabungBebas />} />
          <Route path="laporan"    element={<Laporan />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
