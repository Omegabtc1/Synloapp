import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

const CREATOR_LINKS = [
  { to: '/creator/dashboard', label: 'Dashboard' },
  { to: '/creator/analytics', label: 'Analytics' },
  { to: '/creator/discovery', label: 'Discovery' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/settings', label: 'Settings' }
]

const BRAND_LINKS = [
  { to: '/brand/dashboard', label: 'Dashboard' },
  { to: '/brand/campaigns', label: 'Campaigns' },
  { to: '/brand/discovery', label: 'Discovery' },
  { to: '/inbox', label: 'Inbox' },
  { to: '/settings', label: 'Settings' }
]

export default function Sidebar() {
  const { user, profile, logout } = useAuthStore()
  const navigate = useNavigate()
  const links = user?.role === 'CREATOR' ? CREATOR_LINKS : BRAND_LINKS

  return (
    <aside className="w-56 bg-white border-r min-h-screen flex flex-col py-6 px-4">
      <div className="font-bold text-brand-600 text-lg mb-8 px-2">CreatorBrand</div>
      <nav className="flex-1 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-brand-50 text-brand-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t pt-4 mt-4">
        <div className="px-3 mb-3">
          <div className="text-sm font-medium text-gray-900 truncate">{profile?.displayName || profile?.name}</div>
          <div className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</div>
        </div>
        <button
          onClick={async () => {
            await logout()
            navigate('/')
          }}
          className="w-full text-left px-3 py-2 text-sm text-gray-500 hover:text-red-500 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

