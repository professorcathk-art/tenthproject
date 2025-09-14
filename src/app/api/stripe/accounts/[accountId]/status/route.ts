import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * Retrieves the status of a Stripe Connect account
 * 
 * This endpoint:
 * 1. Fetches the account details directly from Stripe API
 * 2. Returns comprehensive status information
 * 3. Shows onboarding progress and capabilities
 * 
 * Note: For this demo, we always fetch fresh data from Stripe API
 * rather than storing it in the database
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params

    // Validate account ID format (Stripe account IDs start with 'acct_')
    if (!accountId || !accountId.startsWith('acct_')) {
      return NextResponse.json(
        { message: 'Invalid account ID format' },
        { status: 400 }
      )
    }

    // Step 1: Retrieve account details from Stripe
    // This gives us real-time status information
    const account = await stripe.accounts.retrieve(accountId)

    // Step 2: Determine onboarding status based on account capabilities
    let onboardingStatus = 'not_started'
    let canReceivePayments = false
    let canReceivePayouts = false

    // Check if account can receive payments
    if (account.charges_enabled) {
      onboardingStatus = 'charges_enabled'
      canReceivePayments = true
    } else if (account.details_submitted) {
      onboardingStatus = 'details_submitted'
    } else {
      onboardingStatus = 'incomplete'
    }

    // Check if account can receive payouts
    if (account.payouts_enabled) {
      canReceivePayouts = true
      onboardingStatus = 'fully_onboarded'
    }

    // Step 3: Prepare response with comprehensive status
    const response = {
      accountId: account.id,
      onboardingStatus,
      canReceivePayments,
      canReceivePayouts,
      
      // Basic account info
      created: account.created,
      country: account.country,
      default_currency: account.default_currency,
      
      // Capabilities and requirements
      capabilities: {
        card_payments: account.capabilities?.card_payments || 'inactive',
        transfers: account.capabilities?.transfers || 'inactive',
      },
      
      // Requirements for completing onboarding
      requirements: {
        currently_due: account.requirements?.currently_due || [],
        eventually_due: account.requirements?.eventually_due || [],
        past_due: account.requirements?.past_due || [],
        pending_verification: account.requirements?.pending_verification || [],
      },
      
      // Business profile (if available)
      business_profile: account.business_profile ? {
        name: account.business_profile.name,
        url: account.business_profile.url,
        support_email: account.business_profile.support_email,
      } : null,
      
      // Account type and controller info
      type: account.type,
      controller: account.controller,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('❌ Error retrieving account status:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error && error.message.includes('No such account')) {
      return NextResponse.json(
        { message: 'Account not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to retrieve account status' },
      { status: 500 }
    )
  }
}
