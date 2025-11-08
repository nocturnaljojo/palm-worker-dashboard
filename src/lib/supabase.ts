import { createClient } from '@supabase/supabase-js'

// Clean environment variables to remove any whitespace/newlines
const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\s/g, '')
const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim().replace(/\s/g, '')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables!')
  console.error('URL exists:', !!supabaseUrl)
  console.error('Service key exists:', !!supabaseServiceKey)
}

// Create Supabase client with service role for dashboard queries
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Type definitions for dashboard views
export interface DashboardSummary {
  total_users: number
  registered_users: number
  countries_count: number
  total_messages: number
  total_survey_responses: number
  unresolved_alerts: number
  active_users_7d: number
  active_users_30d: number
}

export interface WorkersByCountry {
  country: string
  worker_count: number
  registered_count: number
  registration_rate: number
}

export interface WorkersByState {
  state: string
  worker_count: number
  countries_represented: number
  countries: string[]
}

export interface WorkersByIndustry {
  industry: string
  worker_count: number
  avg_employer_rating: number
  unique_employers: number
}

export interface EmployerRating {
  employer_name: string
  industry: string
  state: string
  worker_count: number
  avg_rating: number
  min_rating: number
  max_rating: number
  rating_1_count: number
  rating_2_count: number
  rating_3_count: number
  rating_4_count: number
  rating_5_count: number
}

export interface MapData {
  state: string
  postcode: string
  industry: string
  worker_count: number
  avg_employer_rating: number
  distress_alerts: number
  sentiment: 'positive' | 'neutral' | 'needs_attention'
}

export interface DistressAlert {
  id: number
  phone_number: string
  name: string
  country: string
  state: string
  employer: string
  message: string
  keywords_detected: string[]
  resolved: boolean
  timestamp: string
  hours_since_alert: number
}

export interface ActivityTrend {
  date: string
  new_users: number
  cumulative_users: number
}

export interface RecentActivity {
  activity_type: 'message' | 'registration' | 'distress_alert'
  phone_number: string
  name: string
  country: string
  activity_detail: string
  timestamp: string
}
