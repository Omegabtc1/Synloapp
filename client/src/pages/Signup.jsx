import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const NICHES = ['lifestyle', 'fashion', 'beauty', 'fitness', 'food', 'tech', 'gaming', 'travel', 'music', 'education', 'finance', 'comedy']
const INDUSTRIES = ['beauty', 'fashion', 'food & beverage', 'tech', 'health', 'outdoor', 'entertainment', 'finance', 'education']

export default function Signup() {
  const [role, setRole] = useState('CREATOR')
  const [form, setForm] = useState({ email: '', password: '', name: '', username: '', industry: '', niche: [] })
  const { signup, isLoading, error } = useAuthStore()
  const navigate = useNavigate()

  function toggleNiche(n) {
    setForm((p) => ({ ...p, niche: p.niche.includes(n) ? p.niche.filter((x) => x !== n) : [...p.niche, n] }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const data = await signup({ ...form, role })
      navigate(data.user.role === 'CREATOR' ? '/creator/dashboard' : '/brand/dashboard')
    } catch {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Join the creator economy platform</p>

        <div className="flex rounded-lg border overflow-hidden mb-6">
          {['CREATOR', 'BRAND'].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${role === r ? 'bg-brand-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              {r === 'CREATOR' ? 'I am a Creator' : 'I am a Brand'}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full border rounded-lg px-4 py-3 text-sm" placeholder={role === 'CREATOR' ? 'Your name' : 'Brand / company name'} value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <input className="w-full border rounded-lg px-4 py-3 text-sm" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <input className="w-full border rounded-lg px-4 py-3 text-sm" type="password" placeholder="Password (8+ chars)" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />

          {role === 'CREATOR' && (
            <>
              <input className="w-full border rounded-lg px-4 py-3 text-sm" placeholder="Username (e.g. alex.creates)" value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/\s/g, '') }))} required />
              <div>
                <p className="text-xs text-gray-500 mb-2">Your niches (select all that apply)</p>
                <div className="flex flex-wrap gap-2">
                  {NICHES.map((n) => (
                    <button type="button" key={n} onClick={() => toggleNiche(n)} className={`px-3 py-1 rounded-full text-xs border transition-colors ${form.niche.includes(n) ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 text-gray-600 hover:border-brand-500'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {role === 'BRAND' && (
            <select className="w-full border rounded-lg px-4 py-3 text-sm" value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </select>
          )}

          <button className="w-full bg-brand-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account? <Link to="/login" className="text-brand-500">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

