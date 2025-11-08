'use client'

import { Search, Filter, MoreVertical, Target } from "lucide-react"

const tasks = [
  {
    id: 1,
    projectName: "Finance Project",
    status: "In Progress",
    progress: 70,
    totalTasks: "20 / 14",
    createdDate: "02-09-2025",
    dueDate: "6h left",
    color: "#9333ea",
  },
  {
    id: 2,
    projectName: "Marketing Campaign",
    status: "In Progress",
    progress: 45,
    totalTasks: "15 / 8",
    createdDate: "05-09-2025",
    dueDate: "2d left",
    color: "#10b981",
  },
]

export default function TaskTable() {
  return (
    <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Task Monitoring</h3>
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-semibold text-white mb-4">Today's Tasks</h4>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#050509] border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#050509] border border-white/10 text-gray-300 hover:bg-white/5 transition-colors text-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="p-2 rounded-xl bg-[#050509] border border-white/10 text-gray-300 hover:bg-white/5 transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Project Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Progress
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Total Tasks
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Created Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${task.color}20` }}
                    >
                      <svg
                        className="w-6 h-6"
                        style={{ color: task.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-white">{task.projectName}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    {task.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full transition-all"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-white min-w-[3rem]">
                      {task.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white">{task.totalTasks}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-400">{task.createdDate}</span>
                </td>
                <td className="py-4 px-4">
                  <span className="text-sm text-white">{task.dueDate}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
