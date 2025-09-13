'use client'

import Navigation from '@/components/navigation'
import { 
  AcademicCapIcon,
  CodeBracketIcon,
  ChartBarIcon,
  PaintBrushIcon,
  BookOpenIcon,
  LanguageIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'

const categories = [
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
    name: 'Academic',
    description: 'Research, Analysis, Writing, Mathematics',
    icon: BookOpenIcon,
    color: 'bg-indigo-500',
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Explore Learning Categories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover projects across different fields and find the perfect learning path for your goals
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.name} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-32 ${category.color} flex items-center justify-center`}>
                  <category.icon className="h-16 w-16 text-white" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{category.projects} Projects</span>
                    <span>{category.mentors} Mentors</span>
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                    Explore {category.name}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 mb-6">
              We're constantly adding new categories and projects. Let us know what you'd like to learn!
            </p>
            <button className="bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors">
              Suggest a Category
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
