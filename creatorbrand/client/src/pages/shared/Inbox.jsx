import { useEffect, useState } from 'react'
import PageLayout from '../../components/layout/PageLayout'
import { useAuthStore } from '../../stores/authStore'
import api from '../../services/api'

const STATUS_COLORS = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  ACCEPTED: 'bg-green-50 text-green-700',
  DECLINED: 'bg-red-50 text-red-600',
  COMPLETED: 'bg-blue-50 text-blue-700'
}

export default function Inbox() {
  const { user } = useAuthStore()
  const [collabs, setCollabs] = useState([])

  async function load() {
    const res = await api.get('/api/collaborations')
    setCollabs(res.data)
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

  async function respond(id, status) {
    await api.patch(`/api/collaborations/${id}`, { status })
    await load()
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Inbox</h1>
      {collabs.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-gray-400 text-sm">
          No collaboration requests yet
        </div>
      ) : (
        <div className="space-y-3">
          {collabs.map((c) => (
            <div key={c.id} className="bg-white border rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    {user?.role === 'CREATOR' ? c.brand?.name : c.creator?.displayName}
                  </div>
                  {c.campaign && <div className="text-xs text-gray-500 mt-0.5">Re: {c.campaign.title}</div>}
                  {c.message && <p className="text-sm text-gray-600 mt-2">{c.message}</p>}
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[c.status]}`}>
                  {c.status.toLowerCase()}
                </span>
              </div>
              {c.status === 'PENDING' && user?.role === 'CREATOR' && (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => respond(c.id, 'ACCEPTED')} className="bg-green-500 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-green-600" type="button">
                    Accept
                  </button>
                  <button onClick={() => respond(c.id, 'DECLINED')} className="border text-gray-600 text-sm px-4 py-1.5 rounded-lg hover:bg-gray-50" type="button">
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  )
}

