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
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000)

        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            signal: controller.signal
          })

          clearTimeout(timeoutId)
          const text = await res.text()

          if (!res.ok) {
            let message = 'Username atau password salah'
            try {
              const errData = JSON.parse(text)
              if (errData.message) message = errData.message
            } catch {}
            return { ok: false, message }
          }

          const data = JSON.parse(text)
          set({ isAuthenticated: true, user: data.user, token: data.token })
          return { ok: true }
        } catch (err) {
          clearTimeout(timeoutId)
          console.error('Login error:', err)
          
          let message = 'Gagal terhubung ke server'
          if (err.name === 'AbortError') {
            message = 'Server terlalu lama merespons. Silakan coba lagi.'
          } else if (err.message.includes('Failed to fetch')) {
            message = 'Koneksi internet bermasalah atau server sedang down.'
          } else {
            message += ': ' + err.message
          }
          
          return { ok: false, message }
        }
      },

      logout() {
        set({ isAuthenticated: false, user: null, token: null })
      },
    }),
    { name: 'pilar-auth' }
  )
)
