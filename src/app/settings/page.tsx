'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon,
  UserIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface PayoutSettings {
  stripeAccountId?: string
  payoutEnabled: boolean
  payoutMethod?: string
  bankAccountLast4?: string
  bankAccountType?: string
  accountStatus?: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>({
    payoutEnabled: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)
  
  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else {
      fetchPayoutSettings()
    }
  }, [session, status, router])

  const fetchPayoutSettings = async () => {
    try {
      const response = await fetch('/api/settings/payout')
      if (response.ok) {
        const data = await response.json()
        setPayoutSettings(data)
      }
    } catch (error) {
      console.error('Error fetching payout settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectStripe = async () => {
    setIsConnecting(true)
    try {
      const response = await fetch('/api/stripe/connect', {
        method: 'POST',
      })
      
      if (response.ok) {
        const { accountLink } = await response.json()
        window.location.href = accountLink
      }
    } catch (error) {
      console.error('Error connecting to Stripe:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectStripe = async () => {
    try {
      const response = await fetch('/api/stripe/disconnect', {
        method: 'POST',
      })
      
      if (response.ok) {
        await fetchPayoutSettings()
      }
    } catch (error) {
      console.error('Error disconnecting Stripe:', error)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsChangingPassword(true)
    setPasswordMessage(null)

    try {
      // Validate passwords match
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
        return
      }

      // Validate password length
      if (passwordForm.newPassword.length < 8) {
        setPasswordMessage({ type: 'error', text: 'New password must be at least 8 characters long' })
        return
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully' })
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setShowPasswordChange(false)
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to change password' })
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'An error occurred while changing password' })
      console.error('Error changing password:', error)
    } finally {
      setIsChangingPassword(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
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

  const isMentor = (session.user as { role?: string })?.role === 'MENTOR'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account settings and payout preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Settings Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                        <UserIcon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.user?.name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {session.user?.email}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isMentor 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isMentor ? 'Mentor' : 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2">
              {isMentor ? (
                <div className="space-y-6">
                  {/* Payout Settings */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <BanknotesIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Payout Settings
                        </h3>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-sm text-gray-600 mb-4">
                          Connect your Stripe account to receive payments for your projects. 
                          You&apos;ll receive 91.5% of project earnings (8.5% platform fee).
                        </p>
                        
                        {payoutSettings.payoutEnabled ? (
                          <div className="bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800">
                                  Payout Account Connected
                                </h3>
                                <div className="mt-2 text-sm text-green-700">
                                  <p>Your Stripe account is connected and ready to receive payments.</p>
                                  {payoutSettings.bankAccountLast4 && (
                                    <p className="mt-1">
                                      Bank account ending in {payoutSettings.bankAccountLast4}
                                    </p>
                                  )}
                                </div>
                                <div className="mt-3">
                                  <button
                                    onClick={handleDisconnectStripe}
                                    className="text-sm font-medium text-red-600 hover:text-red-500"
                                  >
                                    Disconnect Account
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                              </div>
                              <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800">
                                  Payout Account Not Connected
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700">
                                  <p>Connect your Stripe account to start receiving payments for your projects.</p>
                                </div>
                                <div className="mt-3">
                                  <button
                                    onClick={handleConnectStripe}
                                    disabled={isConnecting}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                  >
                                    {isConnecting ? 'Connecting...' : 'Connect Stripe Account'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Payout Information</h4>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Platform Fee</dt>
                            <dd className="text-sm text-gray-900">8.5%</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Your Earnings</dt>
                            <dd className="text-sm text-gray-900">91.5%</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Payout Frequency</dt>
                            <dd className="text-sm text-gray-900">Weekly (Mondays)</dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Minimum Payout</dt>
                            <dd className="text-sm text-gray-900">$10.00</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <Cog6ToothIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Account Settings
                        </h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email Notifications
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Receive notifications about project enrollments, payments, and updates
                          </p>
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                defaultChecked
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Enable email notifications
                              </span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Profile Visibility
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Control how your profile appears to students
                          </p>
                          <div className="mt-2">
                            <label className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                defaultChecked
                              />
                              <span className="ml-2 text-sm text-gray-700">
                                Make profile public
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Change Section */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <KeyIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Change Password
                        </h3>
                      </div>
                      
                      {passwordMessage && (
                        <div className={`mb-4 p-4 rounded-md ${
                          passwordMessage.type === 'success' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex">
                            <div className="flex-shrink-0">
                              {passwordMessage.type === 'success' ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                              ) : (
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className={`text-sm font-medium ${
                                passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {passwordMessage.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!showPasswordChange ? (
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change Password
                        </button>
                      ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                id="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.current ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                id="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                minLength={8}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.new ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Password must be at least 8 characters long
                            </p>
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.confirm ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordChange(false)
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                setPasswordMessage(null)
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isChangingPassword}
                              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Student Settings
                    </h3>
                    <p className="text-gray-600">
                      As a student, you can manage your learning preferences and account settings here.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Receive project updates and announcements
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Learning Preferences
                        </label>
                        <div className="mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              defaultChecked
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Show beginner-friendly projects first
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Password Change Section for Students */}
                  <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <KeyIcon className="h-6 w-6 text-gray-400 mr-3" />
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Change Password
                        </h3>
                      </div>
                      
                      {passwordMessage && (
                        <div className={`mb-4 p-4 rounded-md ${
                          passwordMessage.type === 'success' 
                            ? 'bg-green-50 border border-green-200' 
                            : 'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex">
                            <div className="flex-shrink-0">
                              {passwordMessage.type === 'success' ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                              ) : (
                                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                            <div className="ml-3">
                              <p className={`text-sm font-medium ${
                                passwordMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {passwordMessage.text}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!showPasswordChange ? (
                        <button
                          onClick={() => setShowPasswordChange(true)}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Change Password
                        </button>
                      ) : (
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                              Current Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                id="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('current')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.current ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                              New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                id="newPassword"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                                minLength={8}
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('new')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.new ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">
                              Password must be at least 8 characters long
                            </p>
                          </div>

                          <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                              Confirm New Password
                            </label>
                            <div className="mt-1 relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="block w-full pr-10 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility('confirm')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              >
                                {showPasswords.confirm ? (
                                  <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <EyeIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={() => {
                                setShowPasswordChange(false)
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
                                setPasswordMessage(null)
                              }}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={isChangingPassword}
                              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                              {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
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
