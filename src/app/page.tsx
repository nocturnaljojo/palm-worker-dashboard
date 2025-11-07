'use client'

import { useEffect, useState } from 'react'
import { Users, TrendingUp, AlertTriangle, MessageSquare, Globe, MapPin } from 'lucide-react'
import type { DashboardSummary, WorkersByCountry, EmployerRating, DistressAlert } from '@/lib/supabase'
import WorkerDetailModal from '@/components/WorkerDetailModal'
import Avatar from '@/components/Avatar'

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [workersByCountry, setWorkersByCountry] = useState<WorkersByCountry[]>([])
  const [topEmployers, setTopEmployers] = useState<EmployerRating[]>([])
  const [alerts, setAlerts] = useState<DistressAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)

  useEffect(() => {
    fetchDashboardData()
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchDashboardData() {
    try {
      // Fetch summary stats
      const summaryRes = await fetch('/api/dashboard/summary')
      const summaryData = await summaryRes.json()
      setSummary(summaryData)

      // Fetch workers by country
      const workersRes = await fetch('/api/dashboard/workers?groupBy=country')
      const workersData = await workersRes.json()
      setWorkersByCountry(workersData.slice(0, 5))

      // Fetch top employers
      const employersRes = await fetch('/api/dashboard/employers?sortBy=avg_rating&order=desc')
      const employersData = await employersRes.json()
      setTopEmployers(employersData.slice(0, 5))

      // Fetch unresolved alerts
      const alertsRes = await fetch('/api/dashboard/alerts?resolved=false')
      const alertsData = await alertsRes.json()
      setAlerts(alertsData.slice(0, 5))

      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PALM Worker Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Real-time analytics for 30,000+ Pacific workers</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Live
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Users className="w-6 h-6" />}
            title="Total Workers"
            value={summary?.total_users || 0}
            subtitle={`${summary?.registered_users || 0} registered`}
            color="blue"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Active (7 days)"
            value={summary?.active_users_7d || 0}
            subtitle={`${summary?.active_users_30d || 0} in 30 days`}
            color="green"
          />
          <StatCard
            icon={<MessageSquare className="w-6 h-6" />}
            title="Total Messages"
            value={summary?.total_messages || 0}
            subtitle={`${summary?.total_survey_responses || 0} surveys`}
            color="purple"
          />
          <StatCard
            icon={<AlertTriangle className="w-6 h-6" />}
            title="Unresolved Alerts"
            value={summary?.unresolved_alerts || 0}
            subtitle="Needs attention"
            color="red"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Workers by Country */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Workers by Country
              </h2>
            </div>
            <div className="space-y-3">
              {workersByCountry.map((country) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{country.country}</p>
                      <p className="text-sm text-gray-500">
                        {country.registration_rate}% registered
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{country.worker_count}</p>
                    <p className="text-xs text-gray-500">workers</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Employers */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Top Rated Employers</h2>
            </div>
            <div className="space-y-3">
              {topEmployers.map((employer) => (
                <div key={employer.employer_name} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{employer.employer_name}</p>
                    <p className="text-sm text-gray-500">{employer.industry} • {employer.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-semibold text-gray-900">{employer.avg_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-gray-500">({employer.worker_count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Distress Alerts */}
          {alerts.length > 0 && (
            <div className="lg:col-span-2 bg-red-50 rounded-lg shadow-sm border border-red-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Unresolved Distress Alerts
                </h2>
                <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {alerts.length} Active
                </span>
              </div>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg p-4 border border-red-100 hover:border-red-300 transition-colors cursor-pointer" onClick={() => setSelectedWorker(alert.phone_number)}>
                    <div className="flex items-start gap-3">
                      <Avatar name={alert.name} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 hover:text-blue-600">{alert.name}</p>
                          <span className="text-xs text-gray-500">• {alert.country} • {alert.state}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{alert.employer}</span>
                          <span>•</span>
                          <span>{Math.floor(alert.hours_since_alert)}h ago</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle resolve
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors flex-shrink-0"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <WorkerDetailModal
          phoneNumber={selectedWorker}
          onClose={() => {
            setSelectedWorker(null)
            fetchDashboardData() // Refresh data when modal closes
          }}
        />
      )}
    </div>
  )
}

function StatCard({ icon, title, value, subtitle, color }: {
  icon: React.ReactNode
  title: string
  value: number
  subtitle: string
  color: string
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
  }[color]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${colorClasses} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}
