import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { DistressAlert } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 15 // Refresh alerts every 15 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get('resolved')

    let query = supabase
      .from('dashboard_distress_alerts')
      .select('*')
      .order('timestamp', { ascending: false })

    // Filter by resolution status
    if (resolved !== null) {
      query = query.eq('resolved', resolved === 'true')
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching distress alerts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch distress alerts' },
        { status: 500 }
      )
    }

    return NextResponse.json(data as DistressAlert[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH route to mark alerts as resolved
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { alertId, resolved } = body

    if (!alertId) {
      return NextResponse.json(
        { error: 'Alert ID is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('distress_alerts')
      .update({ resolved })
      .eq('id', alertId)
      .select()

    if (error) {
      console.error('Error updating alert:', error)
      return NextResponse.json(
        { error: 'Failed to update alert' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
