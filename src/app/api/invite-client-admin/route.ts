import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, clientId, clientName } = await request.json()

    if (!email || !clientId || !clientName) {
      return NextResponse.json(
        { error: 'Missing required fields: email, clientId, clientName' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the requesting user has permission to invite users
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is a company admin/owner
    const { data: memberships } = await supabase
      .from('memberships')
      .select('role, company_id')
      .eq('user_id', userData.user.id)

    const isCompanyUser = memberships?.some(m => 
      ['owner', 'admin', 'member', 'user'].includes(m.role)
    )

    if (!isCompanyUser) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    // Create a service role client for admin operations
    // This requires the service role key to be configured in environment
    const { createClient: createServiceClient } = await import('@supabase/supabase-js')
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Send invitation (we've already verified user doesn't exist on frontend)
    const { data, error } = await serviceSupabase.auth.admin.inviteUserByEmail(
      email,
      {
        data: {
          client_id: clientId,
          client_name: clientName,
          role: 'admin'
        },
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login`
      }
    )

    if (error) {
      console.error('Invitation error:', error)
      return NextResponse.json(
        { error: 'Failed to send invitation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Invitation sent successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
