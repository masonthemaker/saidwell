import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// Function to generate a random password
function generateRandomPassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json()

    if (!email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields: email, role' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['admin', 'member'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be admin or member' },
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

    const companyMembership = memberships?.find(m => 
      ['owner', 'admin'].includes(m.role)
    )

    if (!companyMembership) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only company owners and admins can invite users.' },
        { status: 403 }
      )
    }

    // Note: We're creating the user immediately, so they'll appear in the team members list
    // with "Invited" status until they log in. No need to track in invitations table.

    // Generate random password
    const randomPassword = generateRandomPassword()

    // Create a service role client for admin operations
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

    // Create the user with the generated password
    const { data: newUser, error: createError } = await serviceSupabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        invited_by: userData.user.id,
        company_id: companyMembership.company_id,
        role: role,
        full_name: email.split('@')[0], // Use email prefix as default name
        name: email.split('@')[0] // Fallback name field
      }
    })

    if (createError) {
      console.error('User creation error:', createError)
      return NextResponse.json(
        { error: 'Failed to create user: ' + createError.message },
        { status: 500 }
      )
    }

    if (!newUser.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Add the user to the company membership
    const { error: membershipError } = await supabase
      .from('memberships')
      .insert({
        user_id: newUser.user.id,
        company_id: companyMembership.company_id,
        role: role
      })

    if (membershipError) {
      console.error('Membership creation error:', membershipError)
      // Try to clean up the created user
      await serviceSupabase.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json(
        { error: 'Failed to create company membership' },
        { status: 500 }
      )
    }

    // Console log the credentials as requested
    console.log('🎉 New company user created:')
    console.log('📧 Email:', email)
    console.log('🔑 Password:', randomPassword)
    console.log('👤 Role:', role)
    console.log('🏢 Company ID:', companyMembership.company_id)

    return NextResponse.json({ 
      success: true, 
      message: 'Company user created successfully',
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role: role
      },
      // Include credentials in response for development (remove in production)
      credentials: {
        email: email,
        password: randomPassword
      }
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
