'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CheckAuthPage() {
  const router = useRouter()
  const [phone, setPhone] = useState<string | null>(null)

  useEffect(() => {
    const storedPhone = localStorage.getItem('whatsapp_user_phone')
    setPhone(storedPhone)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f1424] border border-gray-800 rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Authentication Check</h1>
        
        {phone ? (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <p className="text-green-400 font-medium mb-2">✅ Logged In!</p>
              <p className="text-sm text-gray-300">Phone: {phone}</p>
            </div>
            
            <button
              onClick={() => router.push('/profile')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Go to My Dashboard
            </button>
            
            <button
              onClick={() => router.push('/globe-workers')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Go to Globe Workers
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-400 font-medium mb-2">❌ Not Logged In</p>
              <p className="text-sm text-gray-300">No phone number found in storage</p>
            </div>
            
            <button
              onClick={() => router.push('/test-login')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              Go to Login Page
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

