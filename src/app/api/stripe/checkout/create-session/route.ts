import { NextRequest, NextResponse } from 'next/server'
import { stripe, calculateApplicationFee } from '@/lib/stripe'

/**
 * Creates a checkout session for purchasing a product
 * 
 * This endpoint:
 * 1. Validates the product and price
 * 2. Calculates application fee (8.5% commission)
 * 3. Creates a checkout session with destination charge
 * 4. Returns the checkout URL for the customer
 * 
 * Uses destination charges with application fees to monetize transactions
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Parse request body
    const body = await request.json()
    const { productId, quantity = 1, connectedAccountId } = body

    // Step 2: Validate required fields
    if (!productId || !connectedAccountId) {
      return NextResponse.json(
        { 
          message: 'Missing required fields',
          required: ['productId', 'connectedAccountId']
        },
        { status: 400 }
      )
    }

    // Step 3: Validate quantity
    if (quantity < 1) {
      return NextResponse.json(
        { message: 'Quantity must be at least 1' },
        { status: 400 }
      )
    }

    // Step 4: Retrieve the product to get price information
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'], // Include price details
    })

    // Step 5: Validate product exists and has a default price
    if (!product.default_price) {
      return NextResponse.json(
        { message: 'Product does not have a default price' },
        { status: 400 }
      )
    }

    const price = product.default_price as Stripe.Price // Type assertion for expanded price
    const unitAmount = price.unit_amount
    const currency = price.currency

    // Step 6: Calculate total amount and application fee
    const totalAmount = unitAmount * quantity
    const applicationFeeAmount = calculateApplicationFee(totalAmount)

    // Step 7: Get the base URL for redirects
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Step 8: Create the checkout session with destination charge
    // This is where the magic happens - we use destination charges to send
    // money to the connected account while keeping our application fee
    const session = await stripe.checkout.sessions.create({
      // Line items for the checkout
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: unitAmount, // Amount in cents
          },
          quantity: quantity,
        },
      ],
      
      // Payment intent configuration for destination charges
      payment_intent_data: {
        // Our application fee (8.5% commission)
        application_fee_amount: applicationFeeAmount,
        
        // Transfer the remaining amount to the connected account
        transfer_data: {
          destination: connectedAccountId,
        },
        
        // Add metadata for tracking
        metadata: {
          product_id: productId,
          connected_account_id: connectedAccountId,
          quantity: quantity.toString(),
          application_fee_amount: applicationFeeAmount.toString(),
        },
      },
      
      // Checkout session configuration
      mode: 'payment', // One-time payment
      success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/stripe/cancel`,
      
      // Customer information (optional - can be collected during checkout)
      customer_creation: 'if_required',
      
      // Payment method types to accept
      payment_method_types: ['card'],
      
      // Additional configuration
      billing_address_collection: 'auto',
      shipping_address_collection: {
        allowed_countries: ['US'], // Adjust based on your business needs
      },
    })

    // Step 9: Log the checkout session creation
    console.log('🛒 Created checkout session:', {
      sessionId: session.id,
      productId,
      connectedAccountId,
      totalAmount,
      applicationFeeAmount,
      quantity,
      currency,
    })

    // Step 10: Return the checkout URL
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url,
      amount: totalAmount,
      currency: currency,
      applicationFee: applicationFeeAmount,
      message: 'Checkout session created successfully',
    })

  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Failed to create checkout session',
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
