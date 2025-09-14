'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import SuggestCategoryModal from '@/components/SuggestCategoryModal'
import { 
  CodeBracketIcon,
  ChartBarIcon,
  PaintBrushIcon,
  BookOpenIcon,
  LanguageIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'

const areas = [
  {
    name: 'Technology',
    description: 'Programming, AI, Web Development, Mobile Apps',
    icon: CodeBracketIcon,
    color: 'bg-blue-500',
    projects: 45,
    mentors: 12
  },
  {
    name: 'Business',
    description: 'Marketing, Finance, Strategy, Entrepreneurship',
    icon: ChartBarIcon,
    color: 'bg-green-500',
    projects: 32,
    mentors: 8
  },
  {
    name: 'Design',
    description: 'UI/UX, Graphic Design, Branding, Photography',
    icon: PaintBrushIcon,
    color: 'bg-purple-500',
    projects: 28,
    mentors: 10
  },
  {
    name: 'Architecture',
    description: 'Building Design, Urban Planning, Construction',
    icon: BookOpenIcon,
    color: 'bg-indigo-500',
    projects: 15,
    mentors: 4
  },
  {
    name: 'Interior Design',
    description: 'Space Planning, Decor, Home Styling',
    icon: PaintBrushIcon,
    color: 'bg-orange-500',
    projects: 12,
    mentors: 3
  },
  {
    name: 'Academic',
    description: 'Research, Analysis, Writing, Mathematics',
    icon: BookOpenIcon,
    color: 'bg-gray-500',
    projects: 22,
    mentors: 6
  },
  {
    name: 'Language',
    description: 'English, Communication, Writing, Translation',
    icon: LanguageIcon,
    color: 'bg-red-500',
    projects: 18,
    mentors: 5
  },
  {
    name: 'Creative',
    description: 'Art, Music, Writing, Film Making',
    icon: MusicalNoteIcon,
    color: 'bg-pink-500',
    projects: 25,
    mentors: 7
  }
]

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Learning Areas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover projects across different fields and find the perfect learning path for your goals
            </p>
          </div>

          {/* Areas Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <div key={area.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-32 ${area.color} flex items-center justify-center`}>
                  <area.icon className="h-16 w-16 text-white" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {area.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {area.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{area.projects} Projects</span>
                    <span>{area.mentors} Mentors</span>
                  </div>
                  
                  <Link 
                    href={`/projects?category=${encodeURIComponent(area.name)}`}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-center block"
                  >
                    Explore {area.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              We&apos;re constantly adding new areas and projects. Let us know what you&apos;d like to learn!
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Suggest an Area
            </button>
          </div>
        </div>
      </div>

      <SuggestCategoryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
