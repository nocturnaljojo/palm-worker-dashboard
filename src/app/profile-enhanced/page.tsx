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
  Clock,
  Upload,
  MessageSquare,
  Phone,
  FileCheck,
  Award,
  Activity,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Target,
  Mic
} from 'lucide-react'
import VoiceToEmailModal from '@/components/VoiceToEmailModal'

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
  totalRecovered: number
  issuesResolved: number
  avgResolutionDays: number
}

interface ComplianceIssue {
  type: string
  status: 'Action Required' | 'Under Review' | 'Resolved' | 'Pending' | 'Critical'
  severity: 'High' | 'Medium' | 'Low' | 'Critical'
  amount?: string
  dateDetected: string
}

interface ActivityItem {
  id: string
  type: 'upload' | 'check' | 'issue' | 'message' | 'payment'
  title: string
  description: string
  timestamp: string
  icon: any
  color: string
}

interface Alert {
  id: string
  type: 'warning' | 'info' | 'success' | 'danger'
  title: string
  message: string
  actionText?: string
  actionUrl?: string
}

export default function ProfileEnhancedPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [issues, setIssues] = useState<ComplianceIssue[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)

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
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString() // 45 days ago
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
      totalPayslips: 156,
      totalRecovered: 1234.56,
      issuesResolved: 12,
      avgResolutionDays: 14
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

    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'upload',
        title: 'Payslip Uploaded',
        description: 'Weekly payslip for 01-07 Nov analyzed',
        timestamp: '2 hours ago',
        icon: FileText,
        color: 'blue'
      },
      {
        id: '2',
        type: 'issue',
        title: 'Issue Detected',
        description: 'Underpayment of $457.32 identified',
        timestamp: '5 hours ago',
        icon: AlertTriangle,
        color: 'red'
      },
      {
        id: '3',
        type: 'check',
        title: 'Compliance Check Complete',
        description: 'October payroll verified',
        timestamp: '1 day ago',
        icon: CheckCircle2,
        color: 'green'
      },
      {
        id: '4',
        type: 'message',
        title: 'Message from Advisor',
        description: 'Response to your superannuation query',
        timestamp: '2 days ago',
        icon: MessageSquare,
        color: 'purple'
      },
      {
        id: '5',
        type: 'payment',
        title: 'Recovery Payment',
        description: '$234.00 credited to your account',
        timestamp: '3 days ago',
        icon: DollarSign,
        color: 'emerald'
      }
    ]

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'danger',
        title: 'Action Required',
        message: '2 compliance issues need your attention',
        actionText: 'Review Issues',
        actionUrl: '#issues'
      },
      {
        id: '2',
        type: 'warning',
        title: 'Upcoming Deadline',
        message: 'Your next payslip should arrive in 2 days',
        actionText: 'Set Reminder'
      },
      {
        id: '3',
        type: 'success',
        title: 'Great Progress!',
        message: '3 issues were resolved this week',
        actionText: 'View Details'
      }
    ]
    
    // Set all mock data immediately
    setProfile(mockProfile)
    setStats(mockStats)
    setIssues(mockIssues)
    setActivities(mockActivities)
    setAlerts(mockAlerts)
    setUserPhone('+61412345678')
    setLoading(false)
  }, [])

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

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'danger':
        return 'bg-red-500/10 border-red-500/50 text-red-400'
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400'
      case 'success':
        return 'bg-green-500/10 border-green-500/50 text-green-400'
      case 'info':
        return 'bg-blue-500/10 border-blue-500/50 text-blue-400'
      default:
        return 'bg-gray-500/10 border-gray-500/50 text-gray-400'
    }
  }

  const getActivityColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-400',
      red: 'bg-red-500/20 text-red-400',
      green: 'bg-green-500/20 text-green-400',
      purple: 'bg-purple-500/20 text-purple-400',
      emerald: 'bg-emerald-500/20 text-emerald-400',
      yellow: 'bg-yellow-500/20 text-yellow-400'
    }
    return colors[color] || colors.blue
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#5f6c7b] flex items-center justify-center">
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
      <div className="min-h-screen bg-[#5f6c7b] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const daysRegistered = Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-[#5f6c7b] text-white">
      {/* Header */}
      <header className="bg-[#4a5663] border-b border-gray-700">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Smart Alerts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`${getAlertColor(alert.type)} border rounded-xl p-4 hover:shadow-lg hover:shadow-cyan-500/10 transition-all backdrop-blur-sm bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-sm">{alert.title}</h3>
                {alert.type === 'danger' && <AlertCircle className="w-5 h-5" />}
                {alert.type === 'warning' && <Clock className="w-5 h-5" />}
                {alert.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              </div>
              <p className="text-xs opacity-90 mb-3">{alert.message}</p>
              {alert.actionText && (
                <button className="text-xs font-medium hover:underline">
                  {alert.actionText} →
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all group">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">Upload Payslip</h3>
            <p className="text-xs text-gray-400">Add new document</p>
          </button>

          <button 
            onClick={() => router.push('/documents')}
            className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/20 transition-all group"
          >
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">My Documents</h3>
            <p className="text-xs text-gray-400">View all files</p>
          </button>

          <button 
            onClick={() => setIsVoiceModalOpen(true)}
            className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative">
              <Mic className="w-6 h-6 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
            </div>
            <h3 className="font-semibold text-white mb-1">Speak Issue</h3>
            <p className="text-xs text-gray-400">Voice to email</p>
          </button>

          <button 
            onClick={() => router.push('/documents')}
            className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all group"
          >
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="font-semibold text-white mb-1">All Documents</h3>
            <p className="text-xs text-gray-400">Browse files</p>
          </button>
        </div>

        {/* Recovery Tracker */}
        <div className="bg-gradient-to-r from-cyan-900/40 via-blue-900/40 to-teal-900/40 backdrop-blur-sm border border-cyan-500/40 rounded-xl p-6 shadow-lg shadow-cyan-500/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Recovery Tracker</h2>
                <p className="text-xs text-gray-400">Money recovered for you</p>
              </div>
            </div>
            <button className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              View History →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Recovered</p>
              <p className="text-3xl font-bold text-cyan-400">${stats?.totalRecovered.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Issues Resolved</p>
              <p className="text-3xl font-bold text-white">{stats?.issuesResolved}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Avg Resolution Time</p>
              <p className="text-3xl font-bold text-white">{stats?.avgResolutionDays} <span className="text-lg text-gray-400">days</span></p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Stats & Compliance */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-sm text-gray-400">Documents</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.documentsReviewed}</p>
                <p className="text-sm text-green-400 mt-1">{stats?.documentsChange}</p>
              </div>

              <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-sm text-gray-400">Compliance</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.complianceChecks}</p>
                <p className="text-sm text-green-400 mt-1">{stats?.complianceChange}</p>
              </div>

              <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-sm text-gray-400">Notes</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.notesReceived}</p>
                <p className="text-sm text-green-400 mt-1">{stats?.notesChange}</p>
              </div>
            </div>

            {/* Compliance Score & Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Compliance Score */}
              <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Compliance Health</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="8"
                        strokeDasharray={`${(stats?.complianceScore || 0) * 2.51} 251`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{stats?.complianceScore}%</span>
                      <span className="text-xs text-emerald-400 font-medium">Excellent</span>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm text-green-400 flex items-center justify-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {stats?.complianceImprovement}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payslip Progress */}
              <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Payslip Review</h2>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32">
                    <svg className="transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#1f2937"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        strokeDasharray={`${(stats?.payslipProgress || 0) * 2.51} 251`}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-white">{stats?.payslipProgress.toFixed(1)}%</span>
                      <span className="text-xs text-blue-400 font-medium">Analyzed</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Analyzed</span>
                      <span className="text-white font-medium">{stats?.payslipsAnalyzed}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total</span>
                      <span className="text-white font-medium">{stats?.totalPayslips}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues Table */}
            <div id="issues" className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">Compliance Issues</h2>
                </div>
                <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Filter
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800 text-left">
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Issue</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Status</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Severity</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Amount</th>
                      <th className="pb-3 text-xs font-semibold text-gray-400 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.slice(0, 5).map((issue, index) => (
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
                        <td className="py-3">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - Activity Feed */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
              </div>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.color)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white">{activity.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <button className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors text-center">
                View All Activity →
              </button>
            </div>

            {/* Issue Resolution Pipeline */}
            <div className="bg-gradient-to-br from-[#0d1f2d]/80 to-[#0a1929]/80 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <Target className="w-5 h-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Resolution Pipeline</h2>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Detected</span>
                    <span className="text-lg font-bold text-white">5</span>
                  </div>
                  <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/30">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full shadow-lg shadow-red-500/30" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Reported</span>
                    <span className="text-lg font-bold text-white">3</span>
                  </div>
                  <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/30">
                    <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full shadow-lg shadow-yellow-500/30" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Under Review</span>
                    <span className="text-lg font-bold text-white">2</span>
                  </div>
                  <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/30">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full shadow-lg shadow-cyan-500/30" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Resolved</span>
                    <span className="text-lg font-bold text-white">15</span>
                  </div>
                  <div className="h-2 bg-cyan-950/50 rounded-full overflow-hidden border border-cyan-900/30">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full shadow-lg shadow-emerald-500/30" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Voice to Email Modal */}
      <VoiceToEmailModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        userProfile={profile ? {
          name: profile.name,
          phone: profile.phone,
          email: `${profile.phone}@palm.worker`
        } : undefined}
      />
    </div>
  )
}

