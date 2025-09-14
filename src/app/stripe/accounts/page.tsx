'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import { 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'

interface AccountStatus {
  accountId: string
  onboardingStatus: string
  canReceivePayments: boolean
  canReceivePayouts: boolean
  created: number
  country: string
  default_currency: string
  capabilities: {
    card_payments: string
    transfers: string
  }
  requirements: {
    currently_due: string[]
    eventually_due: string[]
    past_due: string[]
    pending_verification: string[]
  }
  business_profile: {
    name: string
    url: string
    support_email: string
  } | null
}

export default function StripeAccountsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  // Create a new connected account
  const handleCreateAccount = async () => {
    setIsCreating(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/stripe/accounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({type: 'success', text: 'Connected account created successfully!'})
        // Refresh account status
        if (data.accountId) {
          fetchAccountStatus(data.accountId)
        }
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to create account'})
      }
    } catch (error) {
      console.error('Error creating account:', error)
      setMessage({type: 'error', text: 'An unexpected error occurred'})
    } finally {
      setIsCreating(false)
    }
  }

  // Fetch account status
  const fetchAccountStatus = async (accountId: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/stripe/accounts/${accountId}/status`)
      const data = await response.json()

      if (response.ok) {
        setAccountStatus(data)
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to fetch account status'})
      }
    } catch (error) {
      console.error('Error fetching account status:', error)
      setMessage({type: 'error', text: 'Failed to fetch account status'})
    } finally {
      setIsLoading(false)
    }
  }

  // Start onboarding process
  const handleStartOnboarding = async (accountId: string) => {
    try {
      const response = await fetch(`/api/stripe/accounts/${accountId}/onboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.onboardUrl) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboardUrl
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to start onboarding'})
      }
    } catch (error) {
      console.error('Error starting onboarding:', error)
      setMessage({type: 'error', text: 'Failed to start onboarding'})
    }
  }

  // Open Express dashboard
  const handleOpenDashboard = async (accountId: string) => {
    try {
      const response = await fetch(`/api/stripe/accounts/${accountId}/onboard`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok && data.loginUrl) {
        // Open dashboard in new tab
        window.open(data.loginUrl, '_blank')
      } else {
        setMessage({type: 'error', text: data.message || 'Failed to open dashboard'})
      }
    } catch (error) {
      console.error('Error opening dashboard:', error)
      setMessage({type: 'error', text: 'Failed to open dashboard'})
    }
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fully_onboarded':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Fully Onboarded
          </span>
        )
      case 'charges_enabled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Can Receive Payments
          </span>
        )
      case 'details_submitted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Under Review
          </span>
        )
      case 'incomplete':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
            Incomplete
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <ClockIcon className="h-3 w-3 mr-1" />
            Not Started
          </span>
        )
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
            <h1 className="text-3xl font-bold text-gray-900">Stripe Connect Accounts</h1>
            <p className="mt-2 text-gray-600">
              Manage your connected accounts for receiving payments
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

          {/* Account Management */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Connected Account</h2>
            </div>
            
            <div className="p-6">
              {!accountStatus ? (
                // No account created yet
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-gray-400">
                    <CheckCircleIcon className="h-12 w-12" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No connected account</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Create a connected account to start receiving payments.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={handleCreateAccount}
                      disabled={isCreating}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Connected Account
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                // Account exists - show status and actions
                <div className="space-y-6">
                  {/* Account Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                      <p className="text-sm text-gray-500">Account ID: {accountStatus.accountId}</p>
                    </div>
                    {getStatusBadge(accountStatus.onboardingStatus)}
                  </div>

                  {/* Capabilities */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Capabilities</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          {accountStatus.canReceivePayments ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-700">Can receive payments</span>
                        </div>
                        <div className="flex items-center">
                          {accountStatus.canReceivePayouts ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                          )}
                          <span className="text-sm text-gray-700">Can receive payouts</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Account Details</h4>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-700">Country: {accountStatus.country?.toUpperCase()}</p>
                        <p className="text-sm text-gray-700">Currency: {accountStatus.default_currency?.toUpperCase()}</p>
                        <p className="text-sm text-gray-700">
                          Created: {new Date(accountStatus.created * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements (if any) */}
                  {accountStatus.requirements.currently_due.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-yellow-800 mb-2">Required Information</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {accountStatus.requirements.currently_due.map((requirement, index) => (
                          <li key={index}>• {requirement.replace(/_/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-4">
                    {accountStatus.onboardingStatus !== 'fully_onboarded' && (
                      <button
                        onClick={() => handleStartOnboarding(accountStatus.accountId)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                        {accountStatus.onboardingStatus === 'not_started' ? 'Start Onboarding' : 'Complete Onboarding'}
                      </button>
                    )}

                    {accountStatus.canReceivePayments && (
                      <button
                        onClick={() => handleOpenDashboard(accountStatus.accountId)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                        Open Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => fetchAccountStatus(accountStatus.accountId)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Refresh Status
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
