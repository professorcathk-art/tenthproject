import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'

/**
 * Creates a Stripe Connect account for a mentor
 * 
 * This endpoint:
 * 1. Authenticates the user (must be a mentor)
 * 2. Creates a connected account using the new controller-based approach
 * 3. Returns the account ID for further operations
 * 
 * Key features:
 * - Platform controls pricing and fee collection
 * - Platform handles losses/refunds/chargebacks
 * - Express dashboard access for account management
 */
export async function POST() {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Step 2: Verify user is a mentor (optional - you can adjust this logic)
    // For this demo, we'll allow any authenticated user to create an account
    // In production, you might want to check if they have a mentor profile

    // Step 3: Create the connected account using the controller approach
    // This is the new recommended way to create Connect accounts
    const account = await stripe.accounts.create({
      controller: {
        // Platform is responsible for pricing and fee collection
        // This means we control what customers pay and how much we keep
        fees: {
          payer: 'application' as const,
        },
        // Platform is responsible for losses, refunds, and chargebacks
        // This gives us full control over dispute handling
        losses: {
          payments: 'application' as const,
        },
        // Give them access to the Express dashboard for account management
        // Express dashboard is the easiest way for accounts to manage their details
        stripe_dashboard: {
          type: 'express' as const,
        },
      },
    })

    // Step 4: Log the account creation for debugging
    console.log('✅ Created Stripe Connect account:', {
      accountId: account.id,
      userId: session.user.email,
      created: new Date().toISOString(),
    })

    // Step 5: Return the account information
    // In a real application, you'd want to save this account ID to your database
    // and associate it with the user's profile
    return NextResponse.json({
      success: true,
      accountId: account.id,
      message: 'Connected account created successfully',
      // Include some basic account info for the UI
      accountInfo: {
        id: account.id,
        created: account.created,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
      },
    })

  } catch (error) {
    console.error('❌ Error creating Stripe Connect account:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Failed to create connected account',
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
