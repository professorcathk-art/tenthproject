'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  BookOpenIcon, 
  UserGroupIcon, 
  HeartIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
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
  // const isStudent = (session.user as { role?: string })?.role === 'STUDENT'

  const studentStats = [
    { name: 'Enrolled Projects', value: '0', icon: BookOpenIcon },
    { name: 'Completed Projects', value: '0', icon: ChartBarIcon },
    { name: 'Wishlist Items', value: '0', icon: HeartIcon },
    { name: 'Messages', value: '0', icon: ChatBubbleLeftRightIcon },
  ]

  const mentorStats = [
    { name: 'Active Projects', value: '0', icon: BookOpenIcon },
    { name: 'Total Students', value: '0', icon: UserGroupIcon },
    { name: 'Rating', value: '0.0', icon: ChartBarIcon },
    { name: 'Messages', value: '0', icon: ChatBubbleLeftRightIcon },
  ]

  const stats = isMentor ? mentorStats : studentStats

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {session.user?.name || session.user?.email}!
            </h1>
            <p className="mt-2 text-gray-600">
              {isMentor 
                ? 'Manage your projects and mentor students' 
                : 'Continue your learning journey with real projects'
              }
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {stat.name}
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stat.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-8 w-8 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {isMentor 
                      ? 'Start teaching to see your activity here'
                      : 'Start learning to see your activity here'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {isMentor ? (
                    <>
                      <Link href="/projects/create" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        Create New Project
                      </Link>
                      <Link href="/students" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        View All Students
                      </Link>
                      <Link href="/profile" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        Update Profile
                      </Link>
                      <Link href="/analytics" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        View Analytics
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/projects" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        Browse Projects
                      </Link>
                      <Link href="/wishlist" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        View Wishlist
                      </Link>
                      <Link href="/enrollments" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        My Enrollments
                      </Link>
                      <Link href="/mentors" className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md block">
                        Find Mentors
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
