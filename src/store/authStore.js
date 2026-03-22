import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api }     from '../utils/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user:  null,
      token: null,

      async login(username, password) {
        try {
          const res = await api.post('/auth/login', { username, password })
          set({ isAuthenticated: true, user: res.user, token: res.token })
          return { ok: true }
        } catch (err) {
          return { ok: false, message: err.message }
        }
      },

      logout() {
        set({ isAuthenticated: false, user: null, token: null })
      },
    }),
    { name: 'pilar-auth' }
  )
)
