'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import { 
  ShoppingCartIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  description: string
  active: boolean
  created: number
  metadata: Record<string, string>
  price: {
    id: string
    unit_amount: number
    currency: string
    formatted_amount: string
  } | null
  connectedAccount: {
    id: string
    country: string
    business_profile: {
      name: string
      url: string
    } | null
    charges_enabled: boolean
    payouts_enabled: boolean
  } | null
}

export default function StripeStorePage() {
  const { status } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/products')
      const data = await response.json()

      if (response.ok) {
        // Only show active products that can accept payments
        const activeProducts = data.products.filter((product: Product) => 
          product.active && 
          product.price && 
          product.connectedAccount?.charges_enabled
        )
        setProducts(activeProducts)
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to fetch products'})
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setMessage({type: 'error', text: 'Failed to fetch products'})
    } finally {
      setIsLoading(false)
    }
  }

  // Purchase a product
  const handlePurchase = async (product: Product) => {
    if (!product.price || !product.connectedAccount) {
      setMessage({type: 'error', text: 'Product not available for purchase'})
      return
    }

    setIsProcessing(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/stripe/checkout/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          connectedAccountId: product.connectedAccount.id,
        }),
      })

      const data = await response.json()

      if (response.ok && data.checkoutUrl) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkoutUrl
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to create checkout session'})
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
      setMessage({type: 'error', text: 'An unexpected error occurred'})
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Store</h1>
            <p className="mt-2 text-gray-600">
              Browse and purchase products from our marketplace
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCartIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new products.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Product Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <CurrencyDollarIcon className="h-16 w-16 text-white" />
                  </div>
                  
                  <div className="p-6">
                    {/* Product Info */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm line-clamp-3">{product.description}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900">
                          {product.price?.formatted_amount || 'Price not set'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {product.price?.currency?.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Seller Info */}
                    {product.connectedAccount && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.connectedAccount.business_profile?.name || 'Unknown Seller'}
                            </p>
                            <div className="flex items-center mt-1">
                              <GlobeAltIcon className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {product.connectedAccount.country?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {product.connectedAccount.charges_enabled ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircleIcon className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={isProcessing || !product.connectedAccount?.charges_enabled}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingCartIcon className="h-4 w-4 mr-2" />
                          Purchase Now
                        </>
                      )}
                    </button>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Created {new Date(product.created * 1000).toLocaleDateString()}</span>
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Store Info */}
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold text-indigo-600">1</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Browse Products</h3>
                <p className="text-sm text-gray-500">
                  Explore products from verified sellers in our marketplace.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold text-indigo-600">2</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Secure Checkout</h3>
                <p className="text-sm text-gray-500">
                  Complete your purchase through our secure Stripe checkout.
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-lg font-semibold text-indigo-600">3</span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Instant Access</h3>
                <p className="text-sm text-gray-500">
                  Get immediate access to your purchased products and services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
