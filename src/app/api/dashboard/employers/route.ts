import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { EmployerRating } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sortBy = searchParams.get('sortBy') || 'worker_count'
    const order = searchParams.get('order') || 'desc'
    const minRating = searchParams.get('minRating')
    const maxRating = searchParams.get('maxRating')
    const state = searchParams.get('state')
    const industry = searchParams.get('industry')

    let query = supabase
      .from('dashboard_employer_ratings')
      .select('*')

    // Apply filters
    if (minRating) {
      query = query.gte('avg_rating', parseFloat(minRating))
    }
    if (maxRating) {
      query = query.lte('avg_rating', parseFloat(maxRating))
    }
    if (state) {
      query = query.eq('state', state)
    }
    if (industry) {
      query = query.eq('industry', industry)
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: order === 'asc' })

    const { data, error } = await query

    if (error) {
      console.error('Error fetching employer ratings:', error)
      return NextResponse.json(
        { error: 'Failed to fetch employer ratings' },
        { status: 500 }
      )
    }

    return NextResponse.json(data as EmployerRating[])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
