import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard, Users, Gift,
  CreditCard, FileText, LogOut, X,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/anggota',    icon: Users,            label: 'Anggota'         },
  { to: '/paket',      icon: Gift,             label: 'Paket Lebaran'   },
  { to: '/pembayaran', icon: CreditCard,       label: 'Pembayaran'      },
  { to: '/laporan',    icon: FileText,         label: 'Laporan'         },
]

export default function Sidebar({ open, onClose }) {
  const logout   = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-brown-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-60 bg-cream-50
        border-r border-gold-200/40 flex flex-col
        transition-transform duration-300 lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gold-200/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-btn flex items-center justify-center shadow-gold flex-shrink-0">
              {/* Ketupat icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
                <polygon points="12,2 22,12 12,22 2,12" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(255,255,255,0.55)" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="2.5" fill="white" opacity="0.9" stroke="none" />
              </svg>
            </div>
            <div>
              <p className="font-display text-lg font-bold text-brown-700 leading-none">Pilar</p>
              <p className="text-[10px] font-medium tracking-widest text-brown-100 uppercase">Paket Lebaran</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 text-brown-300 hover:text-brown-700">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                 ${isActive
                   ? 'bg-gold-btn text-white shadow-gold'
                   : 'text-brown-300 hover:bg-cream-200 hover:text-brown-700'
                 }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gold-200/40">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium
                       text-brown-300 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut size={17} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  )
}
