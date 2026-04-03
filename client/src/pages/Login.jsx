import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await login(form)
      navigate(data.user.role === 'CREATOR' ? '/creator/dashboard' : '/brand/dashboard')
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            required
          />
          <input
            className="w-full border rounded-lg px-4 py-3 text-sm"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            required
          />
          <button
            className="w-full bg-brand-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          No account?{' '}
          <Link to="/signup" className="text-brand-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

