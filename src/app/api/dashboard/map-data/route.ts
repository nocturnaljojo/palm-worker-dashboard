import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { MapData } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get('state')
    const industry = searchParams.get('industry')

    let query = supabase
      .from('dashboard_map_data')
      .select('*')
      .order('worker_count', { ascending: false })

    // Apply filters if provided
    if (state) {
      query = query.eq('state', state)
    }
    if (industry) {
      query = query.eq('industry', industry)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching map data:', error)
      return NextResponse.json(
        { error: 'Failed to fetch map data' },
        { status: 500 }
      )
    }

    return NextResponse.json(data as MapData[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
