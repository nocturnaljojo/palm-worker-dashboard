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

    console.log(`Fetched ${data?.length || 0} registered users from database`)

    // Log first user to see structure
    if (data && data.length > 0) {
      console.log('Sample user data:', JSON.stringify(data[0], null, 2))
    }

    // Transform data to expected format, checking both direct columns and survey_data JSONB
    const workers = (data || [])
      .map(user => {
        // Try to get data from direct columns first, fallback to survey_data JSONB
        const postcode = user.postcode || user.survey_data?.postcode || user.survey_responses?.postcode || null
        const state = user.state || user.survey_data?.state || user.survey_responses?.state || null
        const industry = user.industry || user.survey_data?.industry || user.survey_responses?.industry || null
        const employer = user.employer || user.survey_data?.employer || user.survey_responses?.employer || null
        const visa_type = user.visa_type || user.survey_data?.visa_type || user.survey_responses?.visa_type || null

        const worker = {
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

        console.log(`Worker ${user.name}: postcode=${postcode}, state=${state}`)
        return worker
      })
      // Filter out workers without valid postcode and state
      .filter(worker => {
        const valid = worker.postcode && worker.state
        if (!valid) {
          console.log(`Filtering out ${worker.name} - missing postcode or state`)
        }
        return valid
      })

    console.log(`Returning ${workers.length} workers with postcodes for globe map`)

    // Return workers with valid postcode data
    return NextResponse.json(workers)
  } catch (error) {
    console.error('Unexpected error fetching workers map data:', error)
    return NextResponse.json([])
  }
}
