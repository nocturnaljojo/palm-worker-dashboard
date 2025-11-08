'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Users, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { postcodeToCoordinates, addJitter } from '@/lib/postcodeToCoordinates'
import Avatar from '@/components/Avatar'
import WorkerSummaryCard from '@/components/WorkerSummaryCard'

// Dynamically import Globe to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

interface Worker {
  phone: string
  name: string
  country: string
  state: string | null
  postcode: string | null
  industry: string | null
  employer: string | null
  visa_type: string | null
  created_at: string
  updated_at: string
  registration_complete: boolean
}

interface GlobePoint {
  lat: number
  lng: number
  size: number
  color: string
  name: string
  phone: string
  country: string
  state: string
  postcode: string
  city: string
  industry: string
}

export default function GlobeWorkersPage() {
  const [workers, setWorkers] = useState<Worker[]>([])
  const [globePoints, setGlobePoints] = useState<GlobePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<GlobePoint | null>(null)
  const globeEl = useRef<any>()

  useEffect(() => {
    fetchWorkerData()
  }, [])

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate the globe
      globeEl.current.controls().autoRotate = true
      globeEl.current.controls().autoRotateSpeed = 0.3

      // Point camera at Australia
      globeEl.current.pointOfView({ lat: -25, lng: 133, altitude: 2.5 }, 1000)
    }
  }, [globeEl])

  async function fetchWorkerData() {
    try {
      const response = await fetch('/api/dashboard/workers-map')
      const data: Worker[] = await response.json()
      setWorkers(data)

      // Convert to globe points with postcode coordinates
      const points: GlobePoint[] = data
        .map((worker, index) => {
          const coords = postcodeToCoordinates(worker.postcode)
          if (!coords) return null

          // Add small jitter to prevent exact overlaps
          const jitteredCoords = addJitter(coords, index)

          return {
            lat: jitteredCoords.lat,
            lng: jitteredCoords.lng,
            size: 0.3, // Consistent size for individual workers
            color: getColorByCountry(worker.country),
            name: worker.name,
            phone: worker.phone,
            country: worker.country,
            state: worker.state || 'Unknown',
            postcode: worker.postcode || 'Unknown',
            city: coords.city,
            industry: worker.industry || 'Unknown'
          }
        })
        .filter(Boolean) as GlobePoint[]

      setGlobePoints(points)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching worker data:', error)
      setLoading(false)
    }
  }

  function getColorByCountry(country: string): string {
    const countryColors: Record<string, string> = {
      'Fiji': '#10b981',        // Green
      'Samoa': '#3b82f6',       // Blue
      'Tonga': '#f59e0b',       // Orange
      'Vanuatu': '#8b5cf6',     // Purple
      'Papua New Guinea': '#ef4444', // Red
      'Solomon Islands': '#14b8a6', // Teal
      'Kiribati': '#f97316',    // Deep orange
      'Tuvalu': '#06b6d4',      // Cyan
      'Timor-Leste': '#ec4899', // Pink
      'Nauru': '#a855f7',       // Violet
    }
    return countryColors[country] || '#6b7280' // Default gray
  }

  function handlePointClick(point: any) {
    setSelectedWorker(point)
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
                <h1 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  PALM Workers - Spreading Light
                </h1>
                <p className="text-sm text-gray-400">Each dot represents a worker's voice and presence</p>
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
            onPointClick={handlePointClick}
            pointLabel={(d: any) => `
              <div style="
                background: linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(30,30,30,0.95) 100%);
                padding: 16px;
                border-radius: 12px;
                color: white;
                min-width: 200px;
                border: 2px solid ${d.color};
                box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${d.color}40;
              ">
                <div style="
                  display: flex;
                  align-items: center;
                  gap: 12px;
                  margin-bottom: 12px;
                ">
                  <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${d.color};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                    box-shadow: 0 0 20px ${d.color}80;
                  ">
                    ${d.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style="font-weight: 700; font-size: 16px; margin-bottom: 2px;">${d.name}</div>
                    <div style="color: #9ca3af; font-size: 12px;">${d.country}</div>
                  </div>
                </div>
                <div style="
                  padding-top: 12px;
                  border-top: 1px solid rgba(255,255,255,0.1);
                  font-size: 13px;
                  color: #d1d5db;
                ">
                  <div style="margin-bottom: 6px;">📍 ${d.city}, ${d.state}</div>
                  <div style="margin-bottom: 6px;">🏢 ${d.industry}</div>
                  <div style="color: ${d.color}; font-weight: 600; margin-top: 10px;">
                    Click to view full profile →
                  </div>
                </div>
              </div>
            `}
            atmosphereColor="#3b82f6"
            atmosphereAltitude={0.25}
            // Custom point rendering for glowing effect
            htmlElementsData={globePoints}
            htmlLat="lat"
            htmlLng="lng"
            htmlAltitude={0.01}
            htmlElement={(d: any) => {
              const el = document.createElement('div')
              el.style.cssText = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: ${d.color};
                box-shadow: 0 0 10px ${d.color}, 0 0 20px ${d.color}80, 0 0 30px ${d.color}40;
                cursor: pointer;
                animation: pulse 2s ease-in-out infinite;
              `
              el.onclick = () => handlePointClick(d)
              return el
            }}
          />

          {/* Add keyframe animation for pulsing glow */}
          <style jsx global>{`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.2);
                opacity: 0.8;
              }
            }
          `}</style>

          {/* Legend */}
          <div className="absolute bottom-8 left-8 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg">
            <h3 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Legend - Each Light Represents a Worker
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 10px #10b981' }}></div>
                <span className="text-gray-300">Fiji</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" style={{ boxShadow: '0 0 10px #3b82f6' }}></div>
                <span className="text-gray-300">Samoa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" style={{ boxShadow: '0 0 10px #f59e0b' }}></div>
                <span className="text-gray-300">Tonga</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" style={{ boxShadow: '0 0 10px #8b5cf6' }}></div>
                <span className="text-gray-300">Vanuatu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" style={{ boxShadow: '0 0 10px #14b8a6' }}></div>
                <span className="text-gray-300">Solomon Islands</span>
              </div>
              <p className="pt-2 border-t border-gray-700 text-gray-400 italic">
                Click any light to see worker details
              </p>
            </div>
          </div>

          {/* Stats Overlay */}
          <div className="absolute top-8 right-8 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg" style={{ minWidth: '220px' }}>
            <h3 className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
              <Users className="w-4 h-4" />
              Statistics
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Lights Shining:</span>
                <span className="font-semibold text-white text-lg">{globePoints.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Countries:</span>
                <span className="font-semibold text-white">
                  {new Set(workers.map(w => w.country)).size}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Australian States:</span>
                <span className="font-semibold text-white">
                  {new Set(workers.map(w => w.state).filter(Boolean)).size}
                </span>
              </div>
              <p className="pt-3 border-t border-gray-700 text-gray-400 italic text-[10px]">
                "Each light represents a voice, a story, and hope for those who cannot speak."
              </p>
            </div>
          </div>
        </div>

        {/* Side Panel - Recent Workers */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Recent Workers
            </h2>
            <div className="space-y-3">
              {workers.slice(0, 20).map((worker) => {
                const coords = postcodeToCoordinates(worker.postcode)
                return (
                  <div
                    key={worker.phone}
                    className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors cursor-pointer"
                    onClick={() => {
                      const coords = postcodeToCoordinates(worker.postcode)
                      if (coords) {
                        const jitteredCoords = addJitter(coords, workers.indexOf(worker))
                        setSelectedWorker({
                          lat: jitteredCoords.lat,
                          lng: jitteredCoords.lng,
                          size: 0.3,
                          color: getColorByCountry(worker.country),
                          name: worker.name,
                          phone: worker.phone,
                          country: worker.country,
                          state: worker.state || 'Unknown',
                          postcode: worker.postcode || 'Unknown',
                          city: coords.city,
                          industry: worker.industry || 'Unknown'
                        })
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div style={{
                        boxShadow: `0 0 10px ${getColorByCountry(worker.country)}`
                      }}>
                        <Avatar name={worker.name} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-white block truncate">{worker.name}</span>
                        <span className="text-xs text-gray-400">{worker.country}</span>
                      </div>
                    </div>
                    {coords && (
                      <div className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{coords.city}, {worker.state}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Worker Summary Card - Privacy-focused */}
      {selectedWorker && (
        <WorkerSummaryCard
          worker={{
            name: selectedWorker.name,
            country: selectedWorker.country,
            state: selectedWorker.state,
            city: selectedWorker.city,
            industry: selectedWorker.industry,
            postcode: selectedWorker.postcode
          }}
          color={selectedWorker.color}
          onClose={() => setSelectedWorker(null)}
        />
      )}
    </div>
  )
}
