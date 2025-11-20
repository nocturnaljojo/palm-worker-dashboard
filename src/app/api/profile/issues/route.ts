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
    // In production, this would query Supabase for real compliance issues
    const issues = [
      {
        type: 'Underpayment Detected',
        status: 'Action Required',
        severity: 'High',
        amount: '$457.32',
        dateDetected: '2 days ago'
      },
      {
        type: 'Missing Superannuation',
        status: 'Under Review',
        severity: 'Medium',
        amount: '$85.45',
        dateDetected: '1 week ago'
      },
      {
        type: 'Overtime Not Paid',
        status: 'Resolved',
        severity: 'Low',
        amount: '$234.00',
        dateDetected: '2 weeks ago'
      },
      {
        type: 'Contract Violation',
        status: 'Pending',
        severity: 'Critical',
        amount: '-',
        dateDetected: '3 days ago'
      },
      {
        type: 'Incorrect Pay Rate',
        status: 'Action Required',
        severity: 'High',
        amount: '$123.06',
        dateDetected: '5 days ago'
      }
    ]

    return NextResponse.json(issues)
  } catch (error) {
    console.error('Error fetching compliance issues:', error)
    return NextResponse.json(
      { error: 'Failed to fetch compliance issues' },
      { status: 500 }
    )
  }
}

