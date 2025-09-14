'use client'

import Navigation from '@/components/navigation'
import { XCircleIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function StripeCancelPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            {/* Cancel Icon */}
            <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            
            {/* Cancel Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
            <p className="text-gray-600 mb-8">
              Your payment was cancelled. No charges have been made to your account.
            </p>

            {/* Information Card */}
            <div className="bg-white shadow rounded-lg p-6 mb-8 text-left">
              <h2 className="text-lg font-medium text-gray-900 mb-4">What Happened?</h2>
              
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  You cancelled the payment process before completing your purchase. 
                  This could happen for several reasons:
                </p>
                
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You decided not to complete the purchase</li>
                  <li>You encountered an issue during checkout</li>
                  <li>You needed to review your payment details</li>
                  <li>You wanted to make changes to your order</li>
                </ul>
                
                <p className="mt-4">
                  Don&apos;t worry - no payment has been processed and your payment method 
                  has not been charged.
                </p>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Need Help?</h3>
              <p className="text-blue-800 mb-4">
                If you cancelled by accident or encountered an issue, you can try again.
              </p>
              <p className="text-sm text-blue-700">
                For technical issues or questions about our checkout process, 
                please contact our support team.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/stripe/store"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                Try Again
              </Link>
              
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
