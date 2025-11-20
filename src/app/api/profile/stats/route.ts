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
    // In production, this would query Supabase for real user statistics
    const stats = {
      documentsReviewed: 156,
      documentsChange: '+2 vs last month',
      complianceChecks: 89,
      complianceChange: '+2 vs last month',
      notesReceived: 43,
      notesChange: '+1 vs last month',
      complianceScore: 87,
      complianceImprovement: '+5% improvement this month',
      payslipProgress: 80.8,
      payslipsAnalyzed: 24,
      totalPayslips: 156
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching profile stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile statistics' },
      { status: 500 }
    )
  }
}

