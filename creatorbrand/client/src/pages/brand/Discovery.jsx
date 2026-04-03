import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

const NICHES = [
  'all',
  'lifestyle',
  'fashion',
  'beauty',
  'fitness',
  'food',
  'tech',
  'gaming',
  'travel',
  'music',
  'education',
  'finance',
  'comedy'
]

export default function BrandDiscovery() {
  const [creators, setCreators] = useState([])
  const [total, setTotal] = useState(0)
  const [filters, setFilters] = useState({ niche: '', followersMin: '', followersMax: '', engMin: '', page: 1 })
  const [loading, setLoading] = useState(false)

  async function fetchCreators(f = filters) {
    setLoading(true)
    const params = new URLSearchParams()
    if (f.niche) params.set('niche', f.niche)
    if (f.followersMin) params.set('followersMin', f.followersMin)
    if (f.followersMax) params.set('followersMax', f.followersMax)
    if (f.engMin) params.set('engMin', f.engMin)
    params.set('page', f.page)
    const res = await api.get(`/api/creators?${params}`)
    setCreators(res.data.creators)
    setTotal(res.data.total)
    setLoading(false)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await fetchCreators()
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  function setFilter(key, val) {
    const next = { ...filters, [key]: val, page: 1 }
    setFilters(next)
    fetchCreators(next).catch(console.error)
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Discover creators</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={filters.niche}
          onChange={(e) => setFilter('niche', e.target.value)}
        >
          {NICHES.map((n) => (
            <option key={n} value={n === 'all' ? '' : n}>
              {n}
            </option>
          ))}
        </select>
        <input
          className="border rounded-lg px-3 py-2 text-sm w-36"
          placeholder="Min followers"
          type="number"
          value={filters.followersMin}
          onChange={(e) => setFilter('followersMin', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 text-sm w-36"
          placeholder="Max followers"
          type="number"
          value={filters.followersMax}
          onChange={(e) => setFilter('followersMax', e.target.value)}
        />
        <input
          className="border rounded-lg px-3 py-2 text-sm w-36"
          placeholder="Min engagement %"
          type="number"
          step="0.1"
          value={filters.engMin}
          onChange={(e) => setFilter('engMin', e.target.value)}
        />
      </div>

      <p className="text-sm text-gray-500 mb-4">{total.toLocaleString()} creators found</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-gray-400 text-sm col-span-3">Loading...</p>
        ) : (
          creators.map((c) => {
            const niche = JSON.parse(c.niche || '[]')
            return (
              <div key={c.id} className="bg-white border rounded-xl p-5 hover:border-brand-300 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center font-medium text-brand-700 text-sm">
                    {c.displayName[0]}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-900">{c.displayName}</div>
                    <div className="text-xs text-gray-400">@{c.username}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {niche.slice(0, 2).map((n) => (
                    <span key={n} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
                      {n}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg py-1.5">
                    <div className="text-sm font-semibold text-gray-900">{(c.instagramFollowers / 1000).toFixed(0)}k</div>
                    <div className="text-xs text-gray-400">Instagram</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg py-1.5">
                    <div className="text-sm font-semibold text-gray-900">{c.avgEngagementRate?.toFixed(1)}%</div>
                    <div className="text-xs text-gray-400">Engagement</div>
                  </div>
                </div>
                <button className="w-full mt-3 text-sm border border-brand-500 text-brand-500 py-1.5 rounded-lg hover:bg-brand-50 transition-colors" type="button">
                  Invite to collaborate
                </button>
              </div>
            )
          })
        )}
      </div>
    </PageLayout>
  )
}

