'use client'

import { TrendingUp } from "lucide-react"

export default function SalesOverview() {
  const percentage = 80.8
  const angle = (percentage / 100) * 180

  return (
    <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Sales Overview</h3>
      </div>

      <div className="flex flex-col items-center mb-6">
        {/* Semi-circular gauge */}
        <div className="relative w-48 h-24 mb-4">
          <svg className="w-full h-full" viewBox="0 0 200 100">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="#1f2937"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={`${(angle / 180) * 251.2} 251.2`}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{percentage}%</p>
            <p className="text-sm text-gray-400">Sales Growth</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 w-full">
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5">
            <p className="text-xs text-gray-400 mb-2">Number of sales</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">2,987</p>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-medium">
                -5.2%
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center p-4 rounded-xl bg-white/5">
            <p className="text-xs text-gray-400 mb-2">Total Revenue</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-white">$11.3k</p>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                +3.1%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
