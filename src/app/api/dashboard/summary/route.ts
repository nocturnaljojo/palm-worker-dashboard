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
      return NextResponse.json(
        { error: 'Failed to fetch dashboard summary' },
        { status: 500 }
      )
    }

    return NextResponse.json(data as DashboardSummary)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
