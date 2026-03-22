import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const USERS = [
  { username: 'admin',    password: 'pilar2025', role: 'Admin',    nama: 'Administrator' },
  { username: 'operator', password: 'op1234',    role: 'Operator', nama: 'Operator' },
]

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      user:  null,
      token: null,

      async login(username, password) {
        // Simulasi network delay
        await new Promise(r => setTimeout(r, 800))

        const found = USERS.find(u => u.username === username && u.password === password)

        if (found) {
          const { password: _, ...user } = found
          set({
            isAuthenticated: true,
            user,
            token: 'mock-jwt-token-' + Math.random().toString(36).substring(7)
          })
          return { ok: true }
        }

        return { ok: false, message: 'Username atau password salah.' }
      },

      logout() {
        set({ isAuthenticated: false, user: null, token: null })
      },
    }),
    { name: 'pilar-auth' }
  )
)
