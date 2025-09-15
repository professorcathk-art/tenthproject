import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

/**
 * Creates an account link for onboarding a Stripe Connect account
 * 
 * This endpoint:
 * 1. Authenticates the user
 * 2. Creates an account link for onboarding
 * 3. Returns the URL for the user to complete onboarding
 * 
 * Account links are the recommended way to onboard Connect accounts
 * as they provide a secure, hosted experience
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { accountId } = await params

    // Step 2: Validate account ID
    if (!accountId || !accountId.startsWith('acct_')) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      )
    }

    // Step 3: Get the base URL for redirects
    // In production, this should be your actual domain
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Step 4: Create an account link for onboarding
    // Account links provide a hosted onboarding experience
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      // Where to redirect after successful onboarding
      refresh_url: `${baseUrl}/stripe/onboard/refresh?account_id=${accountId}`,
      // Where to redirect after onboarding is complete
      return_url: `${baseUrl}/stripe/onboard/success?account_id=${accountId}`,
      // The type of link - 'account_onboarding' is for initial setup
      type: 'account_onboarding',
    })

    // Step 5: Log the account link creation
    console.log('🔗 Created account link for onboarding:', {
      accountId,
      userId: session.user.email,
      linkUrl: accountLink.url,
      expires: new Date(accountLink.expires_at * 1000).toISOString(),
    })

    // Step 6: Return the onboarding URL
    return NextResponse.json({
      success: true,
      onboardUrl: accountLink.url,
      expiresAt: accountLink.expires_at,
      message: 'Onboarding link created successfully',
    })

  } catch (error) {
    console.error('❌ Error creating account link:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Failed to create onboarding link',
          error: error.message 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * Creates a login link for existing connected accounts
 * 
 * This allows account holders to access their Express dashboard
 * after they've completed onboarding
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    const { accountId } = await params

    // Step 2: Validate account ID
    if (!accountId || !accountId.startsWith('acct_')) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      )
    }

    // Step 3: Create a login link for the Express dashboard
    // This gives the account holder access to their dashboard
    const loginLink = await stripe.accounts.createLoginLink(accountId)

    // Step 4: Log the login link creation
    console.log('🔑 Created login link for account:', {
      accountId,
      userId: session.user.email,
      linkUrl: loginLink.url,
      // Note: Login links don't have expires_at property
    })

    // Step 5: Return the login URL
    return NextResponse.json({
      success: true,
      loginUrl: loginLink.url,
      message: 'Login link created successfully',
    })

  } catch (error) {
    console.error('❌ Error creating login link:', error)
    
    return NextResponse.json(
      { message: 'Failed to create login link' },
      { status: 500 }
    )
  }
}
