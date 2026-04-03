import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

import Landing from '../pages/Landing'
import Signup from '../pages/Signup'
import Login from '../pages/Login'

import CreatorDashboard from '../pages/creator/Dashboard'
import CreatorAnalytics from '../pages/creator/Analytics'
import CreatorDiscovery from '../pages/creator/Discovery'
import CreatorProfile from '../pages/creator/Profile'

import BrandDashboard from '../pages/brand/Dashboard'
import BrandCampaigns from '../pages/brand/Campaigns'
import BrandDiscovery from '../pages/brand/Discovery'

import CampaignDetail from '../pages/shared/CampaignDetail'
import Inbox from '../pages/shared/Inbox'
import Settings from '../pages/shared/Settings'

function ProtectedRoute({ children, role }) {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

export default function AppRouter() {
  const fetchMe = useAuthStore((s) => s.fetchMe)
  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/creator/dashboard"
          element={
            <ProtectedRoute role="CREATOR">
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/analytics"
          element={
            <ProtectedRoute role="CREATOR">
              <CreatorAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/discovery"
          element={
            <ProtectedRoute role="CREATOR">
              <CreatorDiscovery />
            </ProtectedRoute>
          }
        />
        <Route path="/creator/profile/:username" element={<CreatorProfile />} />

        <Route
          path="/brand/dashboard"
          element={
            <ProtectedRoute role="BRAND">
              <BrandDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/campaigns"
          element={
            <ProtectedRoute role="BRAND">
              <BrandCampaigns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/brand/discovery"
          element={
            <ProtectedRoute role="BRAND">
              <BrandDiscovery />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campaigns/:id"
          element={
            <ProtectedRoute>
              <CampaignDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

