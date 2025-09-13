'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
import { 
  EyeIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface Project {
  id: string
  title: string
  description: string
  category: string
  purposes: string[]
  difficulty: string
  price: number
  isActive: boolean
  createdAt: string
  mentor: {
    user: {
      name: string
      email: string
    }
  }
}

interface CategorySuggestion {
  id: string
  name: string
  description?: string
  contactEmail: string
  contactName?: string
  comment?: string
  status: string
  createdAt: string
}

interface Mentor {
  id: string
  user: {
    name: string
    email: string
  }
  bio?: string
  specialties: string[]
  rating: number
  totalReviews: number
  hourlyRate?: number
  projectsCount: number
  totalEarnings: number
  isVerified: boolean
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [categorySuggestions, setCategorySuggestions] = useState<CategorySuggestion[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [commissionRate, setCommissionRate] = useState(0.085)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'projects' | 'suggestions' | 'mentors'>('projects')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else {
      const isAdmin = (session.user as { role?: string })?.role === 'ADMIN'
      if (!isAdmin) {
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  useEffect(() => {
    if (session && (session.user as { role?: string })?.role === 'ADMIN') {
      fetchProjects()
      fetchCategorySuggestions()
      fetchMentors()
      fetchCommissionRate()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorySuggestions = async () => {
    try {
      const response = await fetch('/api/admin/category-suggestions')
      if (response.ok) {
        const data = await response.json()
        setCategorySuggestions(data.suggestions)
      }
    } catch (error) {
      console.error('Error fetching category suggestions:', error)
    }
  }

  const fetchMentors = async () => {
    try {
      const response = await fetch('/api/admin/mentors')
      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors)
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    }
  }

  const fetchCommissionRate = async () => {
    try {
      const response = await fetch('/api/admin/config/commission-rate')
      if (response.ok) {
        const data = await response.json()
        setCommissionRate(data.rate)
      }
    } catch (error) {
      console.error('Error fetching commission rate:', error)
    }
  }

  const updateProjectStatus = async (projectId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      })

      if (response.ok) {
        setProjects(prev => 
          prev.map(project => 
            project.id === projectId 
              ? { ...project, isActive }
              : project
          )
        )
      }
    } catch (error) {
      console.error('Error updating project:', error)
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

  const isAdmin = (session.user as { role?: string })?.role === 'ADMIN'
  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage projects and review submissions
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projects ({projects.length})
                </button>
                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'suggestions'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Area Suggestions ({categorySuggestions.length})
                </button>
                <button
                  onClick={() => setActiveTab('mentors')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'mentors'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Mentors ({mentors.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Pending Review
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {projects.filter(p => !p.isActive).length}
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
                    <CheckCircleIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Active Projects
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {projects.filter(p => p.isActive).length}
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
                    <EyeIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Projects
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {projects.length}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Table */}
          {activeTab === 'projects' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Project Management
                </h3>
              
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Projects will appear here when mentors create them.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mentor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {project.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {project.mentor.user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.mentor.user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {project.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {project.purposes.map((purpose) => (
                                <span
                                  key={purpose}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {purpose}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              project.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {project.isActive ? 'Active' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateProjectStatus(project.id, !project.isActive)}
                                className={`${
                                  project.isActive 
                                    ? 'text-red-600 hover:text-red-900' 
                                    : 'text-green-600 hover:text-green-900'
                                }`}
                              >
                                {project.isActive ? (
                                  <>
                                    <XCircleIcon className="h-4 w-4" />
                                    <span className="sr-only">Deactivate</span>
                                  </>
                                ) : (
                                  <>
                                    <CheckCircleIcon className="h-4 w-4" />
                                    <span className="sr-only">Activate</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              </div>
            </div>
          )}

          {/* Category Suggestions Table */}
          {activeTab === 'suggestions' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Area Suggestions
                </h3>
                
                {categorySuggestions.length === 0 ? (
                  <div className="text-center py-8">
                    <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No suggestions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Area suggestions will appear here when users submit them.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Area Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submitted
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {categorySuggestions.map((suggestion) => (
                          <tr key={suggestion.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {suggestion.name}
                              </div>
                              {suggestion.comment && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {suggestion.comment}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {suggestion.contactName || 'Anonymous'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {suggestion.contactEmail}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {suggestion.description || 'No description provided'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                suggestion.status === 'PENDING' 
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : suggestion.status === 'APPROVED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {suggestion.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(suggestion.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mentors Management */}
          {activeTab === 'mentors' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Mentor Management
                </h3>
                
                {mentors.length === 0 ? (
                  <div className="text-center py-8">
                    <EyeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Mentors will appear here when they create profiles and projects.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Mentor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rating
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Projects
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Earnings
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mentors.map((mentor) => (
                          <tr key={mentor.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-indigo-600">
                                      {mentor.user.name?.split(' ').map(n => n[0]).join('') || 'M'}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {mentor.user.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {mentor.user.email}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {mentor.rating.toFixed(1)} ⭐
                              </div>
                              <div className="text-sm text-gray-500">
                                {mentor.totalReviews} reviews
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {mentor.projectsCount} active
                              </div>
                              <div className="text-sm text-gray-500">
                                ${mentor.hourlyRate || 0}/hr
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ${mentor.totalEarnings.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Commission: ${(mentor.totalEarnings * commissionRate).toFixed(2)} ({(commissionRate * 100).toFixed(1)}%)
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => {
                                    // Hide all projects from this mentor
                                    const mentorProjects = projects.filter(p => p.mentor.user.email === mentor.user.email)
                                    mentorProjects.forEach(project => {
                                      updateProjectStatus(project.id, false)
                                    })
                                  }}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Hide Projects
                                </button>
                                <button
                                  onClick={() => {
                                    // Show all projects from this mentor
                                    const mentorProjects = projects.filter(p => p.mentor.user.email === mentor.user.email)
                                    mentorProjects.forEach(project => {
                                      updateProjectStatus(project.id, true)
                                    })
                                  }}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Show Projects
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
