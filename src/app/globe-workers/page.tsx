'use client'

import { useEffect, useState, useRef } from 'react'
import Map, { Marker, MapRef } from 'react-map-gl/mapbox'
import { Users, Sparkles, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { postcodeToCoordinates, addJitter } from '@/lib/postcodeToCoordinates'
import WorkerSummaryCard from '@/components/WorkerSummaryCard'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9iYnk2OTciLCJhIjoiY21oZGJvbG50MDFkZzJqcHZyMm5mdTgzeCJ9.5ZmkgB0UpC-wgVy_f6b8HA'

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
  const router = useRouter()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [globePoints, setGlobePoints] = useState<GlobePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<GlobePoint | null>(null)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    fetchWorkerData()
    // Check if user has phone number in localStorage (for WhatsApp users)
    const phone = localStorage.getItem('whatsapp_user_phone')
    setUserPhone(phone)
  }, [])

  // Auto-rotate globe effect
  useEffect(() => {
    if (!mapRef.current) return

    let userInteracting = false
    let spinEnabled = true
    let lastInteraction = Date.now()

    const spinGlobe = () => {
      if (!mapRef.current || userInteracting || !spinEnabled) return

      const map = mapRef.current.getMap()
      const center = map.getCenter()

      // Rotate 0.2 degrees per frame (slow rotation)
      map.easeTo({
        center: [center.lng + 0.2, center.lat],
        duration: 1000,
        easing: (t: number) => t
      })
    }

    // Set up rotation interval
    const spinInterval = setInterval(spinGlobe, 1000)

    // Pause rotation on user interaction
    const handleInteractionStart = () => {
      userInteracting = true
      lastInteraction = Date.now()
    }

    const handleInteractionEnd = () => {
      userInteracting = false
      // Resume spinning after 2 seconds of no interaction
      setTimeout(() => {
        if (Date.now() - lastInteraction >= 2000) {
          userInteracting = false
        }
      }, 2000)
    }

    const map = mapRef.current.getMap()
    map.on('mousedown', handleInteractionStart)
    map.on('touchstart', handleInteractionStart)
    map.on('moveend', handleInteractionEnd)

    return () => {
      clearInterval(spinInterval)
      if (mapRef.current) {
        const map = mapRef.current.getMap()
        map.off('mousedown', handleInteractionStart)
        map.off('touchstart', handleInteractionStart)
        map.off('moveend', handleInteractionEnd)
      }
    }
  }, [loading])


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
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                PALM Workers - Spreading Light
              </h1>
              <p className="text-sm text-gray-400">Each dot represents a worker's voice and presence</p>
            </div>
            {userPhone && (
              <button
                onClick={() => router.push(`/worker-profile?phone=${userPhone}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mapbox Globe Visualization - Full Width */}
      <div className="relative" style={{ height: 'calc(100vh - 80px)' }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 133,
            latitude: -25,
            zoom: 3.5,
            pitch: 0,
            bearing: 0
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/navigation-night-v1"
          projection={{ name: 'globe' } as any}
          fog={{
            color: 'rgb(40, 45, 55)',
            'high-color': 'rgb(20, 25, 35)',
            'horizon-blend': 0.05,
            'space-color': 'rgb(5, 8, 15)',
            'star-intensity': 0.8
          }}
        >
            {/* Worker markers with glowing effect */}
            {globePoints.map((point, index) => (
              <Marker
                key={index}
                longitude={point.lng}
                latitude={point.lat}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  handlePointClick(point)
                }}
              >
                <div
                  className="worker-marker"
                  style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer'
                  }}
                  title={`${point.name} - ${point.country}`}
                >
                  {/* Outer pulsating ring - largest */}
                  <div
                    className="pulse-ring-outer"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, transparent 30%, ${point.color}33 50%, transparent 80%)`,
                      boxShadow: `0 0 40px ${point.color}99, 0 0 60px ${point.color}66`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />

                  {/* Middle pulsating ring */}
                  <div
                    className="pulse-ring-middle"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${point.color}66 0%, ${point.color}99 40%, ${point.color}33 70%, transparent 100%)`,
                      boxShadow: `
                        0 0 20px ${point.color}CC,
                        0 0 30px ${point.color}99,
                        0 0 40px ${point.color}66
                      `,
                      animationDelay: `${index * 0.15}s`
                    }}
                  />

                  {/* Inner glowing ring */}
                  <div
                    className="pulse-ring-inner"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${point.color} 0%, ${point.color}EE 50%, ${point.color}99 80%, transparent 100%)`,
                      boxShadow: `
                        0 0 10px ${point.color}FF,
                        0 0 20px ${point.color}EE,
                        0 0 30px ${point.color}CC
                      `,
                      animationDelay: `${index * 0.1}s`
                    }}
                  />

                  {/* Bright white core with glow */}
                  <div
                    className="core-glow"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '8px',
                      height: '8px',
                      background: '#FFFFFF',
                      borderRadius: '50%',
                      boxShadow: `
                        0 0 8px #FFFFFF,
                        0 0 12px ${point.color}FF,
                        0 0 16px ${point.color}CC
                      `,
                      zIndex: 10
                    }}
                  />
                </div>
              </Marker>
            ))}
          </Map>

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
