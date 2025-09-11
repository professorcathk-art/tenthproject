'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
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

  const isMentor = (session.user as any)?.role === 'MENTOR'
  // const isStudent = (session.user as any)?.role === 'STUDENT'

  const studentStats = [
    { name: 'Enrolled Projects', value: '3', icon: BookOpenIcon },
    { name: 'Completed Projects', value: '1', icon: ChartBarIcon },
    { name: 'Wishlist Items', value: '5', icon: HeartIcon },
    { name: 'Messages', value: '12', icon: ChatBubbleLeftRightIcon },
  ]

  const mentorStats = [
    { name: 'Active Projects', value: '8', icon: BookOpenIcon },
    { name: 'Total Students', value: '24', icon: UserGroupIcon },
    { name: 'Rating', value: '4.9', icon: ChartBarIcon },
    { name: 'Messages', value: '18', icon: ChatBubbleLeftRightIcon },
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
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        {isMentor 
                          ? 'New student enrolled in "AI Website Development"'
                          : 'Started "AI Website Development" project'
                        }
                      </p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        {isMentor 
                          ? 'Received message from Sarah Chen'
                          : 'Message from your mentor'
                        }
                      </p>
                      <p className="text-sm text-gray-500">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ChartBarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-900">
                        {isMentor 
                          ? 'Project "Data Analysis" completed'
                          : 'Completed "Data Analysis" project'
                        }
                      </p>
                      <p className="text-sm text-gray-500">1 day ago</p>
                    </div>
                  </div>
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
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        Create New Project
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        View All Students
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        Update Profile
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        View Analytics
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        Browse Projects
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        View Wishlist
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        My Enrollments
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-md">
                        Find Mentors
                      </button>
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
