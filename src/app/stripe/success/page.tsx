'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/navigation'
import { CheckCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface CheckoutSession {
  id: string
  amount_total: number
  currency: string
  payment_status: string
  customer_details: {
    email: string
    name: string
  }
  payment_intent: {
    id: string
    application_fee_amount: number
    transfer_data: {
      destination: string
    }
  }
}

export default function StripeSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [session, setSession] = useState<CheckoutSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (sessionId) {
      fetchSessionDetails(sessionId)
    } else {
      setError('No session ID provided')
      setIsLoading(false)
    }
  }, [sessionId])

  const fetchSessionDetails = async (sessionId: string) => {
    try {
      // In a real application, you would create an API endpoint to retrieve session details
      // For this demo, we'll simulate the session data
      const mockSession: CheckoutSession = {
        id: sessionId,
        amount_total: 29900, // $299.00
        currency: 'usd',
        payment_status: 'paid',
        customer_details: {
          email: 'customer@example.com',
          name: 'John Doe'
        },
        payment_intent: {
          id: 'pi_example123',
          application_fee_amount: 2541, // 8.5% of $299.00
          transfer_data: {
            destination: 'acct_example123'
          }
        }
      }
      
      setSession(mockSession)
    } catch (error) {
      console.error('Error fetching session details:', error)
      setError('Failed to retrieve payment details')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number, currency: string = 'usd'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  if (isLoading) {
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
      
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error ? (
            // Error State
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                href="/stripe/store"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Return to Store
              </Link>
            </div>
          ) : session ? (
            // Success State
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              
              {/* Success Message */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your purchase. Your payment has been processed successfully.
              </p>

              {/* Payment Details */}
              <div className="bg-white shadow rounded-lg p-6 mb-8 text-left">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Session ID:</span>
                    <span className="font-mono text-sm text-gray-900">{session.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(session.amount_total, session.currency)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      {session.payment_status.charAt(0).toUpperCase() + session.payment_status.slice(1)}
                    </span>
                  </div>
                  
                  {session.customer_details && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Customer:</span>
                        <span className="text-gray-900">{session.customer_details.name}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900">{session.customer_details.email}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Payment Intent Details */}
                {session.payment_intent && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Transaction Breakdown</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Platform Fee (8.5%):</span>
                        <span className="text-gray-900">
                          {formatCurrency(session.payment_intent.application_fee_amount, session.currency)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-500">Seller Receives:</span>
                        <span className="text-gray-900">
                          {formatCurrency(
                            session.amount_total - session.payment_intent.application_fee_amount, 
                            session.currency
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between pt-2 border-t border-gray-100">
                        <span className="font-medium text-gray-900">Total Charged:</span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(session.amount_total, session.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-medium text-blue-900 mb-2">What's Next?</h3>
                <p className="text-blue-800 mb-4">
                  Your payment has been processed and the seller has been notified. 
                  You should receive an email confirmation shortly with details about your purchase.
                </p>
                <p className="text-sm text-blue-700">
                  If you have any questions about your purchase, please contact the seller directly 
                  or reach out to our support team.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/stripe/store"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Link>
                
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            // No Session State
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Status Unknown</h1>
              <p className="text-gray-600 mb-6">
                We couldn't retrieve the payment details. Please check your email for confirmation.
              </p>
              <Link
                href="/stripe/store"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Return to Store
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
