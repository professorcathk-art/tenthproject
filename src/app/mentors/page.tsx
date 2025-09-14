'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import SuggestCategoryModal from '@/components/SuggestCategoryModal'
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
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    const fetchMentors = async () => {
      try {
        const response = await fetch('/api/mentors')
        if (response.ok) {
          const data = await response.json()
          // Transform the data to match our interface
          const transformedMentors: Mentor[] = data.mentors.map((mentor: {
            id: string;
            user: { name: string; email: string };
            bio?: string;
            specialties: string[];
            experience?: string;
            rating: number;
            totalReviews: number;
            isVerified: boolean;
            languages: string[];
            hourlyRate?: number;
            totalStudents: number;
            projectsCount: number;
          }) => ({
            id: mentor.id,
            name: mentor.user.name || 'Anonymous',
            bio: mentor.bio || 'No bio available',
            specialties: mentor.specialties || [],
            experience: mentor.experience || 'Experience not specified',
            rating: mentor.rating || 4.5,
            totalReviews: mentor.totalReviews || 0,
            isVerified: mentor.isVerified || false,
            languages: mentor.languages || ['English'],
            hourlyRate: mentor.hourlyRate || 50,
            totalStudents: mentor.totalStudents || 0,
            projectsCount: mentor.projectsCount || 0
          }))
          setMentors(transformedMentors)
          setFilteredMentors(transformedMentors)
        } else {
          console.error('Failed to fetch mentors')
        }
      } catch (error) {
        console.error('Error fetching mentors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentors()
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
              <div className="mt-4 space-x-4">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedSpecialty('All')
                  }}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Clear all filters
                </button>
                <span className="text-gray-400">or</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  Suggest an Area
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <SuggestCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
