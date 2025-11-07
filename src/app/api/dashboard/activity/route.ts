import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { ActivityTrend, RecentActivity } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 30

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'trends' // 'trends' or 'recent'

    if (type === 'trends') {
      // Get activity trends
      const { data, error } = await supabase
        .from('dashboard_activity_trends')
        .select('*')
        .order('date', { ascending: true })
        .limit(90)

      if (error) {
        console.error('Error fetching activity trends:', error)
        return NextResponse.json(
          { error: 'Failed to fetch activity trends' },
          { status: 500 }
        )
      }

      return NextResponse.json(data as ActivityTrend[])
    } else {
      // Get recent activity
      const { data, error } = await supabase
        .from('dashboard_recent_activity')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(50)

      if (error) {
        console.error('Error fetching recent activity:', error)
        return NextResponse.json(
          { error: 'Failed to fetch recent activity' },
          { status: 500 }
        )
      }

      return NextResponse.json(data as RecentActivity[])
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
