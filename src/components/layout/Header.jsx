import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Menu, Bell } from 'lucide-react'

const ROUTE_LABELS = {
  '/dashboard':  { title: 'Dashboard',       sub: 'Ringkasan & aktivitas terkini' },
  '/anggota':    { title: 'Anggota',          sub: 'Kelola data anggota' },
  '/paket':      { title: 'Paket Lebaran',    sub: 'Atur pilihan paket' },
  '/pembayaran': { title: 'Pembayaran',       sub: 'Catat & pantau setoran' },
  '/laporan':    { title: 'Laporan',          sub: 'Rekap & cetak data' },
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const user         = useAuthStore(s => s.user)
  const { title, sub } = ROUTE_LABELS[pathname] ?? { title: 'Pilar', sub: '' }

  return (
    <header className="h-16 bg-cream-50 border-b border-gold-200/40 flex items-center px-5 gap-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 -ml-1 rounded-lg text-brown-300 hover:bg-cream-200 hover:text-brown-700 transition-colors"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-display text-lg font-semibold text-brown-700 leading-tight truncate">{title}</h1>
        {sub && <p className="text-xs text-brown-100 hidden sm:block">{sub}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg text-brown-300 hover:bg-cream-200 hover:text-brown-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gold-200 flex items-center justify-center shadow-gold text-brown-700 font-semibold text-sm flex-shrink-0">
            {user?.nama?.[0] ?? 'A'}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-medium text-brown-700 capitalize">{user?.nama ?? 'Admin'}</p>
            <p className="text-[11px] text-brown-100 capitalize">{user?.role ?? 'admin'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
