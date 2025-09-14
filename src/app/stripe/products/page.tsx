'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import { 
  PlusIcon,
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

export default function StripeProductsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    priceInCents: '',
    currency: 'usd',
    connectedAccountId: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else {
      fetchProducts()
    }
  }, [session, status, router])

  // Fetch all products
  const fetchProducts = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/products')
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
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

  // Create a new product
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/stripe/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newProduct,
          priceInCents: parseInt(newProduct.priceInCents),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({type: 'success', text: 'Product created successfully!'})
        setNewProduct({
          name: '',
          description: '',
          priceInCents: '',
          currency: 'usd',
          connectedAccountId: ''
        })
        setShowCreateForm(false)
        fetchProducts() // Refresh the list
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to create product'})
      }
    } catch (error) {
      console.error('Error creating product:', error)
      setMessage({type: 'error', text: 'An unexpected error occurred'})
    } finally {
      setIsCreating(false)
    }
  }

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setNewProduct(prev => ({
      ...prev,
      [field]: value
    }))
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

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stripe Products</h1>
                <p className="mt-2 text-gray-600">
                  Manage your products and pricing
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Product
              </button>
            </div>
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

          {/* Create Product Form */}
          {showCreateForm && (
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Create New Product</h2>
              </div>
              
              <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Web Development Course"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Connected Account ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProduct.connectedAccountId}
                      onChange={(e) => handleInputChange('connectedAccountId', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="acct_..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newProduct.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your product..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (in cents) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newProduct.priceInCents}
                      onChange={(e) => handleInputChange('priceInCents', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="29900 (for $299.00)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter amount in cents (e.g., 29900 for $299.00)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency *
                    </label>
                    <select
                      value={newProduct.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="cad">CAD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isCreating ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Products ({products.length})
              </h2>
            </div>
            
            <div className="p-6">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create your first product to start selling.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 mt-1">{product.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {product.active ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircleIcon className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-500">Price</span>
                          <p className="text-lg font-semibold text-gray-900">
                            {product.price?.formatted_amount || 'No price set'}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500">Connected Account</span>
                          <p className="text-sm text-gray-900">
                            {product.connectedAccount?.business_profile?.name || 
                             product.connectedAccount?.id || 
                             'Unknown'}
                          </p>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium text-gray-500">Created</span>
                          <p className="text-sm text-gray-900">
                            {new Date(product.created * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Connected Account Status */}
                      {product.connectedAccount && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Account Status</h4>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              {product.connectedAccount.charges_enabled ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className="text-sm text-gray-700">Can receive payments</span>
                            </div>
                            <div className="flex items-center">
                              {product.connectedAccount.payouts_enabled ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              ) : (
                                <XCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                              )}
                              <span className="text-sm text-gray-700">Can receive payouts</span>
                            </div>
                            <div className="flex items-center">
                              <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-700">{product.connectedAccount.country?.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
