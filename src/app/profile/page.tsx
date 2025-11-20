'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  FileText, 
  CheckCircle, 
  Bell, 
  TrendingUp,
  ArrowLeft,
  Calendar,
  DollarSign,
  AlertTriangle,
  Shield,
  Eye,
  Clock
} from 'lucide-react'

interface UserProfile {
  phone: string
  name: string
  country: string
  state: string
  postcode: string
  city: string
  industry: string
  employer: string
  visa_type: string
  created_at: string
}

interface DashboardStats {
  documentsReviewed: number
  documentsChange: string
  complianceChecks: number
  complianceChange: string
  notesReceived: number
  notesChange: string
  complianceScore: number
  complianceImprovement: string
  payslipProgress: number
  payslipsAnalyzed: number
  totalPayslips: number
}

interface ComplianceIssue {
  type: string
  status: 'Action Required' | 'Under Review' | 'Resolved' | 'Pending' | 'Critical'
  severity: 'High' | 'Medium' | 'Low' | 'Critical'
  amount?: string
  dateDetected: string
}

interface DocumentActivity {
  date: string
  totalPending: number
  compliant: number
  otherDocuments: number
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [issues, setIssues] = useState<ComplianceIssue[]>([])
  const [documentActivity, setDocumentActivity] = useState<DocumentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [userPhone, setUserPhone] = useState<string | null>(null)

  useEffect(() => {
    // TESTING MODE - Always use mock data
    const mockProfile: UserProfile = {
      phone: '+61412345678',
      name: 'Test Worker',
      country: 'Fiji',
      state: 'NSW',
      postcode: '2000',
      city: 'Sydney',
      industry: 'Agriculture',
      employer: 'Test Farm',
      visa_type: 'PALM',
      created_at: new Date().toISOString()
    }
    
    const mockStats: DashboardStats = {
      documentsReviewed: 156,
      documentsChange: '+2 vs last month',
      complianceChecks: 89,
      complianceChange: '+2 vs last month',
      notesReceived: 43,
      notesChange: '+1 vs last month',
      complianceScore: 87,
      complianceImprovement: '+5% improvement this month',
      payslipProgress: 80.8,
      payslipsAnalyzed: 24,
      totalPayslips: 156
    }
    
    const mockIssues: ComplianceIssue[] = [
      {
        type: 'Underpayment Detected',
        status: 'Action Required',
        severity: 'High',
        amount: '$457.32',
        dateDetected: '2 days ago'
      },
      {
        type: 'Missing Superannuation',
        status: 'Under Review',
        severity: 'Medium',
        amount: '$85.45',
        dateDetected: '1 week ago'
      },
      {
        type: 'Overtime Not Paid',
        status: 'Resolved',
        severity: 'Low',
        amount: '$234.00',
        dateDetected: '2 weeks ago'
      },
      {
        type: 'Contract Violation',
        status: 'Pending',
        severity: 'Critical',
        amount: '-',
        dateDetected: '3 days ago'
      },
      {
        type: 'Incorrect Pay Rate',
        status: 'Action Required',
        severity: 'High',
        amount: '$123.06',
        dateDetected: '5 days ago'
      }
    ]
    
    // Set all mock data immediately
    setProfile(mockProfile)
    setStats(mockStats)
    setIssues(mockIssues)
    setUserPhone('+61412345678')
    setLoading(false)
  }, [])

