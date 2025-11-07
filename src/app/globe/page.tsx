'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Users, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { WorkersByCountry } from '@/lib/supabase'

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// Country coordinates for Pacific nations
const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'Fiji': { lat: -17.7134, lng: 178.0650 },
  'Samoa': { lat: -13.7590, lng: -172.1046 },
  'Tonga': { lat: -21.1789, lng: -175.1982 },
  'Vanuatu': { lat: -15.3767, lng: 166.9592 },
  'Papua New Guinea': { lat: -6.3150, lng: 143.9555 },
  'Solomon Islands': { lat: -9.6457, lng: 160.1562 },
  'Kiribati': { lat: -3.3704, lng: -168.7340 },
  'Tuvalu': { lat: -7.1095, lng: 177.6493 },
  'Nauru': { lat: -0.5228, lng: 166.9315 },
  'Timor-Leste': { lat: -8.8742, lng: 125.7275 },
  'Australia': { lat: -25.2744, lng: 133.7751 }
}

interface GlobePoint {
  lat: number
  lng: number
  size: number
  color: string
  country: string
  workers: number
}

export default function GlobePage() {
  const [workersByCountry, setWorkersByCountry] = useState<WorkersByCountry[]>([])
  const [globePoints, setGlobePoints] = useState<GlobePoint[]>([])
  const [loading, setLoading] = useState(true)
  const globeEl = useRef<any>()

  useEffect(() => {
    fetchWorkerData()
  }, [])

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.5

      // Point camera at Pacific region
      globeEl.current.pointOfView({ lat: -15, lng: 170, altitude: 2 }, 1000)
    }
  }, [globeEl])

  async function fetchWorkerData() {
    try {
      const response = await fetch('/api/dashboard/workers?groupBy=country')
      const data: WorkersByCountry[] = await response.json()
      setWorkersByCountry(data)

      // Convert to globe points
      const points: GlobePoint[] = data
        .filter(country => COUNTRY_COORDINATES[country.country])
        .map(country => {
          const coords = COUNTRY_COORDINATES[country.country]
          return {
            lat: coords.lat,
            lng: coords.lng,
            size: Math.max(0.2, Math.min(2, country.worker_count / 1000)),
            color: getColorByWorkerCount(country.worker_count),
            country: country.country,
            workers: country.worker_count
          }
        })

      // Add Australia as the destination
      if (points.length > 0) {
        const totalWorkers = points.reduce((sum, p) => sum + p.workers, 0)
        points.push({
          lat: COUNTRY_COORDINATES['Australia'].lat,
          lng: COUNTRY_COORDINATES['Australia'].lng,
          size: 2.5,
          color: '#3b82f6',
          country: 'Australia (Destination)',
          workers: totalWorkers
        })
      }

      setGlobePoints(points)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching worker data:', error)
      setLoading(false)
    }
  }

  function getColorByWorkerCount(count: number): string {
    if (count > 5000) return '#ef4444' // red
    if (count > 2000) return '#f59e0b' // orange
    if (count > 1000) return '#fbbf24' // yellow
    return '#10b981' // green
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading globe...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-gray-700"></div>
              <div>
                <h1 className="text-xl font-bold text-white">PALM Workers Globe View</h1>
                <p className="text-sm text-gray-400">Interactive 3D visualization of worker distribution</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Globe Visualization */}
        <div className="flex-1 relative" style={{ height: 'calc(100vh - 80px)' }}>
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
            pointsData={globePoints}
            pointLat="lat"
            pointLng="lng"
            pointColor="color"
            pointAltitude={0.01}
            pointRadius="size"
            pointLabel={(d: any) => `
              <div style="background: rgba(0,0,0,0.8); padding: 12px; border-radius: 8px; color: white;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${d.country}</div>
                <div style="color: #9ca3af; font-size: 12px;">${d.workers.toLocaleString()} workers</div>
              </div>
            `}
            atmosphereColor="#3b82f6"
            atmosphereAltitude={0.25}
          />

          {/* Legend */}
          <div className="absolute bottom-8 left-8 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-semibold mb-3 text-white">Worker Distribution</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">&lt; 1,000 workers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">1,000 - 2,000</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-300">2,000 - 5,000</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-300">&gt; 5,000 workers</span>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-300">Australia (Destination)</span>
              </div>
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-8 right-8 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg" style={{ minWidth: '200px' }}>
            <h3 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Statistics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Countries:</span>
                <span className="font-semibold text-white">{globePoints.length - 1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total Workers:</span>
                <span className="font-semibold text-white">
                  {globePoints.reduce((sum, p) => p.country !== 'Australia (Destination)' ? sum + p.workers : sum, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel - Country List */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Countries
            </h2>
            <div className="space-y-3">
              {workersByCountry
                .sort((a, b) => b.worker_count - a.worker_count)
                .map((country) => (
                  <div
                    key={country.country}
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{country.country}</span>
                      <span className="text-sm font-semibold text-blue-400">
                        {country.worker_count.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (country.worker_count / Math.max(...workersByCountry.map(c => c.worker_count))) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <span>{country.registration_rate}% registered</span>
                      <span>{country.worker_count} workers</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
