'use client'

export default function ProfileTestPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">✅ Profile Page Test</h1>
        <p className="text-gray-400">If you can see this, the basic routing works!</p>
        <a 
          href="/profile" 
          className="mt-6 inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          Go to Full Profile Page
        </a>
      </div>
    </div>
  )
}

