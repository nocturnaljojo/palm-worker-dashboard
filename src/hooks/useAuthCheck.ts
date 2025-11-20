import { useEffect, useState } from 'react'

interface AuthStatus {
  isAuthenticated: boolean
  isLoading: boolean
  userPhone: string | null
  userName: string | null
  userCountry: string | null
}

/**
 * Custom hook to check if user is authenticated and registered in Supabase
 * Returns authentication status and user info if registered
 */
export function useAuthCheck(): AuthStatus {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    isLoading: true,
    userPhone: null,
    userName: null,
    userCountry: null
  })

  useEffect(() => {
    async function checkAuth() {
      try {
        // First, check if phone exists in localStorage
        const phone = localStorage.getItem('whatsapp_user_phone')
        
        if (!phone) {
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            userPhone: null,
            userName: null,
            userCountry: null
          })
          return
        }

        // Then verify with Supabase that user is actually registered
        const response = await fetch(`/api/auth/check-registration?phone=${encodeURIComponent(phone)}`)
        const data = await response.json()

        if (data.registered && data.user) {
          setAuthStatus({
            isAuthenticated: true,
            isLoading: false,
            userPhone: data.user.phone,
            userName: data.user.name,
            userCountry: data.user.country
          })
        } else {
          // Phone in localStorage but not registered in Supabase
          setAuthStatus({
            isAuthenticated: false,
            isLoading: false,
            userPhone: null,
            userName: null,
            userCountry: null
          })
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        setAuthStatus({
          isAuthenticated: false,
          isLoading: false,
          userPhone: null,
          userName: null,
          userCountry: null
        })
      }
    }

    checkAuth()
  }, [])

  return authStatus
}

