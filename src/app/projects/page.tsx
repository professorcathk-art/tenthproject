'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Project {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  price: number
  currency: string
  rating: number
  totalReviews: number
  mentor: {
    name: string
    rating: number
    totalReviews: number
  }
  thumbnail?: string
  isWishlisted?: boolean
}

const categories = [
  'All',
  'Technology',
  'Business',
  'Design',
  'Academic',
  'Language',
  'Creative'
]

const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [sortBy, setSortBy] = useState('popular')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        title: 'AI Website Development & Monetization',
        description: 'Learn to build and monetize AI-powered websites from scratch. Includes frontend development, AI integration, and business strategies.',
        category: 'Technology',
        difficulty: 'Intermediate',
        duration: 8,
        price: 299,
        currency: 'USD',
        rating: 4.9,
        totalReviews: 127,
        mentor: {
          name: 'Alex Chen',
          rating: 4.9,
          totalReviews: 234
        },
        isWishlisted: false
      },
      {
        id: '2',
        title: 'Mobile App Development with React Native',
        description: 'Build cross-platform mobile applications using React Native. Learn state management, navigation, and app store deployment.',
        category: 'Technology',
        difficulty: 'Beginner',
        duration: 6,
        price: 199,
        currency: 'USD',
        rating: 4.8,
        totalReviews: 89,
        mentor: {
          name: 'Sarah Johnson',
          rating: 4.8,
          totalReviews: 156
        },
        isWishlisted: true
      },
      {
        id: '3',
        title: 'Data Analysis & Visualization',
        description: 'Master data analysis using Python, pandas, and visualization tools. Work with real datasets and create compelling visualizations.',
        category: 'Business',
        difficulty: 'Intermediate',
        duration: 4,
        price: 149,
        currency: 'USD',
        rating: 4.7,
        totalReviews: 203,
        mentor: {
          name: 'Michael Rodriguez',
          rating: 4.7,
          totalReviews: 189
        },
        isWishlisted: false
      },
      {
        id: '4',
        title: 'UX/UI Design Masterclass',
        description: 'Learn user experience and interface design principles. Create wireframes, prototypes, and design systems.',
        category: 'Design',
        difficulty: 'Beginner',
        duration: 5,
        price: 179,
        currency: 'USD',
        rating: 4.9,
        totalReviews: 145,
        mentor: {
          name: 'Emma Thompson',
          rating: 4.9,
          totalReviews: 167
        },
        isWishlisted: false
      },
      {
        id: '5',
        title: 'Digital Marketing Strategy',
        description: 'Develop comprehensive digital marketing strategies. Learn SEO, social media marketing, and campaign optimization.',
        category: 'Business',
        difficulty: 'Beginner',
        duration: 3,
        price: 129,
        currency: 'USD',
        rating: 4.6,
        totalReviews: 98,
        mentor: {
          name: 'David Kim',
          rating: 4.6,
          totalReviews: 112
        },
        isWishlisted: true
      },
      {
        id: '6',
        title: 'Machine Learning Fundamentals',
        description: 'Introduction to machine learning concepts and algorithms. Build predictive models using Python and scikit-learn.',
        category: 'Technology',
        difficulty: 'Advanced',
        duration: 10,
        price: 399,
        currency: 'USD',
        rating: 4.8,
        totalReviews: 76,
        mentor: {
          name: 'Dr. Lisa Wang',
          rating: 4.8,
          totalReviews: 89
        },
        isWishlisted: false
      }
    ]

    setProjects(mockProjects)
    setFilteredProjects(mockProjects)
    setIsLoading(false)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = projects

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.mentor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(project => project.category === selectedCategory)
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(project => project.difficulty === selectedDifficulty)
    }

    // Sort
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.totalReviews - a.totalReviews)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration)
        break
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, selectedCategory, selectedDifficulty, sortBy])

  const toggleWishlist = (projectId: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, isWishlisted: !project.isWishlisted }
        : project
    ))
  }

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
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Browse Projects</h1>
            <p className="mt-2 text-gray-600">
              Discover hands-on projects and learn from expert mentors
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, mentors, or skills..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="duration">Duration</option>
                </select>
              </div>
              <div className="text-sm text-gray-500">
                {filteredProjects.length} projects found
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Project Image */}
                <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold">{project.category}</div>
                    <div className="text-sm opacity-90">{project.difficulty}</div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {project.title}
                    </h3>
                    <button
                      onClick={() => toggleWishlist(project.id)}
                      className="ml-2 flex-shrink-0"
                    >
                      {project.isWishlisted ? (
                        <HeartSolidIcon className="h-5 w-5 text-red-500" />
                      ) : (
                        <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Mentor Info */}
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {project.mentor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{project.mentor.name}</p>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-500">
                          {project.mentor.rating} ({project.mentor.totalReviews})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {project.duration} weeks
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 mr-1" />
                      {project.totalReviews} reviews
                    </div>
                  </div>

                  {/* Rating and Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {project.rating}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                      <span className="ml-1 text-lg font-bold text-gray-900">
                        {project.price}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <Link
                      href={`/projects/${project.id}`}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">No projects found matching your criteria</div>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('All')
                  setSelectedDifficulty('All')
                }}
                className="mt-4 text-indigo-600 hover:text-indigo-500"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
