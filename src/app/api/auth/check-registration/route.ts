import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { registered: false, error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query the workers table to check if user exists and is registered
    const { data, error } = await supabase
      .from('workers')
      .select('phone_number, name, registration_complete, country')
      .eq('phone_number', phone)
      .single()

    if (error || !data) {
      console.log('User not found in database:', phone)
      return NextResponse.json({
        registered: false,
        message: 'User not found or not registered via WhatsApp'
      })
    }

    // Check if registration is complete
    if (!data.registration_complete) {
      return NextResponse.json({
        registered: false,
        message: 'Registration not complete. Please complete registration via WhatsApp.'
      })
    }

    // User is registered and verified!
    return NextResponse.json({
      registered: true,
      user: {
        phone: data.phone_number,
        name: data.name,
        country: data.country
      }
    })

  } catch (error) {
    console.error('Error checking registration:', error)
    return NextResponse.json(
      { registered: false, error: 'Failed to verify registration' },
      { status: 500 }
    )
  }
}

