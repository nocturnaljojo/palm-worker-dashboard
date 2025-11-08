import { LucideIcon } from "lucide-react"

interface DashboardStatCardProps {
  label: string
  value: string | number
  trendLabel?: string
  trendColor?: "positive" | "negative" | "neutral"
  icon?: LucideIcon
}

export default function DashboardStatCard({
  label,
  value,
  trendLabel,
  trendColor = "positive",
  icon: Icon
}: DashboardStatCardProps) {
  const trendClass =
    trendColor === "positive"
      ? "text-emerald-400"
      : trendColor === "negative"
      ? "text-red-400"
      : "text-gray-400"

  return (
    <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg hover:border-purple-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm text-gray-400 font-medium">{label}</p>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-purple-400" />
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        {trendLabel && (
          <span className={`text-xs font-medium ${trendClass}`}>
            {trendLabel}
          </span>
        )}
      </div>
    </div>
  )
}
