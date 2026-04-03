import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import PageLayout from '../../components/layout/PageLayout'
import api from '../../services/api'

export default function Settings() {
  const { user, profile } = useAuthStore()
  const [form, setForm] = useState({
    displayName: profile?.displayName || profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    website: profile?.website || '',
    industry: profile?.industry || ''
  })
  const [saved, setSaved] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    const endpoint = user?.role === 'CREATOR' ? '/api/creators/me' : '/api/brands/me'
    await api.patch(endpoint, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white border rounded-xl p-6 max-w-lg">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Display name</label>
            <input className="w-full border rounded-lg px-4 py-2.5 text-sm" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Bio</label>
            <textarea className="w-full border rounded-lg px-4 py-2.5 text-sm resize-none" rows={3} value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} />
          </div>
          {user?.role === 'CREATOR' && (
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Location</label>
              <input className="w-full border rounded-lg px-4 py-2.5 text-sm" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
            </div>
          )}
          {user?.role === 'BRAND' && (
            <div>
              <label className="text-xs text-gray-500 font-medium block mb-1">Website</label>
              <input className="w-full border rounded-lg px-4 py-2.5 text-sm" type="url" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
            </div>
          )}
          <button type="submit" className="bg-brand-500 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-brand-600">
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </form>
      </div>
    </PageLayout>
  )
}

