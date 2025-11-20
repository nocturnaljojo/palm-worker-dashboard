import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get('phone')

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      )
    }

    // For now, return mock data
    // In production, this would query Supabase for real document activity
    const activity = [
      {
        date: 'Mon',
        totalPending: 8,
        compliant: 2,
        otherDocuments: 1
      },
      {
        date: 'Tue',
        totalPending: 10,
        compliant: 3,
        otherDocuments: 1
      },
      {
        date: 'Wed',
        totalPending: 6,
        compliant: 1,
        otherDocuments: 0
      },
      {
        date: 'Thu',
        totalPending: 12,
        compliant: 4,
        otherDocuments: 2
      },
      {
        date: 'Fri',
        totalPending: 9,
        compliant: 2,
        otherDocuments: 1
      },
      {
        date: 'Sat',
        totalPending: 5,
        compliant: 1,
        otherDocuments: 0
      },
      {
        date: 'Sun',
        totalPending: 4,
        compliant: 1,
        otherDocuments: 0
      }
    ]

    return NextResponse.json(activity)
  } catch (error) {
    console.error('Error fetching document activity:', error)
    return NextResponse.json(
      { error: 'Failed to fetch document activity' },
      { status: 500 }
    )
  }
}

