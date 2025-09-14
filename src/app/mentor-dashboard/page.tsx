'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
import { 
  PlusIcon,
  EyeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface JournalPost {
  id: string
  title: string
  content: string
  excerpt?: string
  isPublic: boolean
  attachments?: Array<{name: string, url: string}>
  createdAt: string
  views: number
}

interface Subscriber {
  id: string
  name: string
  email: string
  subscribedAt: string
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  price: number
  learningPurpose?: string
  isActive: boolean
  currentStudents: number
  maxStudents: number
  createdAt: string
  enrollments: Array<{
    id: string
    student: {
      name: string
      email: string
    }
    enrolledAt: string
  }>
}

export default function MentorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'posts' | 'subscribers' | 'projects'>('posts')
  const [posts, setPosts] = useState<JournalPost[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    isPublic: false
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || (session.user as { role?: string })?.role !== 'MENTOR') {
      router.push('/auth/signin')
    } else {
      fetchDashboardData()
    }
  }, [session, status, router])

  const fetchDashboardData = async () => {
    try {
      const [postsResponse, subscribersResponse, projectsResponse] = await Promise.all([
        fetch('/api/mentor/journal-posts'),
        fetch('/api/mentor/subscribers'),
        fetch('/api/mentor/projects')
      ])
      
      if (postsResponse.ok) {
        const postsData = await postsResponse.json()
        setPosts(postsData.posts)
      }
      
      if (subscribersResponse.ok) {
        const subscribersData = await subscribersResponse.json()
        setSubscribers(subscribersData.subscribers)
      }

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData.projects)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreatingPost(true)
    setMessage(null)
    
    try {
      const response = await fetch('/api/mentor/journal-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
      })

      if (response.ok) {
        setNewPost({ title: '', content: '', excerpt: '', isPublic: false })
        setShowCreatePost(false)
        setMessage({type: 'success', text: 'Post created successfully!'})
        fetchDashboardData()
      } else {
        const errorData = await response.json()
        setMessage({type: 'error', text: `Failed to create post: ${errorData.message}`})
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setMessage({type: 'error', text: 'An unexpected error occurred. Please try again.'})
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    
    try {
      const response = await fetch(`/api/mentor/journal-posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchDashboardData()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    }
  }

  const exportSubscribers = () => {
    const csvContent = [
      ['Name', 'Email', 'Subscribed Date'].join(','),
      ...subscribers.map(sub => [sub.name, sub.email, new Date(sub.subscribedAt).toLocaleDateString()].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'subscribers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage your journal posts and view your subscribers
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Posts
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {posts.length}
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
                    <UserGroupIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Subscribers
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {subscribers.length}
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
                        Total Views
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {posts.reduce((total, post) => total + post.views, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white shadow rounded-lg">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Journal Posts
                </button>
                <button
                  onClick={() => setActiveTab('subscribers')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'subscribers'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Subscribers
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'projects'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Projects
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'posts' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Journal Posts</h3>
                    <button
                      onClick={() => {
                        console.log('Create Post button clicked')
                        setShowCreatePost(true)
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Post
                    </button>
                  </div>

                  {message && (
                    <div className={`mb-6 p-4 rounded-md ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {showCreatePost && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Create New Post</h4>
                      <form onSubmit={handleCreatePost} className="space-y-4">
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title
                          </label>
                          <input
                            type="text"
                            id="title"
                            value={newPost.title}
                            onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                            Excerpt (Preview for non-subscribers)
                          </label>
                          <textarea
                            id="excerpt"
                            rows={2}
                            value={newPost.excerpt}
                            onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                            Content (Full post for subscribers)
                          </label>
                          <textarea
                            id="content"
                            rows={6}
                            value={newPost.content}
                            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newPost.isPublic}
                              onChange={(e) => setNewPost(prev => ({ ...prev, isPublic: e.target.checked }))}
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              Make preview public (excerpt visible to all users)
                            </span>
                          </label>
                        </div>
                        <div className="flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={() => setShowCreatePost(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isCreatingPost}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isCreatingPost ? 'Creating...' : 'Create Post'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{post.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{post.excerpt || post.content.substring(0, 150)}...</p>
                            <div className="flex items-center mt-2 text-sm text-gray-500">
                              <EyeIcon className="h-4 w-4 mr-1" />
                              {post.views} views
                              <span className="mx-2">•</span>
                              {new Date(post.createdAt).toLocaleDateString()}
                              <span className="mx-2">•</span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                post.isPublic ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.isPublic ? 'Public Preview' : 'Subscribers Only'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'subscribers' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-medium text-gray-900">Subscribers</h3>
                    <button
                      onClick={exportSubscribers}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Export CSV
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subscribed Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((subscriber) => (
                          <tr key={subscriber.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {subscriber.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscriber.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(subscriber.subscribedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
                    <button
                      onClick={() => router.push('/projects/create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create New Project
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-12">
                      <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
                      <div className="mt-6">
                        <button
                          onClick={() => router.push('/projects/create')}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Project
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                project.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {project.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Category</span>
                              <p className="text-sm text-gray-900">{project.category}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Difficulty</span>
                              <p className="text-sm text-gray-900">{project.difficulty}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Price</span>
                              <p className="text-sm text-gray-900">${project.price} USD</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Duration</span>
                              <p className="text-sm text-gray-900">{project.duration} weeks</p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-500">
                                {project.currentStudents} / {project.maxStudents} students
                              </span>
                              <span className="text-sm text-gray-500">
                                {project.enrollments.length} enrollments
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => router.push(`/projects/${project.id}/edit`)}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => router.push(`/mentor-dashboard/projects/${project.id}/enrollments`)}
                                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                              >
                                View Enrollments
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
