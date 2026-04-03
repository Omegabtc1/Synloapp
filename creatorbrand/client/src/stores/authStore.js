import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../services/api'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: false,
      error: null,

      signup: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/api/auth/signup', data)
          set({ user: res.data.user, profile: res.data.profile, isLoading: false })
          return res.data
        } catch (err) {
          set({ error: err.response?.data?.error || 'Signup failed', isLoading: false })
          throw err
        }
      },

      login: async (data) => {
        set({ isLoading: true, error: null })
        try {
          const res = await api.post('/api/auth/login', data)
          set({ user: res.data.user, profile: res.data.profile, isLoading: false })
          return res.data
        } catch (err) {
          set({ error: err.response?.data?.error || 'Login failed', isLoading: false })
          throw err
        }
      },

      logout: async () => {
        await api.post('/api/auth/logout')
        set({ user: null, profile: null })
      },

      fetchMe: async () => {
        try {
          const res = await api.get('/api/auth/me')
          set({ user: res.data?.user ?? null, profile: res.data?.profile ?? null })
        } catch {
          set({ user: null, profile: null })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'creatorbrand-auth',
      partialize: (state) => ({ user: state.user, profile: state.profile })
    }
  )
)
