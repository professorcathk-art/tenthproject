'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
import { 
  UserGroupIcon, 
  BookOpenIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Student {
  id: string
  name: string
  email: string
  enrollments: {
    id: string
    status: string
    progress: number
    enrolledAt: string
    project: {
      id: string
      title: string
      category: string
    }
  }[]
}

export default function StudentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else {
      const isMentor = (session.user as { role?: string })?.role === 'MENTOR'
      if (!isMentor) {
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  useEffect(() => {
    if (session && (session.user as { role?: string })?.role === 'MENTOR') {
      fetchStudents()
    }
  }, [session])

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/mentor/students')
      if (response.ok) {
        const data = await response.json()
        setStudents(data.students)
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
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
  if (!isMentor) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Students</h1>
            <p className="mt-2 text-gray-600">
              View and manage students enrolled in your projects
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Students
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpenIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Enrollments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.reduce((total, student) => 
                          total + student.enrollments.filter(e => e.status === 'IN_PROGRESS').length, 0
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed Projects
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {students.reduce((total, student) => 
                          total + student.enrollments.filter(e => e.status === 'COMPLETED').length, 0
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Student Enrollments
              </h3>
              
              {students.length === 0 ? (
                <div className="text-center py-8">
                  <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No students yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Students will appear here when they enroll in your projects.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {students.map((student) => (
                    <div key={student.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {student.name}
                          </h4>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.enrollments.length} project{student.enrollments.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {student.enrollments.map((enrollment) => (
                          <div key={enrollment.id} className="bg-gray-50 rounded-md p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">
                                {enrollment.project.title}
                              </h5>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                enrollment.status === 'COMPLETED' 
                                  ? 'bg-green-100 text-green-800'
                                  : enrollment.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {enrollment.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{enrollment.project.category}</span>
                              <div className="flex items-center space-x-4">
                                <span className="flex items-center">
                                  <ChartBarIcon className="h-4 w-4 mr-1" />
                                  {enrollment.progress}% complete
                                </span>
                                <span className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${enrollment.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
