'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/components/navigation'
import { 
  HeartIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Project {
  id: string
  title: string
  description: string
  shortDescription: string
  category: string
  difficulty: string
  duration: number
  price: number
  currency: string
  objectives: string[]
  prerequisites: string[]
  tools: string[]
  deliverables: string[]
  mentor: {
    name: string
    bio: string
    rating: number
    totalReviews: number
    specialties: string[]
    experience: string
    isVerified: boolean
  }
  rating: number
  totalReviews: number
  isWishlisted?: boolean
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockProject: Project = {
      id: params.id as string,
      title: 'AI Website Development & Monetization',
      description: 'Learn to build and monetize AI-powered websites from scratch. This comprehensive project covers frontend development with React, AI integration using OpenAI APIs, backend development with Node.js, and business strategies for monetization. You&apos;ll build a complete SaaS application and learn how to deploy it to production. Throughout this project, you&apos;ll work on real-world scenarios and build a portfolio-worthy application that you can actually monetize.',
      shortDescription: 'Build and monetize AI-powered websites from scratch',
      category: 'Technology',
      difficulty: 'Intermediate',
      duration: 8,
      price: 299,
      currency: 'USD',
      objectives: [
        'Build a responsive React frontend with modern UI components',
        'Integrate AI APIs (OpenAI, Anthropic) for intelligent functionality',
        'Create a robust Node.js backend with Express and MongoDB',
        'Implement secure user authentication and authorization',
        'Deploy the application to production using Vercel and MongoDB Atlas',
        'Learn proven monetization strategies for SaaS applications',
        'Set up payment processing with Stripe',
        'Implement analytics and user tracking'
      ],
      prerequisites: [
        'Basic JavaScript knowledge (ES6+)',
        'Understanding of React fundamentals (components, state, props)',
        'Basic HTML/CSS skills',
        'Familiarity with Git version control',
        'Basic understanding of APIs and HTTP requests'
      ],
      tools: [
        'React 18 with TypeScript',
        'Node.js and Express.js',
        'MongoDB and Mongoose',
        'OpenAI API and Anthropic Claude',
        'Stripe for payments',
        'Vercel for deployment',
        'Tailwind CSS for styling',
        'Next.js for full-stack development'
      ],
      deliverables: [
        'Complete AI-powered website with full functionality',
        'Source code repository with proper documentation',
        'Step-by-step deployment guide',
        'Comprehensive monetization strategy document',
        'Live demo of your deployed application',
        'Certificate of completion',
        'Portfolio-ready project showcase'
      ],
      mentor: {
        name: 'Alex Chen',
        bio: 'Full-stack developer with 8+ years of experience in AI and web development. I\'ve built and scaled multiple SaaS applications and love teaching others how to do the same. My students have gone on to build successful businesses using the skills they learned.',
        rating: 4.9,
        totalReviews: 234,
        specialties: ['AI Development', 'Web Development', 'JavaScript', 'Python', 'SaaS'],
        experience: '8+ years in software development',
        isVerified: true
      },
      rating: 4.9,
      totalReviews: 127,
      isWishlisted: false
    }

    setProject(mockProject)
    setIsWishlisted(mockProject.isWishlisted || false)
    setIsLoading(false)
  }, [params.id])

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // In real app, make API call to update wishlist
  }

  const handleEnroll = () => {
    // In real app, redirect to payment/checkout
    alert('Redirecting to checkout...')
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

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
            <Link href="/projects" className="text-indigo-600 hover:text-indigo-500">
              Browse all projects
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
                <Link href="/projects" className="text-gray-500 hover:text-gray-700">
                  Projects
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400">/</span>
                  <span className="ml-4 text-gray-500">{project.category}</span>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400">/</span>
                  <span className="ml-4 text-gray-900 font-medium">{project.title}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Project Header */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {project.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {project.difficulty}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    <p className="text-lg text-gray-600">{project.shortDescription}</p>
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

                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-gray-900">{project.rating}</span>
                    <span className="ml-1">({project.totalReviews} reviews)</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {project.duration} weeks
                  </div>
                  <div className="flex items-center">
                    <UserGroupIcon className="h-4 w-4 mr-1" />
                    Max 10 students
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">{project.description}</p>
              </div>

              {/* Learning Objectives */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Learn</h2>
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prerequisites</h2>
                <ul className="space-y-2">
                  {project.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-2 w-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tools & Technologies */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tools & Technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((tool, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Get</h2>
                <ul className="space-y-2">
                  {project.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start">
                      <PlayIcon className="h-5 w-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    ${project.price}
                  </div>
                  <div className="text-gray-500">One-time payment</div>
                </div>

                <button
                  onClick={handleEnroll}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium mb-4"
                >
                  Enroll Now
                </button>

                <div className="text-center text-sm text-gray-500 mb-4">
                  <div className="flex items-center justify-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                    30-day money-back guarantee
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Lifetime access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Certificate of completion</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>1-on-1 mentor support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Source code included</span>
                  </div>
                </div>
              </div>

              {/* Mentor Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mentor</h3>
                
                <div className="flex items-start space-x-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-indigo-600">
                      {project.mentor.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{project.mentor.name}</h4>
                      {project.mentor.isVerified && (
                        <CheckCircleIcon className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {project.mentor.rating} ({project.mentor.totalReviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">{project.mentor.bio}</p>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Experience:</span>
                    <span className="ml-1 text-gray-600">{project.mentor.experience}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-gray-900">Specialties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.mentor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Message Mentor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
