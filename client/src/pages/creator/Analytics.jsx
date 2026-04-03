import { useEffect, useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import api from '../../services/api'

const PLATFORMS = ['instagram', 'tiktok', 'youtube', 'twitter']
const RANGES = ['7d', '30d', '90d']
const COLORS = { instagram: '#e1306c', tiktok: '#010101', youtube: '#ff0000', twitter: '#1da1f2' }

export default function CreatorAnalytics() {
  const { profile } = useAuthStore()
  const [platform, setPlatform] = useState('instagram')
  const [range, setRange] = useState('30d')
  const [snapshots, setSnapshots] = useState([])
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    if (!profile?.id) return
    api.get(`/api/analytics/creator/${profile.id}/summary`).then((r) => setSummary(r.data))
  }, [profile?.id])

  useEffect(() => {
    if (!profile?.id) return
    api
      .get(`/api/analytics/creator/${profile.id}/snapshots?platform=${platform}&range=${range}`)
      .then((r) =>
        setSnapshots(
          r.data.map((s) => ({
            date: new Date(s.snapshotDate).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
            followers: s.followers,
            engagement: s.engagementRate,
            reach: s.estimatedReach,
            likes: s.avgLikes
          }))
        )
      )
  }, [profile?.id, platform, range])

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Analytics</h1>

      <div className="flex gap-2 mb-6">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
              platform === p ? 'text-white border-transparent' : 'text-gray-600 border-gray-300 hover:border-gray-400'
            }`}
            style={platform === p ? { backgroundColor: COLORS[p] } : {}}
            type="button"
          >
            {p}
          </button>
        ))}

        <div className="ml-auto flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 rounded-lg text-sm ${
                range === r ? 'bg-brand-500 text-white' : 'border text-gray-600 hover:bg-gray-50'
              }`}
              type="button"
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          {['instagramFollowers', 'tiktokFollowers', 'youtubeSubscribers', 'twitterFollowers'].map((k, i) => (
            <div key={k} className="bg-white border rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 mb-1 capitalize">{PLATFORMS[i]}</div>
              <div className="text-xl font-bold text-gray-900">{(summary[k] / 1000).toFixed(1)}k</div>
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Follower growth</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={snapshots}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[platform]} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS[platform]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Area type="monotone" dataKey="followers" stroke={COLORS[platform]} strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Engagement rate (%)</h2>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={snapshots}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="engagement" stroke="#4f6ef7" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">Estimated reach</h2>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={snapshots.filter((_, i) => i % 3 === 0)}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="reach" fill={COLORS[platform]} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