  async function fetchUserProfile(phone: string) {
    try {
      // Fetch user profile
      const profileRes = await fetch(`/api/dashboard/worker-profile?phone=${encodeURIComponent(phone)}`)
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }

      // Fetch dashboard stats
      const statsRes = await fetch(`/api/profile/stats?phone=${encodeURIComponent(phone)}`)
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      // Fetch compliance issues
      const issuesRes = await fetch(`/api/profile/issues?phone=${encodeURIComponent(phone)}`)
      if (issuesRes.ok) {
        const issuesData = await issuesRes.json()
        setIssues(issuesData)
      }

      // Fetch document activity
      const activityRes = await fetch(`/api/profile/activity?phone=${encodeURIComponent(phone)}`)
      if (activityRes.ok) {
        const activityData = await activityRes.json()
        setDocumentActivity(activityData)
      }

      setLoading(false)
    } catch (error) {
      console.error('Error fetching profile data:', error)
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'High':
        return 'bg-red-500/20 text-red-400 border-red-500/50'
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
      case 'Low':
        return 'bg-green-500/20 text-green-400 border-green-500/50'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical':
      case 'Action Required':
        return 'bg-red-600 text-white'
      case 'Under Review':
        return 'bg-yellow-600 text-white'
      case 'Resolved':
        return 'bg-green-600 text-white'
      case 'Pending':
        return 'bg-blue-600 text-white'
      default:
        return 'bg-gray-600 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading while data is being set
  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Default stats if API doesn't return data yet
  const displayStats = stats || {
    documentsReviewed: 156,
    documentsChange: '+2 vs last month',
    complianceChecks: 89,
    complianceChange: '+2 vs last month',
    notesReceived: 43,
    notesChange: '+1 vs last month',
    complianceScore: 87,
    complianceImprovement: '+5% improvement this month',
    payslipProgress: 80.8,
    payslipsAnalyzed: 24,
    totalPayslips: 156
  }

  const displayIssues = issues.length > 0 ? issues : [
    {
      type: 'Underpayment Detected',
      status: 'Action Required' as const,
      severity: 'High' as const,
      amount: '$457.32',
      dateDetected: '2 days ago'
    },
    {
      type: 'Missing Superannuation',
      status: 'Under Review' as const,
      severity: 'Medium' as const,
      amount: '$85.45',
      dateDetected: '1 week ago'
    },
    {
      type: 'Overtime Not Paid',
      status: 'Resolved' as const,
      severity: 'Low' as const,
      amount: '$234.00',
      dateDetected: '2 weeks ago'
    },
    {
      type: 'Contract Violation',
      status: 'Pending' as const,
      severity: 'Critical' as const,
      amount: '-',
      dateDetected: '3 days ago'
    },
    {
      type: 'Incorrect Pay Rate',
      status: 'Action Required' as const,
      severity: 'High' as const,
      amount: '$123.06',
      dateDetected: '5 days ago'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <header className="bg-[#0f1424] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/globe-workers')}
                className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  🔥 Talofa {profile.name.split(' ')[0]}!
                </h1>
                <p className="text-sm text-gray-400">Your rights protection dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3 bg-white/5 px-3 py-2 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-sm font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Documents Reviewed */}
          <div className="bg-[#0f1424] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm text-gray-400">Documents Reviewed</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{displayStats.documentsReviewed}</p>
              <p className="text-sm text-green-400 mt-1">{displayStats.documentsChange}</p>
            </div>
          </div>

          {/* Compliance Checks */}
          <div className="bg-[#0f1424] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <span className="text-sm text-gray-400">Compliance Checks</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{displayStats.complianceChecks}</p>
              <p className="text-sm text-green-400 mt-1">{displayStats.complianceChange}</p>
            </div>
          </div>

          {/* Notes Received */}
          <div className="bg-[#0f1424] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-400">Notes Received</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-4xl font-bold text-white">{displayStats.notesReceived}</p>
              <p className="text-sm text-green-400 mt-1">{displayStats.notesChange}</p>
            </div>
          </div>
        </div>

        {/* Main Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Compliance Health Score */}
          <div className="bg-[#0f1424] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Compliance Health Score</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeDasharray={`${displayStats.complianceScore * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{displayStats.complianceScore}%</span>
                  <span className="text-xs text-emerald-400 font-medium">Excellent Protection</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">Your Rights Protection Level</p>
                <p className="text-xs text-gray-500 mt-1">Based on 64 documents analyzed</p>
                <p className="text-sm text-green-400 mt-2 flex items-center justify-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {displayStats.complianceImprovement}
                </p>
              </div>
            </div>
          </div>

          {/* Document Review Timeline */}
          <div className="lg:col-span-2 bg-[#0f1424] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Document Review Timeline</h2>
              </div>
              <button className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <Clock className="w-4 h-4" />
                This week
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4 flex-1">
                  <span className="text-gray-400 w-24">21 Documents</span>
                  <div className="flex-1 flex items-center gap-1">
                    <span className="text-blue-400 text-xs">10% vs last week</span>
                  </div>
                </div>
              </div>
              {/* Bar Chart */}
              <div className="h-64 flex items-end gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const heights = [60, 80, 45, 90, 75, 40, 30]
                  const colors = index === 3 ? 'bg-blue-500' : 'bg-red-500'
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-800 rounded-t-lg relative overflow-hidden" style={{ height: `${heights[index]}%` }}>
                        <div className={`w-full ${colors} absolute bottom-0 rounded-t-lg transition-all`} style={{ height: '100%' }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span className="text-xs text-gray-400">Total Pending: <strong className="text-white">15</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs text-gray-400">Compliant: <strong className="text-white">4</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-600 rounded"></div>
                  <span className="text-xs text-gray-400">Other Documents: <strong className="text-white">2</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payslip Review Progress */}
          <div className="bg-[#0f1424] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Payslip Review Progress</h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40">
                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="8"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="8"
                    strokeDasharray={`${displayStats.payslipProgress * 2.51} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-white">{displayStats.payslipProgress.toFixed(1)}%</span>
                  <span className="text-xs text-blue-400 font-medium">Analyzed</span>
                </div>
              </div>
              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Payslips</span>
                  <span className="text-white font-medium">{displayStats.totalPayslips}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Documents Analyzed</span>
                  <span className="text-green-400 font-medium flex items-center gap-1">
                    {displayStats.payslipsAnalyzed}
                    <span className="text-xs bg-green-500/20 px-1.5 py-0.5 rounded">+8%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Total Reviewed</span>
                  <span className="text-white font-medium">{displayStats.totalPayslips}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Check Reports */}
          <div className="lg:col-span-2 bg-[#0f1424] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="text-lg font-semibold text-white">Compliance Check Reports</h2>
              </div>
              <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1">
                Filter
              </button>
            </div>
            <div className="space-y-3">
              <div className="text-sm text-gray-400 mb-4">
                <h3 className="font-semibold text-white mb-2">Recent Issues & Resolutions</h3>
                <input
                  type="text"
                  placeholder="Search by issue type or status..."
                  className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Issue Type</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Severity</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Date Detected</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayIssues.map((issue, index) => (
                      <tr key={index} className="border-b border-gray-800/50 hover:bg-white/5 transition-colors">
                        <td className="py-3 text-sm text-white">{issue.type}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded border text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-white font-medium">{issue.amount}</td>
                        <td className="py-3 text-sm text-gray-400">{issue.dateDetected}</td>
                        <td className="py-3">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

