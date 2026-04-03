import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

export default function CampaignDetail() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState(null)

  useEffect(() => {
    api.get(`/api/campaigns/${id}`).then((r) => setCampaign(r.data)).catch(console.error)
  }, [id])

  if (!campaign) {
    return (
      <PageLayout>
        <div className="text-gray-400 text-sm">Loading...</div>
      </PageLayout>
    )
  }

  const niche = JSON.parse(campaign.niche || '[]')
  const platforms = JSON.parse(campaign.platforms || '[]')

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">{campaign.title}</h1>
      <p className="text-sm text-gray-500 mb-6">{campaign.brand?.name}</p>

      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-900">${campaign.budget.toLocaleString()}</div>
          <div className="text-xs text-gray-400">{campaign.budgetType?.toLowerCase()}</div>
        </div>
        <p className="text-sm text-gray-700 mb-4">{campaign.description}</p>
        <div className="flex flex-wrap gap-2">
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
      </div>
    </PageLayout>
  )
}

