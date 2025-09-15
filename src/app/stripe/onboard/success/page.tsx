'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Navigation from '@/components/navigation'
import { CheckCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

function OnboardSuccessContent() {
  const searchParams = useSearchParams()
  const accountId = searchParams.get('account_id')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (accountId) {
      // In a real application, you would:
      // 1. Verify the account status
      // 2. Update your database
      // 3. Send confirmation emails
      
      // For this demo, we'll just simulate loading
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [accountId])

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
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Onboarding Complete!</h1>
            <p className="text-gray-600 mb-8">
              Congratulations! Your Stripe Connect account has been successfully set up.
            </p>

            {accountId && (
              <div className="bg-gray-100 rounded-lg p-4 mb-8">
                <p className="text-sm text-gray-600">
                  Account ID: <span className="font-mono">{accountId}</span>
                </p>
              </div>
            )}

            {/* Information Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-medium text-gray-900 mb-4">What&apos;s Next?</h2>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-indigo-600">1</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Create Products</p>
                    <p>Start creating products to sell in our marketplace.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-indigo-600">2</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Manage Your Account</p>
                    <p>Access your Express dashboard to manage payouts and account details.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="h-6 w-6 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-semibold text-indigo-600">3</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Start Earning</p>
                    <p>Receive payments from customers with our 8.5% platform fee.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-blue-900 mb-4">Your Account Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-800">Accept credit card payments</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-800">Automatic payouts</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-800">Express dashboard access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-800">Fraud protection</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stripe/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                Create Your First Product
              </Link>
              
              <Link
                href="/stripe/accounts"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Manage Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    }>
      <OnboardSuccessContent />
    </Suspense>
  )
}
