import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

export default function CreatorProfile() {
  const { username } = useParams()
  const [creator, setCreator] = useState(null)

  useEffect(() => {
    api.get(`/api/creators/${username}`).then((r) => setCreator(r.data)).catch(console.error)
  }, [username])

  if (!creator) {
    return (
      <PageLayout>
        <div className="text-gray-400 text-sm">Loading...</div>
      </PageLayout>
    )
  }

  const niche = JSON.parse(creator.niche || '[]')

  return (
    <PageLayout>
      <div className="bg-white border rounded-xl p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center font-semibold text-brand-700 text-xl">
            {creator.displayName?.[0]}
          </div>
          <div>
            <div className="text-xl font-semibold text-gray-900">{creator.displayName}</div>
            <div className="text-sm text-gray-500">@{creator.username}</div>
          </div>
        </div>

        {creator.bio && <p className="text-sm text-gray-700 mb-3">{creator.bio}</p>}
        <div className="text-sm text-gray-500 mb-4">{creator.location}</div>

        <div className="flex flex-wrap gap-2 mb-4">
          {niche.map((n) => (
            <span key={n} className="text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full">
              {n}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-gray-900">{creator.instagramFollowers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Instagram</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-gray-900">{creator.tiktokFollowers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">TikTok</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-gray-900">{creator.youtubeSubscribers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">YouTube</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-sm font-semibold text-gray-900">{creator.twitterFollowers.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Twitter</div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

