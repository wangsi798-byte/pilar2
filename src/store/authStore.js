import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api }     from '../utils/api'

const DIRECT_API = 'https://pilar-api-cye9.vercel.app/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user:  null,
      token: null,

      async login(username, password) {
        try {
          console.log('Login attempt:', username)
          const res = await fetch(`${DIRECT_API}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          })
          const data = await res.json()
          console.log('Login response:', data)
          
          if (!res.ok) {
            return { ok: false, message: data.message || 'Login failed' }
          }
          
          set({ isAuthenticated: true, user: data.user, token: data.token })
          return { ok: true }
        } catch (err) {
          console.error('Login error:', err)
          return { ok: false, message: err.message || 'Network error' }
        }
      },

      logout() {
        set({ isAuthenticated: false, user: null, token: null })
      },
    }),
    { name: 'pilar-auth' }
  )
)
