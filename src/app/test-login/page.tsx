'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, CheckCircle } from 'lucide-react'

export default function TestLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('+61412345678')
  const [success, setSuccess] = useState(false)

  const handleLogin = () => {
    localStorage.setItem('whatsapp_user_phone', phone)
    setSuccess(true)
    
    // Redirect to profile after 1 second
    setTimeout(() => {
      router.push('/profile')
    }, 1000)
  }

  const quickLogins = [
    { phone: '+61412345678', name: 'Test Worker 1' },
    { phone: '+61498765432', name: 'Test Worker 2' },
    { phone: '+61411223344', name: 'Test Worker 3' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0f1424] border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Test Login</h1>
          <p className="text-gray-400 text-sm">
            Set up a test user to access the profile dashboard
          </p>
        </div>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-white font-medium mb-2">Login Successful!</p>
            <p className="text-gray-400 text-sm">Redirecting to profile...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+61412345678"
                className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors mb-6"
            >
              Set Test User & Go to Profile
            </button>

            <div className="border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-400 mb-3">Quick Login Options:</p>
              <div className="space-y-2">
                {quickLogins.map((user) => (
                  <button
                    key={user.phone}
                    onClick={() => {
                      setPhone(user.phone)
                      localStorage.setItem('whatsapp_user_phone', user.phone)
                      setSuccess(true)
                      setTimeout(() => router.push('/profile'), 1000)
                    }}
                    className="w-full bg-white/5 hover:bg-white/10 border border-gray-800 hover:border-gray-700 rounded-lg px-4 py-3 text-left transition-colors"
                  >
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.phone}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                onClick={() => router.push('/globe-workers')}
                className="w-full text-gray-400 hover:text-white text-sm transition-colors"
              >
                Skip and go to Globe Dashboard
              </button>
            </div>
          </>
        )}

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-xs text-yellow-400">
            <strong>Note:</strong> This is a test page for development only. 
            In production, authentication will be handled via WhatsApp verification.
          </p>
        </div>
      </div>
    </div>
  )
}

