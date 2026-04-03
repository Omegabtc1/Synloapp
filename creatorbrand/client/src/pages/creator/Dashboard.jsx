import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'
import StatBlock from '../../components/ui/StatBlock'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../services/api'

export default function CreatorDashboard() {
  const { profile } = useAuthStore()
  const [summary, setSummary] = useState(null)
  const [snapshots, setSnapshots] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.id) return

    async function load() {
      const [sumRes, snapRes, campRes] = await Promise.all([
        api.get(`/api/analytics/creator/${profile.id}/summary`),
        api.get(`/api/analytics/creator/${profile.id}/snapshots?platform=instagram&range=30d`),
        api.get(`/api/campaigns?status=ACTIVE&limit=4`)
      ])

      setSummary(sumRes.data)
      setSnapshots(
        snapRes.data.map((s) => ({
          date: new Date(s.snapshotDate).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
          followers: s.followers,
          engagement: s.engagementRate
        }))
      )
      setCampaigns(campRes.data.campaigns)
      setLoading(false)
    }

    load().catch(console.error)
  }, [profile?.id])

  if (loading)
    return (
      <PageLayout>
        <div className="text-gray-400 text-sm">Loading...</div>
      </PageLayout>
    )

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Welcome back, {profile?.displayName}</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBlock label="Total followers" value={summary?.totalFollowers} delta={summary?.followerGrowth30d} />
        <StatBlock label="Avg engagement" value={`${summary?.avgEngagementRate?.toFixed(1)}%`} />
        <StatBlock label="Instagram" value={summary?.instagramFollowers} />
        <StatBlock label="TikTok" value={summary?.tiktokFollowers} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Follower growth — last 30 days</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={snapshots}>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Line type="monotone" dataKey="followers" stroke="#4f6ef7" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Open campaigns</h2>
          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="border rounded-lg p-3">
                <div className="text-sm font-medium text-gray-900 truncate">{c.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {c.brand?.name} · ${c.budget.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

