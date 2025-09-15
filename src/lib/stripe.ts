import Stripe from 'stripe'

// Initialize Stripe with the latest API version
// IMPORTANT: Replace 'sk_test_...' with your actual Stripe secret key
const getStripeSecretKey = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY

  if (!stripeSecretKey) {
    throw new Error(
      '❌ STRIPE_SECRET_KEY environment variable is required. ' +
      'Please add your Stripe secret key to your .env file. ' +
      'Get your key from: https://dashboard.stripe.com/apikeys'
    )
  }

  return stripeSecretKey
}

// Initialize Stripe instance with lazy loading to avoid build-time errors
let stripeInstance: Stripe | null = null

export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    if (!stripeInstance) {
      stripeInstance = new Stripe(getStripeSecretKey(), {
        apiVersion: '2025-08-27.basil', // Latest Stripe API version
        typescript: true, // Enable TypeScript support
      })
    }
    return stripeInstance[prop as keyof Stripe]
  }
})

// Get the publishable key for client-side operations
export const getStripePublishableKey = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  
  if (!publishableKey) {
    throw new Error(
      '❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable is required. ' +
      'Please add your Stripe publishable key to your .env file. ' +
      'Get your key from: https://dashboard.stripe.com/apikeys'
    )
  }
  
  return publishableKey
}

// Helper function to calculate application fee (8.5% commission as per your requirements)
export const calculateApplicationFee = (amountInCents: number): number => {
  const commissionRate = 0.085 // 8.5% commission
  return Math.round(amountInCents * commissionRate)
}

// Helper function to format currency for display
export const formatCurrency = (amountInCents: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
}
