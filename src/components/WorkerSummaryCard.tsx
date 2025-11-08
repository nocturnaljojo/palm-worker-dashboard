'use client'

import { X } from 'lucide-react'
import Avatar from './Avatar'

interface WorkerSummaryCardProps {
  worker: {
    name: string
    country: string
    state: string
    city: string
    industry: string
    postcode: string
  }
  color: string
  onClose: () => void
}

/**
 * Privacy-focused summary card for globe workers
 * Shows only non-identifying information to protect worker privacy
 */
export default function WorkerSummaryCard({ worker, color, onClose }: WorkerSummaryCardProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border-2 relative"
        style={{ borderColor: color, boxShadow: `0 0 40px ${color}40` }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with avatar */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <div style={{ boxShadow: `0 0 20px ${color}80` }}>
              <Avatar name={worker.name} size="lg" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{worker.name}</h3>
              <p className="text-gray-400 text-sm">PALM Program Worker</p>
            </div>
          </div>
        </div>

        {/* Summary information - non-identifying */}
        <div className="p-6 space-y-4">
          {/* Country */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Country of Origin</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">🌴</span>
              <span className="text-lg font-semibold text-white">{worker.country}</span>
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Industry</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">🏢</span>
              <span className="text-lg font-semibold text-white">{worker.industry || 'Not specified'}</span>
            </div>
          </div>

          {/* General location - vague for privacy */}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wide">Region</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-lg font-semibold text-white">{worker.state}</span>
            </div>
          </div>
        </div>

        {/* Footer message */}
        <div
          className="p-4 border-t border-gray-700"
          style={{ backgroundColor: `${color}10` }}
        >
          <p className="text-center text-sm italic" style={{ color: color }}>
            "Each light represents a voice, a story, and hope for those who cannot speak."
          </p>
        </div>

        {/* Privacy notice */}
        <div className="px-6 pb-6">
          <p className="text-xs text-gray-500 text-center">
            Detailed information is protected to ensure worker privacy and safety
          </p>
        </div>
      </div>
    </div>
  )
}
