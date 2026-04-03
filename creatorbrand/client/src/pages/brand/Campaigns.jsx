import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

const STATUS_COLORS = {
  DRAFT: 'bg-gray-100 text-gray-600',
  ACTIVE: 'bg-green-50 text-green-700',
  PAUSED: 'bg-yellow-50 text-yellow-700',
  COMPLETED: 'bg-blue-50 text-blue-700',
  CANCELLED: 'bg-red-50 text-red-600'
}

export default function BrandCampaigns() {
  const [campaigns, setCampaigns] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', budget: '', budgetType: 'FIXED', niche: [], platforms: [], deliverables: '' })
  const [selected, setSelected] = useState(null)
  const [applications, setApplications] = useState([])

  async function load() {
    const brandRes = await api.get('/api/brands/dashboard')
    setCampaigns(brandRes.data.campaigns || [])
  }

  useEffect(() => {
    ;(async () => {
      try {
        await load()
      } catch (err) {
        console.error(err)
      }
    })()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    await api.post('/api/campaigns', form)
    setShowCreate(false)
    setForm({ title: '', description: '', budget: '', budgetType: 'FIXED', niche: [], platforms: [], deliverables: '' })
    await load()
  }

  async function changeStatus(id, status) {
    await api.patch(`/api/campaigns/${id}`, { status })
    await load()
  }

  async function openCampaign(c) {
    setSelected(c)
    const res = await api.get(`/api/campaigns/${c.id}/applications`)
    setApplications(res.data)
  }

  async function updateApp(appId, status) {
    await api.patch(`/api/campaigns/${selected.id}/applications/${appId}`, { status })
    const res = await api.get(`/api/campaigns/${selected.id}/applications`)
    setApplications(res.data)
  }

  return (
    <PageLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Campaigns</h1>
        <button onClick={() => setShowCreate(true)} className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-brand-600" type="button">
          New campaign
        </button>
      </div>

      {showCreate && (
        <div className="bg-white border rounded-xl p-6 mb-6">
          <h2 className="font-medium text-gray-900 mb-4">Create campaign</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input className="w-full border rounded-lg px-4 py-2.5 text-sm" placeholder="Campaign title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} required />
            <textarea className="w-full border rounded-lg px-4 py-2.5 text-sm resize-none" rows={3} placeholder="Campaign description / brief" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <div className="flex gap-3">
              <input className="border rounded-lg px-4 py-2.5 text-sm w-40" type="number" placeholder="Budget ($)" value={form.budget} onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value }))} required />
              <select className="border rounded-lg px-3 py-2.5 text-sm" value={form.budgetType} onChange={(e) => setForm((p) => ({ ...p, budgetType: e.target.value }))}>
                <option value="FIXED">Fixed total</option>
                <option value="PER_POST">Per post</option>
                <option value="REVENUE_SHARE">Revenue share</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-2">Platforms</p>
              <div className="flex gap-2 flex-wrap">
                {['instagram', 'tiktok', 'youtube', 'twitter'].map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        platforms: prev.platforms.includes(p) ? prev.platforms.filter((x) => x !== p) : [...prev.platforms, p]
                      }))
                    }
                    className={`px-3 py-1 rounded-full text-xs border ${form.platforms.includes(p) ? 'bg-brand-500 text-white border-brand-500' : 'border-gray-300 text-gray-600'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <textarea className="w-full border rounded-lg px-4 py-2.5 text-sm resize-none" rows={2} placeholder="Deliverables (e.g. 3x posts, 2x stories)" value={form.deliverables} onChange={(e) => setForm((p) => ({ ...p, deliverables: e.target.value }))} />
            <div className="flex gap-3">
              <button type="submit" className="bg-brand-500 text-white px-4 py-2 rounded-lg text-sm">
                Save as draft
              </button>
              <button type="button" onClick={() => setShowCreate(false)} className="border px-4 py-2 rounded-lg text-sm text-gray-600">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-white border rounded-xl p-5 flex items-center gap-4 hover:border-brand-300 transition-colors">
            <div className="flex-1">
              <div className="font-medium text-gray-900">{c.title}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                ${c.budget.toLocaleString()} · {c._count?.applications || 0} applications
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>{c.status}</span>
            <div className="flex gap-2">
              {c.status === 'DRAFT' && <button onClick={() => changeStatus(c.id, 'ACTIVE')} className="text-xs text-green-600 border border-green-300 px-2 py-1 rounded-lg hover:bg-green-50" type="button">Publish</button>}
              {c.status === 'ACTIVE' && <button onClick={() => changeStatus(c.id, 'PAUSED')} className="text-xs text-yellow-600 border border-yellow-300 px-2 py-1 rounded-lg hover:bg-yellow-50" type="button">Pause</button>}
              {c.status === 'PAUSED' && <button onClick={() => changeStatus(c.id, 'ACTIVE')} className="text-xs text-blue-600 border border-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50" type="button">Resume</button>}
              <button onClick={() => openCampaign(c)} className="text-xs border px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-50" type="button">View</button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[80vh] overflow-auto p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-lg leading-none" type="button">
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">{selected.description}</p>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Applications ({applications.length})</h3>
            {applications.length === 0 ? (
              <p className="text-sm text-gray-400">No applications yet</p>
            ) : (
              applications.map((a) => (
                <div key={a.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-sm font-medium text-brand-700">
                    {a.creator.displayName[0]}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.creator.displayName}</div>
                    {a.message && <div className="text-xs text-gray-500 mt-0.5">{a.message}</div>}
                  </div>
                  {a.status === 'PENDING' ? (
                    <div className="flex gap-2">
                      <button onClick={() => updateApp(a.id, 'APPROVED')} className="text-xs bg-green-500 text-white px-2 py-1 rounded-lg" type="button">Accept</button>
                      <button onClick={() => updateApp(a.id, 'DECLINED')} className="text-xs border text-gray-600 px-2 py-1 rounded-lg" type="button">Decline</button>
                    </div>
                  ) : (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'APPROVED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                      {a.status.toLowerCase()}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

