import { useState } from 'react'
import { Link } from 'react-router-dom'
import LiveCounter from '../components/LiveCounter'
import { useWaitlistStore } from '../stores/waitlistStore'

const FEATURES_CREATOR = [
  { title: 'Track growth', desc: 'Instagram, TikTok, YouTube, Twitter — all in one view' },
  { title: 'Discover brands', desc: 'Browse active campaigns matched to your niche' },
  { title: 'Monetize influence', desc: 'Send collaboration requests and manage deals' }
]

const FEATURES_BRAND = [
  { title: 'Find creators', desc: 'Filter by niche, engagement rate, and audience size' },
  { title: 'Launch campaigns', desc: 'Create briefs, invite creators, track performance' },
  { title: 'Measure ROI', desc: 'Analytics-first tracking on every collaboration' }
]

export default function Landing() {
  const [form, setForm] = useState({ name: '', email: '', role: 'CREATOR' })
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const { join, isLoading } = useWaitlistStore()

  async function handleWaitlist(e) {
    e.preventDefault()
    setFormError('')
    try {
      await join(form)
      setSubmitted(true)
    } catch (err) {
      const apiMsg = err.response?.data?.error
      setFormError(apiMsg || err.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <span className="font-bold text-xl text-brand-600">CreatorBrand</span>
        <div className="flex gap-3">
          <Link to="/login" className="text-sm text-gray-600 hover:text-brand-500 px-4 py-2">
            Sign in
          </Link>
          <Link to="/signup" className="text-sm bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600">
            Get started
          </Link>
        </div>
      </nav>

      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs px-3 py-1.5 rounded-full mb-6 border border-brand-100">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
          Platform live — early access open now
        </div>
        <h1 className="text-5xl font-bold leading-tight text-gray-900 mb-6">
          The creator economy
          <br />
          <span className="text-brand-500">operating system</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
          Creators grow their influence. Brands find the right voice. All backed by real analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/signup" className="bg-brand-500 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-brand-600">
            Join as a Creator
          </Link>
          <Link to="/signup" className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-200">
            Join as a Brand
          </Link>
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-4">
        <LiveCounter />
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">For Creators</h2>
            <p className="text-gray-500 mb-6 text-sm">Know your influence. Grow your influence. Monetize it.</p>
            <div className="space-y-4">
              {FEATURES_CREATOR.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-brand-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-sm bg-brand-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{f.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">For Brands</h2>
            <p className="text-gray-500 mb-6 text-sm">Find the right creators. Launch campaigns. Measure impact.</p>
            <div className="space-y-4">
              {FEATURES_BRAND.map((f) => (
                <div
                  key={f.title}
                  className="flex gap-4 p-4 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                    <div className="w-3 h-3 rounded-sm bg-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{f.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Reserve your spot</h2>
          <p className="text-gray-500 text-center text-sm mb-8">Early members get priority access</p>

          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-green-700 font-medium mb-1">You are on the list!</div>
              <p className="text-green-600 text-sm">We will notify you when your access is ready.</p>
              <Link to="/signup" className="mt-4 inline-block text-sm text-brand-500 hover:underline">
                Create your account now →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="bg-white rounded-2xl shadow-sm border p-6 space-y-4">
              {formError && <p className="text-red-600 text-sm">{formError}</p>}
              <input
                className="w-full border rounded-lg px-4 py-3 text-sm"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
              />
              <input
                className="w-full border rounded-lg px-4 py-3 text-sm"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                required
              />
              <div className="flex rounded-lg border overflow-hidden">
                {['CREATOR', 'BRAND'].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                    className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                      form.role === r ? 'bg-brand-500 text-white' : 'bg-white text-gray-600'
                    }`}
                  >
                    {r === 'CREATOR' ? 'Creator' : 'Brand'}
                  </button>
                ))}
              </div>
              <button
                className="w-full bg-brand-500 text-white py-3 rounded-lg text-sm font-medium hover:bg-brand-600 disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Joining...' : 'Join the waitlist'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer className="border-t py-8 px-6 text-center text-sm text-gray-400">
        <p>CreatorBrand — Creator Economy Platform</p>
      </footer>
    </div>
  )
}

