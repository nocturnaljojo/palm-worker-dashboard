import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * DEBUG endpoint to see what's in the users table
 */
export async function GET(request: Request) {
  try {
    // Fetch ALL users (no filter)
    const { data: allUsers, error: allError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    // Fetch only registered users
    const { data: registeredUsers, error: regError } = await supabase
      .from('users')
      .select('*')
      .eq('registration_complete', true)
      .limit(10)

    return NextResponse.json({
      total_users: allUsers?.length || 0,
      registered_users: registeredUsers?.length || 0,
      sample_all_user: allUsers?.[0] || null,
      sample_registered_user: registeredUsers?.[0] || null,
      all_users_preview: allUsers?.map(u => ({
        name: u.name,
        phone: u.phone_number,
        country: u.country,
        registration_complete: u.registration_complete,
        has_postcode_column: u.postcode !== undefined,
        postcode_value: u.postcode,
        has_state_column: u.state !== undefined,
        state_value: u.state,
        has_survey_data: u.survey_data !== undefined,
        survey_data_keys: u.survey_data ? Object.keys(u.survey_data) : [],
        has_survey_responses: u.survey_responses !== undefined,
        survey_responses_keys: u.survey_responses ? Object.keys(u.survey_responses) : []
      })),
      errors: {
        all_users_error: allError?.message || null,
        registered_users_error: regError?.message || null
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: String(error),
      message: 'Failed to fetch debug data'
    })
  }
}
