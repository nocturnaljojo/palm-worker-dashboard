import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DashboardSummary } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 30 // Revalidate every 30 seconds

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('dashboard_summary')
      .select('*')
      .single()

    if (error) {
      console.error('Error fetching dashboard summary:', error)
      // Return empty object with zeros to prevent frontend crash
      return NextResponse.json({
        total_users: 0,
        registered_users: 0,
        active_users_7d: 0,
        active_users_30d: 0,
        total_messages: 0,
        total_survey_responses: 0,
        unresolved_alerts: 0
      })
    }

    return NextResponse.json(data || {
      total_users: 0,
      registered_users: 0,
      active_users_7d: 0,
      active_users_30d: 0,
      total_messages: 0,
      total_survey_responses: 0,
      unresolved_alerts: 0
    } as DashboardSummary)
  } catch (error) {
    console.error('Unexpected error:', error)
    // Return empty object with zeros to prevent frontend crash
    return NextResponse.json({
      total_users: 0,
      registered_users: 0,
      active_users_7d: 0,
      active_users_30d: 0,
      total_messages: 0,
      total_survey_responses: 0,
      unresolved_alerts: 0
    })
  }
}
