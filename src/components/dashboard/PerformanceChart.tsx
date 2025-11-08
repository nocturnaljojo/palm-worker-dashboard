'use client'

import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts"
import { TrendingUp, Calendar } from "lucide-react"

const data = [
  { day: "Mon", value: 57, change: "+57%" },
  { day: "Tue", value: 44, change: "+44%" },
  { day: "Wed", value: 81, change: "+81%" },
  { day: "Thu", value: 37, change: "+37%" },
  { day: "Fri", value: 53, change: "+53%" },
  { day: "Sat", value: 48, change: "+48%" },
  { day: "Sun", value: 77, change: "+77%" },
]

export default function PerformanceChart() {
  return (
    <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Performance Tracker</h3>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors text-sm">
          <Calendar className="w-4 h-4" />
          <span>Last week</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-1">
          <h4 className="text-2xl font-bold text-white">Performance</h4>
          <span className="text-sm font-medium text-emerald-400">+12% vs last week</span>
        </div>
        <div className="flex gap-6 text-xs text-gray-400 mt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gray-400" />
            <span>Wednesday</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Total Sales</span>
            <span className="text-white font-medium">2987</span>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-500">Total Revenue</span>
            <span className="text-white font-medium">$11.3k</span>
          </div>
        </div>
      </div>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.day === "Wed" ? "#9333ea" : "#374151"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-8 pointer-events-none">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              style={{ width: `${100 / data.length}%` }}
            >
              <span className="text-sm font-bold text-white mb-1">{item.change}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
