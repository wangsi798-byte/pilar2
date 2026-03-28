import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const API_BASE = 'https://pilar-api-cye9.vercel.app/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user:  null,
      token: null,

      async login(username, password) {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })

          const text = await res.text()

          if (!res.ok) {
            let message = 'Username atau password salah'
            try {
              const errData = JSON.parse(text)
              if (errData.message) message = errData.message
            } catch {}
            return { ok: false, message }
          }

          if (!text) {
            return { ok: false, message: 'Server tidak merespons' }
          }

          const data = JSON.parse(text)
          set({ isAuthenticated: true, user: data.user, token: data.token })
          return { ok: true }
        } catch (err) {
          console.error('Login error:', err)
          return { ok: false, message: 'Gagal terhubung ke server: ' + err.message }
        }
      },

      logout() {
        set({ isAuthenticated: false, user: null, token: null })
      },
    }),
    { name: 'pilar-auth' }
  )
)
