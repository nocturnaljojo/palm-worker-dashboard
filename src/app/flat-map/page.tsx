'use client'

import { useEffect, useState, useRef } from 'react'
import Map, { Marker, MapRef, ScaleControl, NavigationControl } from 'react-map-gl/mapbox'
import { Users, Sparkles, User, Globe } from 'lucide-react'
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

export default function FlatMapPage() {
  const router = useRouter()
  const [workers, setWorkers] = useState<Worker[]>([])
  const [globePoints, setGlobePoints] = useState<GlobePoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWorker, setSelectedWorker] = useState<GlobePoint | null>(null)
  const [userPhone, setUserPhone] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const mapRef = useRef<MapRef>(null)

  useEffect(() => {
    fetchWorkerData()
    // Check if user has phone number in localStorage (for WhatsApp users)
    const phone = localStorage.getItem('whatsapp_user_phone')
    setUserPhone(phone)
  }, [])

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('stats-sidebar')
      const toggleButton = document.getElementById('sidebar-toggle')

      if (sidebarOpen && sidebar && toggleButton) {
        if (!sidebar.contains(event.target as Node) && !toggleButton.contains(event.target as Node)) {
          setSidebarOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [sidebarOpen])

  // Auto-focus on densest cluster after points are loaded
  useEffect(() => {
    if (globePoints.length > 0 && mapRef.current) {
      const center = findDensestCluster(globePoints)
      mapRef.current.flyTo({
        center: [center.lng, center.lat],
        zoom: 6.5, // Roughly 300km view radius
        duration: 2000
      })
    }
  }, [globePoints])

  // Find the center of the densest cluster of workers
  function findDensestCluster(points: GlobePoint[]): { lat: number; lng: number } {
    if (points.length === 0) return { lat: -25, lng: 133 }

    // Calculate average position (centroid) of all points
    const centroid = {
      lat: points.reduce((sum, p) => sum + p.lat, 0) / points.length,
      lng: points.reduce((sum, p) => sum + p.lng, 0) / points.length
    }

    return centroid
  }

  async function fetchWorkerData() {
    try {
      const response = await fetch('/api/dashboard/workers-map')
      const data = await response.json()

      console.log('Received worker data:', data)
      console.log('Data type:', typeof data, 'Is array:', Array.isArray(data))

      // Handle case where API returns an error object instead of array
      if (!Array.isArray(data)) {
        console.error('API did not return an array:', data)
        setWorkers([])
        setGlobePoints([])
        setLoading(false)
        return
      }

      console.log('Number of workers:', data.length)
      setWorkers(data)

      // Convert to globe points with postcode coordinates
      const points: GlobePoint[] = data
        .map((worker, index) => {
          console.log(`Processing worker ${worker.name}: postcode=${worker.postcode}, state=${worker.state}`)

          const coords = postcodeToCoordinates(worker.postcode)
          if (!coords) {
            console.log(`No coordinates found for postcode: ${worker.postcode}`)
            return null
          }

          console.log(`Got coordinates for ${worker.name}:`, coords)

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

      console.log(`Created ${points.length} globe points`)
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
          <p className="mt-4 text-gray-300">Loading map...</p>
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
                PALM Workers - Flat Map View
              </h1>
              <p className="text-sm text-gray-400">Each dot represents a worker's voice and presence</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/globe-workers')}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Switch to Globe</span>
              </button>
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
        </div>
      </header>

      {/* Scrolling Pacific Island Greetings Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 overflow-hidden border-b border-purple-500/30">
        <div className="animate-scroll whitespace-nowrap py-2 text-white/90 text-base font-medium" style={{ fontFamily: 'system-ui, -apple-system, "Segoe UI Emoji", "Noto Color Emoji", sans-serif' }}>
          <span className="inline-block px-8">🇫🇯 Na nomu vosa e vaka na cina.</span>
          <span className="inline-block px-8">🇰🇮 Aneneam akiia taian rauraro.</span>
          <span className="inline-block px-8">🇳🇷 Añu itsio ebow ian itirin.</span>
          <span className="inline-block px-8">🇵🇬 Toktok bilong yu i bringim lait.</span>
          <span className="inline-block px-8">🇼🇸 O lou si'ufofoga e fa'apupulaina ai le malamalama.</span>
          <span className="inline-block px-8">🇸🇧 Voes blong iu i bringim laet.</span>
          <span className="inline-block px-8">🇹🇱 Ita-nia lian lori mean.</span>
          <span className="inline-block px-8">🇹🇴 Hoʻo lea ʻoku ne fō mai ha mārama.</span>
          <span className="inline-block px-8">🇹🇻 Tou leo e fa'alamalama atu.</span>
          <span className="inline-block px-8">🇻🇺 Voes blong yu i bringim laet.</span>
          {/* Duplicate for seamless loop */}
          <span className="inline-block px-8">🇫🇯 Na nomu vosa e vaka na cina.</span>
          <span className="inline-block px-8">🇰🇮 Aneneam akiia taian rauraro.</span>
          <span className="inline-block px-8">🇳🇷 Añu itsio ebow ian itirin.</span>
          <span className="inline-block px-8">🇵🇬 Toktok bilong yu i bringim lait.</span>
          <span className="inline-block px-8">🇼🇸 O lou si'ufofoga e fa'apupulaina ai le malamalama.</span>
          <span className="inline-block px-8">🇸🇧 Voes blong iu i bringim laet.</span>
          <span className="inline-block px-8">🇹🇱 Ita-nia lian lori mean.</span>
          <span className="inline-block px-8">🇹🇴 Hoʻo lea ʻoku ne fō mai ha mārama.</span>
          <span className="inline-block px-8">🇹🇻 Tou leo e fa'alamalama atu.</span>
          <span className="inline-block px-8">🇻🇺 Voes blong yu i bringim laet.</span>
        </div>
      </div>

      {/* Flat Map Visualization - Full Width */}
      <div className="relative" style={{ height: 'calc(100vh - 120px)' }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: 133,
            latitude: -25,
            zoom: 4,
            pitch: 0,
            bearing: 0
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/navigation-night-v1"
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

            {/* Scale Control - shows distance */}
            <ScaleControl
              maxWidth={150}
              unit="metric"
              position="bottom-right"
              style={{
                marginBottom: '10px',
                marginRight: '10px'
              }}
            />

            {/* Navigation Control - zoom buttons */}
            <NavigationControl
              position="top-left"
              showCompass={false}
              style={{
                marginTop: '10px',
                marginLeft: '10px'
              }}
            />
          </Map>

          {/* Legend - Bottom Stacked */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800/95 border border-gray-700 rounded-lg px-6 py-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-semibold text-white">Legend:</span>
              </div>
              <div className="grid grid-cols-5 gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" style={{ boxShadow: '0 0 10px #10b981' }}></div>
                  <span className="text-xs text-gray-300">Fiji</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" style={{ boxShadow: '0 0 10px #3b82f6' }}></div>
                  <span className="text-xs text-gray-300">Samoa</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" style={{ boxShadow: '0 0 10px #f59e0b' }}></div>
                  <span className="text-xs text-gray-300">Tonga</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500" style={{ boxShadow: '0 0 10px #8b5cf6' }}></div>
                  <span className="text-xs text-gray-300">Vanuatu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" style={{ boxShadow: '0 0 10px #ef4444' }}></div>
                  <span className="text-xs text-gray-300">Papua New Guinea</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-teal-500" style={{ boxShadow: '0 0 10px #14b8a6' }}></div>
                  <span className="text-xs text-gray-300">Solomon Islands</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#f97316', boxShadow: '0 0 10px #f97316' }}></div>
                  <span className="text-xs text-gray-300">Kiribati</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#06b6d4', boxShadow: '0 0 10px #06b6d4' }}></div>
                  <span className="text-xs text-gray-300">Tuvalu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#ec4899', boxShadow: '0 0 10px #ec4899' }}></div>
                  <span className="text-xs text-gray-300">Timor-Leste</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: '#a855f7', boxShadow: '0 0 10px #a855f7' }}></div>
                  <span className="text-xs text-gray-300">Nauru</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sliding Stats Sidebar */}
          <div
            id="stats-sidebar"
            className={`fixed top-0 right-0 h-full bg-gray-800 border-l border-gray-700 shadow-2xl transition-transform duration-300 ease-in-out z-50 ${
              sidebarOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ width: '320px', marginTop: '80px', height: 'calc(100vh - 80px)' }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistics
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Lights Shining</span>
                  <p className="text-3xl font-bold text-white mt-1">{globePoints.length}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Countries</span>
                  <p className="text-3xl font-bold text-white mt-1">{new Set(workers.map(w => w.country)).size}</p>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <span className="text-sm text-gray-400">Australian States</span>
                  <p className="text-3xl font-bold text-white mt-1">{new Set(workers.map(w => w.state).filter(Boolean)).size}</p>
                </div>
                <div className="border-t border-gray-700 pt-4 mt-4">
                  <p className="text-gray-400 italic text-sm">
                    "Each light represents a voice, a story, and hope for those who cannot speak."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            onMouseEnter={() => setSidebarOpen(true)}
            className={`fixed right-0 top-1/2 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-l-lg px-2 py-8 shadow-lg hover:bg-gray-700 transition-all z-40 ${
              sidebarOpen ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ marginTop: '40px' }}
          >
            <Users className="w-5 h-5 text-gray-300" />
          </button>
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
