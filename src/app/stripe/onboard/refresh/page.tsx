'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

function OnboardRefreshContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const accountId = searchParams.get('account_id')
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    if (!accountId) {
      setIsRedirecting(false)
      return
    }

    // In a real application, you would:
    // 1. Check the account status
    // 2. Create a new account link if needed
    // 3. Redirect to the appropriate URL
    
    // For this demo, we'll simulate a redirect after a short delay
    const timer = setTimeout(() => {
      // Redirect back to the accounts page
      router.push('/stripe/accounts')
    }, 3000)

    return () => clearTimeout(timer)
  }, [accountId, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-2xl mx-auto py-12 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            {isRedirecting ? (
              <>
                {/* Loading State */}
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Refreshing Onboarding</h1>
                <p className="text-gray-600 mb-8">
                  Please wait while we refresh your onboarding session...
                </p>
                
                {accountId && (
                  <div className="bg-gray-100 rounded-lg p-4 mb-8">
                    <p className="text-sm text-gray-600">
                      Account ID: <span className="font-mono">{accountId}</span>
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Error State */}
                <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
                <p className="text-gray-600 mb-8">
                  No account ID provided. Please start the onboarding process again.
                </p>
                
                <button
                  onClick={() => router.push('/stripe/accounts')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Go to Accounts
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardRefreshPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    }>
      <OnboardRefreshContent />
    </Suspense>
  )
}
