import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 15 // Refresh every 15 seconds for worker details

interface WorkerDetail {
  // Basic Info
  phone_number: string
  name: string
  country: string
  registration_complete: boolean
  created_at: string
  updated_at: string

  // Survey Data
  survey_data: {
    feeling?: string
    state?: string
    postcode?: string
    age_range?: string
    gender?: string
    employer_rating?: string
    employer?: string
    industry?: string
  }

  // Computed fields
  distress_alerts: Array<{
    id: number
    message: string
    keywords_detected: string[]
    resolved: boolean
    timestamp: string
    hours_since_alert: number
  }>

  recent_messages: Array<{
    role: string
    content: string
    timestamp: string
  }>

  message_count: number
  last_active: string
  status: 'positive' | 'neutral' | 'needs_attention' | 'critical'
}

export async function GET(
  request: Request,
  { params }: { params: { phone: string } }
) {
  try {
    const phone = params.phone

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'Worker not found' },
        { status: 404 }
      )
    }

    // Fetch distress alerts
    const { data: alertsData } = await supabase
      .from('dashboard_distress_alerts')
      .select('*')
      .eq('phone_number', phone)
      .order('timestamp', { ascending: false })

    // Fetch recent conversations
    const { data: conversationsData } = await supabase
      .from('conversations')
      .select('role, content, timestamp')
      .eq('phone_number', phone)
      .order('timestamp', { ascending: false })
      .limit(10)

    // Count total messages
    const { count: messageCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('phone_number', phone)

    // Determine worker status
    const unresolvedAlerts = alertsData?.filter(a => !a.resolved).length || 0
    const employerRating = userData.survey_data?.employer_rating
      ? parseInt(userData.survey_data.employer_rating)
      : null

    let status: WorkerDetail['status'] = 'neutral'
    if (unresolvedAlerts >= 3) {
      status = 'critical'
    } else if (unresolvedAlerts > 0 || (employerRating && employerRating <= 2)) {
      status = 'needs_attention'
    } else if (employerRating && employerRating >= 4) {
      status = 'positive'
    }

    // Build response
    const workerDetail: WorkerDetail = {
      phone_number: userData.phone_number,
      name: userData.name || 'Unknown',
      country: userData.country || 'Unknown',
      registration_complete: userData.registration_complete,
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      survey_data: userData.survey_data || {},
      distress_alerts: alertsData || [],
      recent_messages: conversationsData || [],
      message_count: messageCount || 0,
      last_active: userData.updated_at,
      status
    }

    return NextResponse.json(workerDetail)
  } catch (error) {
    console.error('Error fetching worker details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
