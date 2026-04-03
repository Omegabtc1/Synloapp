import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import StatBlock from '../../components/ui/StatBlock'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import api from '../../services/api'

export default function BrandDashboard() {
  const [data, setData] = useState(null)

  useEffect(() => {
    api
      .get('/api/brands/dashboard')
      .then((r) => setData(r.data))
      .catch(console.error)
  }, [])

  if (!data)
    return (
      <PageLayout>
        <div className="text-gray-400 text-sm">Loading...</div>
      </PageLayout>
    )

  const statusData = [
    { name: 'Active', value: data.activeCampaigns || 1, color: '#4ade80' },
    { name: 'Draft', value: (data.campaigns?.length || 1) - (data.activeCampaigns || 0), color: '#94a3b8' }
  ]

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{data.brand?.name} — Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBlock label="Active campaigns" value={data.activeCampaigns} />
        <StatBlock label="Total applications" value={data.totalApplications} />
        <StatBlock label="Active collabs" value={data.activeCollabs} />
        <StatBlock label="Total campaigns" value={data.campaigns?.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Campaign status</h2>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={60} dataKey="value" label={(e) => e.name}>
                {statusData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Recent applications</h2>
          <div className="space-y-3">
            {data.recentApplications?.map((a) => (
              <div key={a.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-xs font-medium text-brand-700">
                  {a.creator.displayName[0]}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{a.creator.displayName}</div>
                  <div className="text-xs text-gray-500">{a.campaign.title}</div>
                </div>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${
                    a.status === 'PENDING'
                      ? 'bg-yellow-50 text-yellow-700'
                      : a.status === 'APPROVED'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-600'
                  }`}
                >
                  {a.status.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

