'use client'

import { Home, Layout, Bell, Calendar, FileText, MessageSquare, Inbox, TrendingUp, FolderOpen, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const mainMenuItems = [
  { icon: Home, label: "Globe", href: "/globe-workers", active: true },
  { icon: Layout, label: "Tasks", href: "/tasks" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: FileText, label: "Invoices", href: "/invoices" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Inbox, label: "Inbox", href: "/inbox" },
  { icon: TrendingUp, label: "Performance", href: "/performance" },
]

const folderItems = [
  { icon: FolderOpen, label: "Work Logs", href: "/work-logs" },
  { icon: FolderOpen, label: "Timesheets", href: "/timesheets" },
  { icon: FolderOpen, label: "Marketing", href: "/marketing" },
]

interface SidebarProps {
  userName?: string
  userEmail?: string
  userPhone?: string
}

export default function Sidebar({ userName = "Worker", userEmail = "worker@palm.com", userPhone }: SidebarProps) {
  const router = useRouter()
  const [folderOpen, setFolderOpen] = useState(true)

  return (
    <aside className="w-64 min-h-screen bg-[#050509] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <div className="grid grid-cols-2 gap-1">
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
            <div className="w-3 h-3 bg-white rounded-sm" />
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            MAIN
          </h3>
          <nav className="space-y-1">
            {mainMenuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? "bg-purple-600/20 text-purple-400 border-l-2 border-purple-500"
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Folder Section */}
        <div>
          <button
            onClick={() => setFolderOpen(!folderOpen)}
            className="w-full flex items-center justify-between px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-400 transition-colors"
          >
            <span>FOLDER</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${folderOpen && "transform rotate-180"}`}
            />
          </button>
          {folderOpen && (
            <nav className="space-y-1">
              {folderItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-gray-300 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#050509]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-gray-400 truncate">{userEmail}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </aside>
  )
}
