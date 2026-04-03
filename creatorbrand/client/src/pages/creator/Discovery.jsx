import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

export default function CreatorDiscovery() {
  const [campaigns, setCampaigns] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ niche: '', platform: '', budgetMin: '', page: 1 })
  const [applying, setApplying] = useState(null)
  const [message, setMessage] = useState('')

  async function fetchCampaigns(f = filters) {
    const params = new URLSearchParams({ status: 'ACTIVE' })
    if (f.niche) params.set('niche', f.niche)
    if (f.platform) params.set('platform', f.platform)
    if (f.budgetMin) params.set('budgetMin', f.budgetMin)
    params.set('page', f.page)
    const res = await api.get(`/api/campaigns?${params}`)
    setCampaigns(res.data.campaigns)
    setTotal(res.data.total)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await fetchCampaigns()
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  async function handleApply(campaignId) {
    await api.post(`/api/campaigns/${campaignId}/apply`, { message })
    setApplying(null)
    setMessage('')
    alert('Application submitted!')
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Browse campaigns</h1>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => {
            const f = { ...filters, niche: e.target.value, page: 1 }
            setFilters(f)
            fetchCampaigns(f).catch(console.error)
          }}
          value={filters.niche}
        >
          <option value="">All niches</option>
          {['lifestyle', 'fashion', 'beauty', 'fitness', 'food', 'tech'].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-3 py-2 text-sm"
          onChange={(e) => {
            const f = { ...filters, platform: e.target.value, page: 1 }
            setFilters(f)
            fetchCampaigns(f).catch(console.error)
          }}
          value={filters.platform}
        >
          <option value="">All platforms</option>
          {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">{total} active campaigns</p>

      <div className="grid sm:grid-cols-2 gap-4">
        {campaigns.map((c) => {
          const platforms = JSON.parse(c.platforms || '[]')
          const niche = JSON.parse(c.niche || '[]')
          return (
            <div key={c.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{c.brand?.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-brand-600">${c.budget.toLocaleString()}</div>
                  <div className="text-xs text-gray-400">{c.budgetType?.toLowerCase()}</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{c.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {niche.map((n) => (
                  <span key={n} className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                    {n}
                  </span>
                ))}
                {platforms.map((p) => (
                  <span key={p} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {p}
                  </span>
                ))}
              </div>

              {applying === c.id ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 text-sm resize-none"
                    rows={3}
                    placeholder="Why are you a good fit?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApply(c.id)}
                      className="flex-1 bg-brand-500 text-white text-sm py-1.5 rounded-lg hover:bg-brand-600"
                      type="button"
                    >
                      Submit
                    </button>
                    <button
                      onClick={() => setApplying(null)}
                      className="flex-1 border text-sm py-1.5 rounded-lg text-gray-600"
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setApplying(c.id)}
                  className="w-full bg-brand-500 text-white text-sm py-2 rounded-lg hover:bg-brand-600"
                  type="button"
                >
                  Apply
                </button>
              )}
            </div>
          )
        })}
      </div>
    </PageLayout>
  )
}

