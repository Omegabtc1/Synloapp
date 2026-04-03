import { create } from 'zustand'
import api from '../services/api'

export const useWaitlistStore = create((set) => ({
  creators: 100,
  brands: 5,
  total: 105,
  isLoading: false,
  joined: false,

  fetchCounts: async () => {
    try {
      const res = await api.get('/api/waitlist/count')
      set(res.data)
    } catch {}
  },

  join: async (data) => {
    set({ isLoading: true })
    try {
      const res = await api.post('/api/waitlist/join', data)
      set({ ...res.data.counts, joined: true, isLoading: false })
      return res.data
    } catch (err) {
      set({ isLoading: false })
      throw err
    }
  },

  setFromSocket: (counts) => set(counts)
}))

