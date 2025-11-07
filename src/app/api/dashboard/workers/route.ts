import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { WorkersByCountry, WorkersByState, WorkersByIndustry } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const groupBy = searchParams.get('groupBy') || 'country' // 'country', 'state', or 'industry'

    let data, error

    switch (groupBy) {
      case 'country':
        ({ data, error } = await supabase
          .from('dashboard_workers_by_country')
          .select('*')
          .order('worker_count', { ascending: false }))
        break

      case 'state':
        ({ data, error } = await supabase
          .from('dashboard_workers_by_state')
          .select('*')
          .order('worker_count', { ascending: false }))
        break

      case 'industry':
        ({ data, error } = await supabase
          .from('dashboard_workers_by_industry')
          .select('*')
          .order('worker_count', { ascending: false }))
        break

      default:
        return NextResponse.json(
          { error: 'Invalid groupBy parameter' },
          { status: 400 }
        )
    }

    if (error) {
      console.error(`Error fetching workers by ${groupBy}:`, error)
      return NextResponse.json(
        { error: `Failed to fetch workers by ${groupBy}` },
        { status: 500 }
      )
    }

    return NextResponse.json(data as WorkersByCountry[] | WorkersByState[] | WorkersByIndustry[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
