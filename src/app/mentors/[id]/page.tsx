'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ClockIcon,
  LinkIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Mentor {
  id: string
  user: {
    name: string
    email: string
  }
  bio: string
  specialties: string[]
  experience: string
  qualifications: string[]
  languages: string[]
  isVerified: boolean
  rating: number
  totalReviews: number
  website?: string
  linkedin?: string
  github?: string
  twitter?: string
  instagram?: string
  personalLinks?: Array<{title: string, url: string}>
  portfolio?: string
  teachingMethods: string[]
}

interface Project {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: number
  price: number
  rating: number
  totalReviews: number
}

export default function MentorProfilePage() {
  const params = useParams()
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const fetchMentor = async () => {
      try {
        const response = await fetch(`/api/mentors/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setMentor(data.mentor)
          setProjects(data.projects || [])
          setIsWishlisted(data.isWishlisted || false)
        } else if (response.status === 404) {
          setMentor(null)
        } else {
          console.error('Failed to fetch mentor')
        }
      } catch (error) {
        console.error('Error fetching mentor:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMentor()
  }, [params.id])

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // In real app, make API call to update wishlist
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

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Mentor not found</h1>
            <Link href="/mentors" className="text-indigo-600 hover:text-indigo-500">
              Browse all mentors
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Breadcrumb */}
          <nav className="flex mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/mentors" className="text-gray-500 hover:text-gray-700">
                  Mentors
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400">/</span>
                  <span className="ml-4 text-gray-900 font-medium">{mentor.user.name}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Mentor Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-2xl font-medium text-indigo-600">
                        {mentor.user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{mentor.user.name}</h1>
                        {mentor.isVerified && (
                          <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium text-gray-900">{mentor.rating.toFixed(1)}</span>
                          <span className="ml-1">({mentor.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-1" />
                          {mentor.experience}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleWishlist}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-gray-100"
                  >
                    {isWishlisted ? (
                      <HeartSolidIcon className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartIcon className="h-6 w-6 text-gray-400 hover:text-red-500" />
                    )}
                  </button>
                </div>

                {/* Specialties */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {mentor.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                {mentor.qualifications && mentor.qualifications.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Qualifications</h3>
                    <ul className="space-y-2">
                      {mentor.qualifications.map((qualification, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{qualification}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Teaching Methods */}
                {mentor.teachingMethods && mentor.teachingMethods.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Teaching Methods</h3>
                    <ul className="space-y-2">
                      {mentor.teachingMethods.map((method, index) => (
                        <li key={index} className="flex items-start">
                          <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700">{method}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Languages */}
                <div className="flex items-center text-sm text-gray-500">
                  <GlobeAltIcon className="h-4 w-4 mr-1" />
                  <span>Languages: {mentor.languages.join(', ')}</span>
                </div>
              </div>

              {/* Projects */}
              {projects.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Projects</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">{project.title}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {project.category}
                              </span>
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {project.difficulty}
                              </span>
                              <div className="flex items-center">
                                <ClockIcon className="h-4 w-4 mr-1" />
                                {project.duration} weeks
                              </div>
                              <div className="flex items-center">
                                <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                {project.rating.toFixed(1)} ({project.totalReviews})
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">${project.price}</div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Pricing</h3>
                
                <div className="text-center mb-6">
                  <div className="text-lg font-semibold text-gray-900 mb-2">
                    Project-Based Mentoring
                  </div>
                  <div className="text-gray-500">Fixed project pricing</div>
                </div>


                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Verified mentor</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Quick response time</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>1-on-1 mentoring</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Project-based learning</span>
                  </div>
                </div>

                {/* Social Links */}
                {(mentor.website || mentor.linkedin || mentor.github || mentor.portfolio || mentor.twitter || mentor.instagram) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Connect</h4>
                    <div className="space-y-2">
                      {mentor.website && (
                        <a
                          href={mentor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <GlobeAltIcon className="h-4 w-4 mr-2" />
                          Website
                        </a>
                      )}
                      {mentor.linkedin && (
                        <a
                          href={mentor.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <BriefcaseIcon className="h-4 w-4 mr-2" />
                          LinkedIn
                        </a>
                      )}
                      {mentor.github && (
                        <a
                          href={mentor.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          GitHub
                        </a>
                      )}
                      {mentor.portfolio && (
                        <a
                          href={mentor.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <BriefcaseIcon className="h-4 w-4 mr-2" />
                          Portfolio
                        </a>
                      )}
                      {mentor.twitter && (
                        <a
                          href={mentor.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                          </svg>
                          X (Twitter)
                        </a>
                      )}
                      {mentor.instagram && (
                        <a
                          href={mentor.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.017 0C8.396 0 7.989.013 6.756.072 5.526.131 4.742.333 4.041.63a5.917 5.917 0 00-2.125 1.386A5.917 5.917 0 00.63 4.041C.333 4.742.131 5.526.072 6.756.013 7.989 0 8.396 0 12.017c0 3.622.013 4.028.072 5.261.059 1.23.261 2.014.558 2.715a5.917 5.917 0 001.386 2.125 5.917 5.917 0 002.125 1.386c.701.297 1.485.499 2.715.558C7.989 23.987 8.396 24 12.017 24c3.622 0 4.028-.013 5.261-.072 1.23-.059 2.014-.261 2.715-.558a5.917 5.917 0 002.125-1.386 5.917 5.917 0 001.386-2.125c.297-.701.499-1.485.558-2.715.059-1.23.072-1.639.072-5.261 0-3.622-.013-4.028-.072-5.261-.059-1.23-.261-2.014-.558-2.715a5.917 5.917 0 00-1.386-2.125A5.917 5.917 0 0019.993.63c-.701-.297-1.485-.499-2.715-.558C15.045.013 14.639 0 12.017 0zm0 2.16c3.576 0 3.997.014 5.404.072 1.302.059 2.009.279 2.48.462.619.242 1.061.531 1.525.995.464.464.753.906.995 1.525.183.471.403 1.178.462 2.48.058 1.407.072 1.828.072 5.404 0 3.576-.014 3.997-.072 5.404-.059 1.302-.279 2.009-.462 2.48-.242.619-.531 1.061-.995 1.525-.464.464-.906.753-1.525.995-.471.183-1.178.403-2.48.462-1.407.058-1.828.072-5.404.072-3.576 0-3.997-.014-5.404-.072-1.302-.059-2.009-.279-2.48-.462a4.034 4.034 0 01-1.525-.995 4.034 4.034 0 01-.995-1.525c-.183-.471-.403-1.178-.462-2.48-.058-1.407-.072-1.828-.072-5.404 0-3.576.014-3.997.072-5.404.059-1.302.279-2.009.462-2.48.242-.619.531-1.061.995-1.525a4.034 4.034 0 011.525-.995c.471-.183 1.178-.403 2.48-.462C8.02 2.174 8.441 2.16 12.017 2.16zm0 5.838a4.002 4.002 0 100 8.004 4.002 4.002 0 000-8.004zm0 6.6a2.598 2.598 0 100-5.196 2.598 2.598 0 000 5.196zm5.602-6.6a.938.938 0 100 1.876.938.938 0 000-1.876z" clipRule="evenodd" />
                          </svg>
                          Instagram
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Personal Links */}
                {mentor.personalLinks && mentor.personalLinks.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Personal Links</h4>
                    <div className="space-y-2">
                      {mentor.personalLinks.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          <LinkIcon className="h-4 w-4 mr-2" />
                          {link.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
