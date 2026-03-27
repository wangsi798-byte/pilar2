import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api }     from '../utils/api'

const DIRECT_API = '' // Use relative URL for Vercel proxy

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user:  null,
      token: null,

      async login(username, password) {
        try {
          console.log('Login attempt to:', DIRECT_API + '/auth/login')
          const res = await fetch(`${DIRECT_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
          console.log('Response status:', res.status)
          console.log('Response headers:', [...res.headers.entries()])
          
          const text = await res.text()
          console.log('Response text:', text || '(empty)')
          
          if (!res.ok) {
            return { ok: false, message: 'Username atau password salah' }
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
