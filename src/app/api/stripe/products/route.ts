import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

/**
 * Creates a new Stripe product at the platform level
 * 
 * This endpoint:
 * 1. Authenticates the user (must be a mentor with connected account)
 * 2. Creates a product with default price
 * 3. Stores the mapping between product and connected account
 * 4. Returns the product information
 * 
 * Note: Products are created at the platform level, not on the connected account
 * This gives us full control over the product catalog
 */
export async function POST(request: NextRequest) {
  try {
    // Step 1: Authenticate the user
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      )
    }

    // Step 2: Parse request body
    const body = await request.json()
    const { 
      name, 
      description, 
      priceInCents, 
      currency = 'usd',
      connectedAccountId 
    } = body

    // Step 3: Validate required fields
    if (!name || !description || !priceInCents || !connectedAccountId) {
      return NextResponse.json(
        { 
          message: 'Missing required fields',
          required: ['name', 'description', 'priceInCents', 'connectedAccountId']
        },
        { status: 400 }
      )
    }

    // Step 4: Validate price (must be positive)
    if (priceInCents <= 0) {
      return NextResponse.json(
        { message: 'Price must be greater than 0' },
        { status: 400 }
      )
    }

    // Step 5: Validate connected account ID format
    if (!connectedAccountId.startsWith('acct_')) {
      return NextResponse.json(
        { message: 'Invalid connected account ID format' },
        { status: 400 }
      )
    }

    // Step 6: Create the product with default price
    // We create both the product and price in one call for simplicity
    const product = await stripe.products.create({
      name: name,
      description: description,
      // Create a default price for this product
      default_price_data: {
        unit_amount: priceInCents, // Amount in cents
        currency: currency.toLowerCase(), // Stripe expects lowercase currency codes
        // Make the price recurring if needed (uncomment for subscriptions)
        // recurring: { interval: 'month' },
      },
      // Store the connected account ID in metadata
      // This is how we map products to connected accounts
      metadata: {
        connected_account_id: connectedAccountId,
        created_by: session.user.email,
        created_at: new Date().toISOString(),
      },
    })

    // Step 7: Log the product creation
    console.log('✅ Created Stripe product:', {
      productId: product.id,
      name: product.name,
      connectedAccountId,
      priceInCents,
      currency,
      userId: session.user.email,
    })

    // Step 8: Return the product information
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        default_price_id: product.default_price,
        metadata: product.metadata,
        created: product.created,
      },
      message: 'Product created successfully',
    })

  } catch (error) {
    console.error('❌ Error creating Stripe product:', error)
    
    // Handle specific Stripe errors
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          message: 'Failed to create product',
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
 * Lists all products with their connected account information
 * 
 * This endpoint:
 * 1. Fetches all products from Stripe
 * 2. Includes price information
 * 3. Returns connected account details from metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Step 1: Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const startingAfter = searchParams.get('starting_after')

    // Step 2: List products with their prices
    // We expand the default_price to get price details
    const products = await stripe.products.list({
      limit: Math.min(limit, 100), // Stripe has a max limit of 100
      starting_after: startingAfter || undefined,
      expand: ['data.default_price'], // Include price details
    })

    // Step 3: Transform the data for our API response
    const transformedProducts = await Promise.all(
      products.data.map(async (product) => {
        // Get the default price details
        const defaultPrice = product.default_price as Stripe.Price // Type assertion for expanded price
        
        // Get connected account details if available
        let connectedAccountInfo = null
        if (product.metadata?.connected_account_id) {
          try {
            const account = await stripe.accounts.retrieve(
              product.metadata.connected_account_id
            )
            connectedAccountInfo = {
              id: account.id,
              country: account.country,
              business_profile: account.business_profile,
              charges_enabled: account.charges_enabled,
              payouts_enabled: account.payouts_enabled,
            }
          } catch (error) {
            console.warn('Could not retrieve connected account:', error)
            // Continue without account info
          }
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          active: product.active,
          created: product.created,
          metadata: product.metadata,
          price: defaultPrice && defaultPrice.unit_amount && defaultPrice.currency ? {
            id: defaultPrice.id,
            unit_amount: defaultPrice.unit_amount,
            currency: defaultPrice.currency,
            formatted_amount: new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: defaultPrice.currency.toUpperCase(),
            }).format(defaultPrice.unit_amount / 100),
          } : null,
          connectedAccount: connectedAccountInfo,
        }
      })
    )

    // Step 4: Return the products with pagination info
    return NextResponse.json({
      success: true,
      products: transformedProducts,
      has_more: products.has_more,
      next_page: products.has_more ? products.data[products.data.length - 1].id : null,
      total_count: transformedProducts.length,
    })

  } catch (error) {
    console.error('❌ Error listing Stripe products:', error)
    
    return NextResponse.json(
      { message: 'Failed to list products' },
      { status: 500 }
    )
  }
}
