import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 60

/**
 * API endpoint to fetch individual workers with postcode data for globe mapping
 * Returns all registered workers with valid postcodes for plotting on the globe
 */
export async function GET(request: Request) {
  try {
    // Fetch workers with postcode data - postcode and state are columns, not in survey_data
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('registration_complete', true)
      .not('postcode', 'is', null)
      .not('state', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workers for map:', error)
      return NextResponse.json([])
    }

    // Transform data to expected format
    const workers = (data || []).map(user => ({
      phone: user.phone_number,
      name: user.name || 'Unknown',
      country: user.country || 'Unknown',
      state: user.state,
      postcode: user.postcode,
      industry: user.industry,
      employer: user.employer,
      visa_type: user.visa_type,
      created_at: user.created_at,
      updated_at: user.updated_at,
      registration_complete: user.registration_complete
    }))

    console.log(`Returning ${workers.length} workers with postcodes for globe map`)

    // Return workers with valid postcode data
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Unexpected error fetching workers map data:', error)
    return NextResponse.json([])
  }
}
