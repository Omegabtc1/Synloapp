import axios from 'axios'

// In dev, leave VITE_API_URL empty in `.env` so requests use the Vite proxy (same origin as the UI).
// That avoids cookie/CORS quirks and still works when the API runs on :5000 behind the proxy.
const baseURL = (import.meta.env.VITE_API_URL || '').trim() || ''

const api = axios.create({
  baseURL,
  withCredentials: true
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const url = err.config?.url || ''
      // Never hard-redirect these: they legitimately return 401 when logged out or on bad credentials.
      // Redirecting here caused a full-page reload loop with `fetchMe()` on every public route.
      if (url.includes('/api/auth/me') || url.includes('/api/auth/login') || url.includes('/api/auth/signup')) {
        return Promise.reject(err)
      }
      if (window.location.pathname === '/login' || window.location.pathname === '/signup') {
        return Promise.reject(err)
      }
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

