'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, Building2, Star, AlertTriangle, Clock, MessageSquare, Phone, Flag } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Avatar from './Avatar'

interface WorkerDetailModalProps {
  phoneNumber: string
  onClose: () => void
}

interface WorkerDetail {
  phone_number: string
  name: string
  country: string
  registration_complete: boolean
  created_at: string
  updated_at: string
  survey_data: {
    feeling?: string
    state?: string
    postcode?: string
    age_range?: string
    gender?: string
    employer_rating?: string
    employer?: string
    industry?: string
  }
  distress_alerts: Array<{
    id: number
    message: string
    keywords_detected: string[]
    resolved: boolean
    timestamp: string
    hours_since_alert: number
  }>
  recent_messages: Array<{
    role: string
    content: string
    timestamp: string
  }>
  message_count: number
  last_active: string
  status: 'positive' | 'neutral' | 'needs_attention' | 'critical'
}

// Utility function to safely parse keywords_detected from Supabase JSONB
const parseKeywords = (keywords: any): string[] => {
  if (!keywords) return []

  // Already an array
  if (Array.isArray(keywords)) {
    return keywords.filter(k => typeof k === 'string')
  }

  // JSON string that needs parsing
  if (typeof keywords === 'string') {
    try {
      const parsed = JSON.parse(keywords)
      if (Array.isArray(parsed)) {
        return parsed.filter(k => typeof k === 'string')
      }
    } catch {
      // If parsing fails, return empty array
      return []
    }
  }

  // Object - convert to array of values
  if (typeof keywords === 'object') {
    return Object.values(keywords).filter(k => typeof k === 'string')
  }

  return []
}

const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    'Fiji': '🇫🇯',
    'Samoa': '🇼🇸',
    'Tonga': '🇹🇴',
    'Kiribati': '🇰🇮',
    'Papua New Guinea': '🇵🇬',
    'Solomon Islands': '🇸🇧',
    'Vanuatu': '🇻🇺',
    'Tuvalu': '🇹🇻',
    'Timor-Leste': '🇹🇱',
    'Nauru': '🇳🇷'
  }
  return flags[country] || '🌏'
}

const getStatusConfig = (status: WorkerDetail['status']) => {
  switch (status) {
    case 'critical':
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        label: '🚨 Critical - Immediate Action Required',
        ringColor: 'ring-red-500'
      }
    case 'needs_attention':
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        label: '⚠️ Needs Attention',
        ringColor: 'ring-yellow-500'
      }
    case 'positive':
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        label: '✓ Doing Well',
        ringColor: 'ring-green-500'
      }
    default:
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        label: '○ Neutral',
        ringColor: 'ring-gray-500'
      }
  }
}

export default function WorkerDetailModal({ phoneNumber, onClose }: WorkerDetailModalProps) {
  const [worker, setWorker] = useState<WorkerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWorkerDetails()
  }, [phoneNumber])

  async function fetchWorkerDetails() {
    try {
      setLoading(true)
      const response = await fetch(`/api/dashboard/worker/${encodeURIComponent(phoneNumber)}`)

      if (!response.ok) {
        throw new Error('Failed to fetch worker details')
      }

      const data = await response.json()
      setWorker(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching worker details:', err)
      setError('Failed to load worker details')
    } finally {
      setLoading(false)
    }
  }

  async function handleResolveAlert(alertId: number) {
    try {
      await fetch('/api/dashboard/alerts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId, resolved: true })
      })
      fetchWorkerDetails() // Refresh data
    } catch (err) {
      console.error('Error resolving alert:', err)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="ml-3 text-gray-600">Loading worker details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Failed to Load Worker</p>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(worker.status)
  const unresolvedAlerts = worker.distress_alerts.filter(a => !a.resolved)
  const employerRating = worker.survey_data.employer_rating
    ? parseInt(worker.survey_data.employer_rating)
    : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`${statusConfig.ringColor} ring-4 rounded-full`}>
              <Avatar name={worker.name} size="xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">{worker.name}</h2>
                <span className="text-2xl">{getCountryFlag(worker.country)}</span>
              </div>
              <p className="text-sm text-gray-500">{worker.country}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Status Banner */}
        <div className={`px-6 py-3 border-b ${statusConfig.color} border`}>
          <p className="font-semibold">{statusConfig.label}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Building2 className="w-4 h-4" />
                <span>Industry</span>
              </div>
              <p className="font-semibold text-gray-900">{worker.survey_data.industry || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
              <p className="font-semibold text-gray-900">
                {worker.survey_data.state} {worker.survey_data.postcode}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Star className="w-4 h-4" />
                <span>Rating</span>
              </div>
              <div className="flex items-center gap-1">
                {employerRating && Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < employerRating ? 'text-yellow-500' : 'text-gray-300'}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                <Clock className="w-4 h-4" />
                <span>Last Active</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {formatDistanceToNow(new Date(worker.last_active), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Employer Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">Employer Information</h3>
            <div className="space-y-1">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {worker.survey_data.employer || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Industry:</span> {worker.survey_data.industry || 'Not provided'}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Worker Rating:</span> {employerRating ? `${employerRating}/5 stars` : 'Not rated'}
              </p>
            </div>
          </div>

          {/* Distress Alerts */}
          {unresolvedAlerts.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-red-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Unresolved Concerns ({unresolvedAlerts.length})
                </h3>
              </div>
              <div className="space-y-3">
                {unresolvedAlerts.map((alert) => (
                  <div key={alert.id} className="bg-white rounded-lg p-3 border border-red-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium mb-1">{alert.message}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{Math.floor(alert.hours_since_alert)} hours ago</span>
                        </div>
                        {(() => {
                          const keywords = parseKeywords(alert.keywords_detected)
                          return keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {keywords.map((keyword, i) => (
                                <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="ml-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Recent Messages ({worker.message_count} total)
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {worker.recent_messages.slice(0, 5).map((msg, i) => (
                <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-white'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {msg.role === 'user' ? 'Worker' : 'Assistant'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{msg.content.substring(0, 100)}{msg.content.length > 100 ? '...' : ''}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Phone className="w-5 h-5" />
              <span className="font-medium">Call</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Flag className="w-5 h-5" />
              <span className="font-medium">Flag</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
