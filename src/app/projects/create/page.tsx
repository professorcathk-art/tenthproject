'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/navigation'
// Icons can be added later if needed for the form

export default function CreateProjectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: 'TECHNOLOGY',
    purposes: [] as string[],
    learningPurpose: '',
    difficulty: 'BEGINNER',
    duration: 4,
    price: 0,
    maxStudents: 10,
    objectives: [''],
    prerequisites: [''],
    tools: [''],
    deliverables: ['']
  })

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

  if (status === 'loading') {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePurposeChange = (purpose: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      purposes: checked 
        ? [...prev.purposes, purpose]
        : prev.purposes.filter(p => p !== purpose)
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: string, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: string, i: number) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate purposes
    if (formData.purposes.length === 0) {
      alert('Please select at least one purpose')
      return
    }

    // Validate learning purpose
    if (!formData.learningPurpose) {
      alert('Please select a learning purpose')
      return
    }

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Project created successfully! It will be reviewed by admin before going live.')
        router.push('/dashboard')
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
            <p className="mt-2 text-gray-600">
              List your project in the marketplace for students to enroll
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., AI Website Development"
                    />
                  </div>

                  <div>
                    <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700">
                      Short Description *
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      id="shortDescription"
                      required
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Brief one-line description for the project card"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Detailed Description *
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows={6}
                      required
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Provide a detailed description of what students will learn and build..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                        Category *
                      </label>
                      <select
                        name="category"
                        id="category"
                        required
                        value={formData.category}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="TECHNOLOGY">Technology</option>
                        <option value="BUSINESS">Business</option>
                        <option value="DESIGN">Design</option>
                        <option value="ACADEMIC">Academic</option>
                        <option value="LANGUAGE">Language</option>
                        <option value="CREATIVE">Creative</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                        Difficulty Level *
                      </label>
                      <select
                        name="difficulty"
                        id="difficulty"
                        required
                        value={formData.difficulty}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purpose * (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { value: 'MONETARIZE', label: 'Monetarize' },
                        { value: 'LEISURE', label: 'Leisure' },
                        { value: 'CAREER', label: 'Career' },
                        { value: 'ACADEMIC', label: 'Academic' }
                      ].map((purpose) => (
                        <label key={purpose.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.purposes.includes(purpose.value)}
                            onChange={(e) => handlePurposeChange(purpose.value, e.target.checked)}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">{purpose.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="learningPurpose" className="block text-sm font-medium text-gray-700">
                      Learning Purpose * (Primary focus for students)
                    </label>
                    <select
                      name="learningPurpose"
                      id="learningPurpose"
                      required
                      value={formData.learningPurpose}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select learning purpose</option>
                      <option value="MONETARIZE">Monetarize</option>
                      <option value="LEISURE">Leisure</option>
                      <option value="CAREER">Career</option>
                      <option value="ACADEMIC">Academic</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Project Details
                </h3>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                      Duration (weeks) *
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      required
                      min="1"
                      max="52"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (USD) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxStudents" className="block text-sm font-medium text-gray-700">
                      Max Students *
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      id="maxStudents"
                      required
                      min="1"
                      max="100"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Learning Objectives
                </h3>
                
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="What will students learn?"
                    />
                    {formData.objectives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('objectives', index)}
                        className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('objectives')}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Add Objective
                </button>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Prerequisites
                </h3>
                
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="What should students know before starting?"
                    />
                    {formData.prerequisites.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('prerequisites', index)}
                        className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('prerequisites')}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Add Prerequisite
                </button>
              </div>
            </div>

            {/* Tools & Technologies */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Tools & Technologies
                </h3>
                
                {formData.tools.map((tool, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tool}
                      onChange={(e) => handleArrayChange('tools', index, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., React, Node.js, Python"
                    />
                    {formData.tools.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tools', index)}
                        className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('tools')}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Add Tool
                </button>
              </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  What Students Will Build
                </h3>
                
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="e.g., A fully functional e-commerce website"
                    />
                    {formData.deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('deliverables', index)}
                        className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('deliverables')}
                  className="mt-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Add Deliverable
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
