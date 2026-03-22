import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { Eye, EyeOff, User, Lock, AlertCircle } from 'lucide-react'
import KetupatHero from '../components/ui/KetupatHero'

export default function Login() {
  const navigate = useNavigate()
  const login    = useAuthStore(s => s.login)

  const [form,    setForm]    = useState({ username: '', password: '' })
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [errors,  setErrors]  = useState({})

  function validate() {
    const e = {}
    if (!form.username.trim()) e.username = 'Username wajib diisi'
    if (!form.password)        e.password = 'Password wajib diisi'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setError('')
    if (!validate()) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    const result = login(form.username.trim(), form.password)
    setLoading(false)

    if (result.ok) navigate('/dashboard', { replace: true })
    else setError(result.message)
  }

  const field = (key) => ({
    value: form[key],
    onChange: e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(v => ({ ...v, [key]: '' })) },
  })

  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_440px]">

      {/* ── LEFT PANEL ── */}
      <section className="relative bg-panel-l diamond-bg overflow-hidden
                           flex flex-col items-center justify-center
                           p-10 lg:p-16 min-h-[260px]">
        {/* centre glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,255,255,.50) 0%, transparent 70%)' }} />

        {/* divider line between panels */}
        <div className="hidden lg:block absolute right-0 top-[8%] bottom-[8%] w-px
                        bg-gradient-to-b from-transparent via-gold-300/40 to-transparent" />

        <div className="relative z-10 text-center w-full max-w-md">
          <div className="inline-flex items-center gap-2 bg-white/65 backdrop-blur-sm
                          border border-gold-400/30 rounded-full px-4 py-1.5
                          text-[11px] font-medium tracking-[.09em] uppercase text-gold-700 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 inline-block" />
            Sistem Informasi Paket Lebaran
          </div>

          <h1 className="font-display text-4xl lg:text-5xl font-semibold text-brown-700
                         leading-[1.1] mb-3">
            Kelola <em className="italic text-gold-600">Paket</em><br />
            Lebaran dengan<br />
            Elegan
          </h1>

          <p className="text-[13px] tracking-[.18em] uppercase text-brown-300 font-light mb-10">
            Transparan &middot; Terpercaya
          </p>

          {/* Illustration */}
          <div className="relative h-[260px] lg:h-[300px]">
            <KetupatHero />
          </div>
        </div>
      </section>

      {/* ── RIGHT PANEL ── */}
      <main className="bg-cream-50 flex items-center justify-center p-8 lg:p-10">
        <div className="w-full max-w-[340px] text-center">

          {/* Logo */}
          <div className="animate-rise-in stagger-1 flex items-center justify-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gold-btn shadow-gold flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinejoin="round">
                <polygon points="12,2 22,12 12,22 2,12" />
                <line x1="2" y1="12" x2="22" y2="12" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
                <line x1="12" y1="2" x2="12" y2="22" stroke="rgba(255,255,255,.55)" strokeWidth="1.2" />
                <circle cx="12" cy="12" r="2.5" fill="white" opacity=".9" stroke="none" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-display text-[22px] font-bold text-brown-700 leading-none">Pilar</p>
              <p className="text-[10px] font-medium tracking-[.10em] text-brown-100 uppercase mt-0.5">Paket Lebaran</p>
            </div>
          </div>

          {/* Heading */}
          <h2 className="animate-rise-in stagger-2 font-display text-[2rem] font-semibold text-brown-700 leading-tight mb-1">
            Selamat Datang
          </h2>
          <p className="animate-rise-in stagger-3 text-sm font-light text-brown-300 mb-8">
            Masuk ke akun Anda untuk melanjutkan
          </p>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5
                            text-[13px] text-red-700 animate-rise-in">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">

            {/* Username */}
            <div className="animate-rise-in stagger-4">
              <label className="input-label">Username</label>
              <div className="relative">
                <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100
                                           peer-focus:text-gold-500 pointer-events-none" />
                <input
                  {...field('username')}
                  type="text" autoComplete="username" spellCheck="false"
                  placeholder="Masukkan username Anda"
                  className={`input input-icon-left peer ${errors.username ? 'input-error' : ''}`}
                />
              </div>
              {errors.username && <p className="text-[11.5px] text-red-600 mt-1">{errors.username}</p>}
            </div>

            {/* Password */}
            <div className="animate-rise-in stagger-5">
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brown-100 pointer-events-none" />
                <input
                  {...field('password')}
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  className={`input input-icon-left pr-11 ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-brown-100
                             hover:text-gold-600 transition-colors"
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p className="text-[11.5px] text-red-600 mt-1">{errors.password}</p>}
            </div>

            {/* Options */}
            <div className="animate-rise-in stagger-5 flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded accent-gold-500" />
                <span className="text-[13px] text-brown-300">Ingat saya</span>
              </label>
              <a href="#" className="text-[13px] font-medium text-gold-600 hover:text-gold-700 transition-colors">
                Lupa password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="animate-rise-in stagger-6 btn-shimmer w-full h-[52px] rounded-xl
                         bg-gold-btn text-white font-semibold text-[15px] tracking-wide
                         shadow-gold hover:shadow-gold-lg hover:-translate-y-0.5
                         active:translate-y-0 transition-all duration-200
                         disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Masuk Sekarang'
              }
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-[12px] text-brown-100 animate-rise-in stagger-6">
            © 2025 Pilar &middot; Versi 1.0
          </p>
        </div>
      </main>
    </div>
  )
}
