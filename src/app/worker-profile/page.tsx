'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Briefcase, Calendar, Award, MapPin, Phone } from 'lucide-react'
import Sidebar from '@/components/dashboard/Sidebar'
import DashboardStatCard from '@/components/dashboard/DashboardStatCard'
import PerformanceChart from '@/components/dashboard/PerformanceChart'
import SalesOverview from '@/components/dashboard/SalesOverview'
import TaskTable from '@/components/dashboard/TaskTable'

interface WorkerProfile {
  phone_number: string
  name: string
  country: string
  state: string
  postcode: string
  city: string
  industry: string
  employer: string
  visa_type: string
  created_at: string
  registration_complete: boolean
}

function WorkerProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone')

  const [worker, setWorker] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!phone) {
      setError('No phone number provided')
      setLoading(false)
      return
    }

    fetchWorkerProfile(phone)
  }, [phone])

  async function fetchWorkerProfile(phoneNumber: string) {
    try {
      const response = await fetch(`/api/dashboard/worker-profile?phone=${encodeURIComponent(phoneNumber)}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Worker not found or not registered via WhatsApp')
        } else {
          setError('Failed to load profile')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      setWorker(data)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching worker profile:', err)
      setError('Failed to load profile')
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/globe-workers')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            Return to Globe
          </button>
        </div>
      </div>
    )
  }

  const daysRegistered = Math.floor((Date.now() - new Date(worker.created_at).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="flex min-h-screen bg-[#050509] text-gray-100">
      <Sidebar
        userName={worker.name}
        userEmail={`${worker.phone_number.slice(-4)}@palm.worker`}
        userPhone={worker.phone_number}
      />

      <main className="flex-1 px-8 py-6 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6">
          <button
            onClick={() => router.push('/globe-workers')}
            className="text-gray-500 hover:text-white transition-colors"
          >
            Globe
          </button>
          <span className="text-gray-500">/</span>
          <span className="text-white font-medium">Worker Profile</span>
        </div>

        {/* Profile Header */}
        <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-8 shadow-lg mb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-emerald-500 flex items-center justify-center text-2xl font-bold text-white">
                {worker.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-4 border-[#0b0b10]" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{worker.name}</h1>
              <p className="text-gray-400 mb-4">PALM Program Worker from {worker.country}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>{worker.phone_number}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span>{daysRegistered} days registered</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <span>{worker.city}, {worker.state}</span>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <DashboardStatCard
            label="Industry"
            value={worker.industry || 'Not specified'}
            icon={Briefcase}
          />
          <DashboardStatCard
            label="Days Registered"
            value={daysRegistered}
            trendLabel="+12% activity"
            trendColor="positive"
            icon={Calendar}
          />
          <DashboardStatCard
            label="Visa Type"
            value={worker.visa_type || 'Not specified'}
            icon={Award}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <PerformanceChart />
          </div>
          <div>
            <SalesOverview />
          </div>
        </div>

        {/* Profile Details Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information */}
          <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              Personal Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                <p className="text-white font-medium">{worker.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Country of Origin</label>
                <p className="text-white font-medium">{worker.country}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Phone Number</label>
                <p className="text-white font-medium">{worker.phone_number}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Registration Status</label>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Complete
                </span>
              </div>
            </div>
          </div>

          {/* Work Information */}
          <div className="rounded-2xl bg-[#0b0b10] border border-white/5 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" />
              Work Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Industry</label>
                <p className="text-white font-medium">{worker.industry || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Employer</label>
                <p className="text-white font-medium">{worker.employer || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Visa Type</label>
                <p className="text-white font-medium">{worker.visa_type || 'Not specified'}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-1">Location</label>
                <p className="text-white font-medium">{worker.city}, {worker.state} {worker.postcode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <TaskTable />
      </main>
    </div>
  )
}

export default function WorkerProfilePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading profile...</p>
        </div>
      </div>
    }>
      <WorkerProfileContent />
    </Suspense>
  )
}
