import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * API endpoint to fetch individual worker profile
 * Only accessible for workers who registered via WhatsApp
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Fetch worker profile - only if registered via WhatsApp
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone)
      .eq('registration_complete', true)
      .single()

    if (error || !data) {
      console.error('Worker not found:', error)
      return NextResponse.json(
        { error: 'Worker not found or not registered via WhatsApp' },
        { status: 404 }
      )
    }

    // Get postcode coordinates for city name
    const { postcodeToCoordinates } = await import('@/lib/postcodeToCoordinates')
    const coords = postcodeToCoordinates(data.postcode)

    // Return worker profile
    const workerProfile = {
      phone_number: data.phone_number,
      name: data.name || 'Unknown',
      country: data.country || 'Unknown',
      state: data.state || 'Unknown',
      postcode: data.postcode || 'Unknown',
      city: coords?.city || 'Unknown',
      industry: data.industry,
      employer: data.employer,
      visa_type: data.visa_type,
      created_at: data.created_at,
      registration_complete: data.registration_complete
    }

    console.log(`Returning profile for worker: ${data.name}`)

    return NextResponse.json(workerProfile)
  } catch (error) {
    console.error('Unexpected error fetching worker profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
