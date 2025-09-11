'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  MagnifyingGlassIcon,
  StarIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface Mentor {
  id: string
  name: string
  bio: string
  specialties: string[]
  experience: string
  rating: number
  totalReviews: number
  isVerified: boolean
  languages: string[]
  hourlyRate: number
  totalStudents: number
  projectsCount: number
}

export default function MentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [sortBy, setSortBy] = useState('rating')
  const [isLoading, setIsLoading] = useState(true)

  const specialties = [
    'All',
    'AI Development',
    'Web Development',
    'Mobile Development',
    'Data Analysis',
    'UX/UI Design',
    'Machine Learning',
    'Python',
    'JavaScript',
    'React',
    'Node.js'
  ]

  useEffect(() => {
    // Mock data for demonstration
    const mockMentors: Mentor[] = [
      {
        id: '1',
        name: 'Alex Chen',
        bio: 'Full-stack developer with 8+ years of experience in AI and web development. I love teaching and helping students build real-world projects that make a difference.',
        specialties: ['AI Development', 'Web Development', 'JavaScript', 'Python'],
        experience: '8+ years in software development',
        rating: 4.9,
        totalReviews: 234,
        isVerified: true,
        languages: ['English', 'Mandarin'],
        hourlyRate: 75,
        totalStudents: 156,
        projectsCount: 12
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        bio: 'Mobile app developer specializing in React Native and Flutter. I help students create cross-platform apps that users love and that solve real problems.',
        specialties: ['React Native', 'Flutter', 'Mobile Development', 'UI/UX'],
        experience: '6+ years in mobile development',
        rating: 4.8,
        totalReviews: 156,
        isVerified: true,
        languages: ['English'],
        hourlyRate: 65,
        totalStudents: 98,
        projectsCount: 8
      },
      {
        id: '3',
        name: 'Michael Rodriguez',
        bio: 'Data scientist and analyst with expertise in Python, machine learning, and business intelligence. I make data accessible and actionable for everyone.',
        specialties: ['Data Analysis', 'Python', 'Machine Learning', 'Business Intelligence'],
        experience: '7+ years in data science',
        rating: 4.7,
        totalReviews: 189,
        isVerified: true,
        languages: ['English', 'Spanish'],
        hourlyRate: 80,
        totalStudents: 134,
        projectsCount: 10
      },
      {
        id: '4',
        name: 'Emma Thompson',
        bio: 'UX/UI designer with a passion for creating intuitive and beautiful user experiences. I help students think like designers and create products users love.',
        specialties: ['UX Design', 'UI Design', 'Figma', 'User Research'],
        experience: '5+ years in design',
        rating: 4.9,
        totalReviews: 167,
        isVerified: true,
        languages: ['English'],
        hourlyRate: 70,
        totalStudents: 89,
        projectsCount: 6
      },
      {
        id: '5',
        name: 'David Kim',
        bio: 'Digital marketing strategist with expertise in SEO, social media, and growth hacking. I help students build successful online businesses and careers.',
        specialties: ['Digital Marketing', 'SEO', 'Social Media', 'Growth Hacking'],
        experience: '6+ years in digital marketing',
        rating: 4.6,
        totalReviews: 112,
        isVerified: true,
        languages: ['English', 'Korean'],
        hourlyRate: 60,
        totalStudents: 76,
        projectsCount: 5
      },
      {
        id: '6',
        name: 'Dr. Lisa Wang',
        bio: 'Machine learning researcher and educator with a PhD in Computer Science. I specialize in making complex AI concepts accessible to learners of all levels.',
        specialties: ['Machine Learning', 'Deep Learning', 'AI Research', 'Python'],
        experience: '10+ years in AI research',
        rating: 4.8,
        totalReviews: 89,
        isVerified: true,
        languages: ['English', 'Mandarin'],
        hourlyRate: 90,
        totalStudents: 67,
        projectsCount: 7
      }
    ]

    setMentors(mockMentors)
    setFilteredMentors(mockMentors)
    setIsLoading(false)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = mentors

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Specialty filter
    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter(mentor => 
        mentor.specialties.includes(selectedSpecialty)
      )
    }

    // Sort
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'reviews':
        filtered.sort((a, b) => b.totalReviews - a.totalReviews)
        break
      case 'students':
        filtered.sort((a, b) => b.totalStudents - a.totalStudents)
        break
      case 'rate-low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate)
        break
      case 'rate-high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate)
        break
    }

    setFilteredMentors(filtered)
  }, [mentors, searchTerm, selectedSpecialty, sortBy])

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
            <h1 className="text-3xl font-bold text-gray-900">Find Expert Mentors</h1>
            <p className="mt-2 text-gray-600">
              Connect with industry professionals and learn from the best
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Search */}
              <div>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search mentors, specialties..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Specialty Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  {specialties.map(specialty => (
                    <option key={specialty} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="students">Most Students</option>
                  <option value="rate-low">Rate: Low to High</option>
                  <option value="rate-high">Rate: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mentors Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Mentor Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-xl font-medium text-indigo-600">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
                        {mentor.isVerified && (
                          <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center mt-1">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {mentor.rating} ({mentor.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {mentor.bio}
                  </p>

                  {/* Specialties */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.slice(0, 3).map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {specialty}
                        </span>
                      ))}
                      {mentor.specialties.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{mentor.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <div className="text-gray-500">Students</div>
                      <div className="font-medium text-gray-900">{mentor.totalStudents}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Projects</div>
                      <div className="font-medium text-gray-900">{mentor.projectsCount}</div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center mb-4 text-sm text-gray-500">
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    <span>{mentor.languages.join(', ')}</span>
                  </div>

                  {/* Rate */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Hourly Rate</div>
                      <div className="text-lg font-bold text-gray-900">${mentor.hourlyRate}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {mentor.experience}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link
                      href={`/mentors/${mentor.id}`}
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                    >
                      View Profile
                    </Link>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMentors.length === 0 && (
            <div className="text-center py-12">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No mentors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or browse all mentors.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedSpecialty('All')
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
