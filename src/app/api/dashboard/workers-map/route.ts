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
    // Fetch all registered workers - we'll filter for valid postcodes in code
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('registration_complete', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workers for map:', error)
      return NextResponse.json([])
    }

    // Transform data to expected format, checking both direct columns and survey_data JSONB
    const workers = (data || [])
      .map(user => {
        // Try to get data from direct columns first, fallback to survey_data JSONB
        const postcode = user.postcode || user.survey_data?.postcode || null
        const state = user.state || user.survey_data?.state || null
        const industry = user.industry || user.survey_data?.industry || null
        const employer = user.employer || user.survey_data?.employer || null
        const visa_type = user.visa_type || user.survey_data?.visa_type || null

        return {
          phone: user.phone_number,
          name: user.name || 'Unknown',
          country: user.country || 'Unknown',
          state,
          postcode,
          industry,
          employer,
          visa_type,
          created_at: user.created_at,
          updated_at: user.updated_at,
          registration_complete: user.registration_complete
        }
      })
      // Filter out workers without valid postcode and state
      .filter(worker => worker.postcode && worker.state)

    console.log(`Returning ${workers.length} workers with postcodes for globe map`)

    // Return workers with valid postcode data
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Unexpected error fetching workers map data:', error)
    return NextResponse.json([])
  }
}
