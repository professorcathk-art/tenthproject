'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Navigation from '@/components/navigation'
import { UserIcon } from '@heroicons/react/24/outline'

interface MentorProfile {
  bio?: string
  profileImage?: string
  specialties: string[]
  experience?: string
  qualifications: string[]
  languages: string[]
  website?: string
  linkedin?: string
  github?: string
  portfolio?: string
  twitter?: string
  instagram?: string
  personalLinks?: Array<{title: string, url: string}>
  teachingMethods: string[]
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(true)
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
    } else {
      const isMentor = (session.user as { role?: string })?.role === 'MENTOR'
      if (isMentor) {
        fetchMentorProfile()
      }
    }
  }, [session, status, router])

  const fetchMentorProfile = async () => {
    try {
      const response = await fetch('/api/profile/mentor')
      if (response.ok) {
        const data = await response.json()
        setMentorProfile(data.profile)
      }
    } catch (error) {
      console.error('Error fetching mentor profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    
    try {
      const formData = new FormData(e.currentTarget)
      const profileImage = formData.get('profileImage') as File
      
      let profileImageUrl = mentorProfile?.profileImage
      
      // Handle profile image upload if a new image is selected
      if (profileImage && profileImage.size > 0) {
        const uploadFormData = new FormData()
        uploadFormData.append('profileImage', profileImage)
        
        const uploadResponse = await fetch('/api/upload/profile-image', {
          method: 'POST',
          body: uploadFormData,
        })
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          profileImageUrl = uploadResult.imageUrl
        } else {
          const errorResult = await uploadResponse.json()
          setMessage({type: 'error', text: `Image upload failed: ${errorResult.message}`})
          return
        }
      }
      
      const data = {
        bio: formData.get('bio') as string,
        profileImage: profileImageUrl,
        specialties: (formData.get('specialties') as string || '').split(',').map(s => s.trim()).filter(s => s),
        experience: formData.get('experience') as string,
        qualifications: (formData.get('qualifications') as string || '').split(',').map(q => q.trim()).filter(q => q),
        languages: (formData.get('languages') as string || '').split(',').map(l => l.trim()).filter(l => l),
        website: formData.get('website') as string,
        linkedin: formData.get('linkedin') as string,
        github: formData.get('github') as string,
        portfolio: formData.get('portfolio') as string,
        twitter: formData.get('twitter') as string,
        instagram: formData.get('instagram') as string,
        personalLinks: JSON.parse(formData.get('personalLinks') as string || '[]'),
        teachingMethods: (formData.get('teachingMethods') as string || '').split(',').map(m => m.trim()).filter(m => m)
      }

      const response = await fetch('/api/profile/mentor', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setMentorProfile(data)
        setMessage({type: 'success', text: 'Profile updated successfully!'})
        // Keep editing mode open so user can continue editing
      } else {
        const errorResult = await response.json()
        setMessage({type: 'error', text: `Failed to update profile: ${errorResult.message}`})
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({type: 'error', text: 'An unexpected error occurred. Please try again.'})
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="mt-2 text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {mentorProfile?.profileImage ? (
                        <Image
                          src={mentorProfile.profileImage}
                          alt="Profile"
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                          <UserIcon className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        {session.user?.name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {session.user?.email}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isMentor 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {isMentor ? 'Mentor' : 'Student'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  
                  {message && (
                    <div className={`mb-4 p-4 rounded-md ${
                      message.type === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {message.text}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          defaultValue={session.user?.name || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          defaultValue={session.user?.email || ''}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          disabled={true}
                        />
                      </div>
                    </div>

                    {isMentor && (
                      <>
                        <div>
                          <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700">
                            Profile Photo
                          </label>
                          <input
                            type="file"
                            name="profileImage"
                            id="profileImage"
                            accept="image/*"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            disabled={!isEditing}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Upload a professional profile photo (JPG, PNG, GIF - max 5MB)
                          </p>
                        </div>

                        <div>
                          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            id="bio"
                            rows={4}
                            defaultValue={mentorProfile?.bio || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Tell students about your experience and expertise..."
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                            Experience
                          </label>
                          <input
                            type="text"
                            name="experience"
                            id="experience"
                            defaultValue={mentorProfile?.experience || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., 5+ years in web development"
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
                            Languages (comma-separated)
                          </label>
                          <input
                            type="text"
                            name="languages"
                            id="languages"
                            defaultValue={mentorProfile?.languages?.join(', ') || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., English, Chinese (Mandarin), Korean, Japanese"
                            disabled={!isEditing}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            List the languages you can teach in, separated by commas
                          </p>
                        </div>

                        <div>
                          <label htmlFor="specialties" className="block text-sm font-medium text-gray-700">
                            Specialties (comma-separated)
                          </label>
                          <input
                            type="text"
                            name="specialties"
                            id="specialties"
                            defaultValue={mentorProfile?.specialties?.join(', ') || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., #WebDevelopment, #React, #NodeJS, #Python"
                            disabled={!isEditing}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Use hashtags to describe your skills, separated by commas
                          </p>
                        </div>

                        <div>
                          <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700">
                            Qualifications (comma-separated)
                          </label>
                          <input
                            type="text"
                            name="qualifications"
                            id="qualifications"
                            defaultValue={mentorProfile?.qualifications?.join(', ') || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., Computer Science Degree, AWS Certified, Google Cloud Certified"
                            disabled={!isEditing}
                          />
                        </div>

                        <div>
                          <label htmlFor="teachingMethods" className="block text-sm font-medium text-gray-700">
                            Teaching Methods (comma-separated)
                          </label>
                          <input
                            type="text"
                            name="teachingMethods"
                            id="teachingMethods"
                            defaultValue={mentorProfile?.teachingMethods?.join(', ') || ''}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="e.g., Online Video, Screen Sharing, Code Review, Hands-on Projects"
                            disabled={!isEditing}
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                              Website
                            </label>
                            <input
                              type="url"
                              name="website"
                              id="website"
                              defaultValue={mentorProfile?.website || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://yourwebsite.com"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                              LinkedIn
                            </label>
                            <input
                              type="url"
                              name="linkedin"
                              id="linkedin"
                              defaultValue={mentorProfile?.linkedin || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://linkedin.com/in/yourprofile"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label htmlFor="github" className="block text-sm font-medium text-gray-700">
                              GitHub
                            </label>
                            <input
                              type="url"
                              name="github"
                              id="github"
                              defaultValue={mentorProfile?.github || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://github.com/yourusername"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label htmlFor="portfolio" className="block text-sm font-medium text-gray-700">
                              Portfolio
                            </label>
                            <input
                              type="url"
                              name="portfolio"
                              id="portfolio"
                              defaultValue={mentorProfile?.portfolio || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://yourportfolio.com"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                              X (Twitter)
                            </label>
                            <input
                              type="url"
                              name="twitter"
                              id="twitter"
                              defaultValue={mentorProfile?.twitter || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://x.com/yourusername"
                              disabled={!isEditing}
                            />
                          </div>
                          <div>
                            <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                              Instagram
                            </label>
                            <input
                              type="url"
                              name="instagram"
                              id="instagram"
                              defaultValue={mentorProfile?.instagram || ''}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://instagram.com/yourusername"
                              disabled={!isEditing}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="personalLinks" className="block text-sm font-medium text-gray-700">
                            Personal Links
                          </label>
                          <textarea
                            name="personalLinks"
                            id="personalLinks"
                            rows={4}
                            defaultValue={JSON.stringify(mentorProfile?.personalLinks || [], null, 2)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder='[{&quot;title&quot;: &quot;My Blog&quot;, &quot;url&quot;: &quot;https://myblog.com&quot;}, {&quot;title&quot;: &quot;YouTube Channel&quot;, &quot;url&quot;: &quot;https://youtube.com/@myusername&quot;}]'
                            disabled={!isEditing}
                          />
                          <p className="mt-1 text-sm text-gray-500">
                            Add personal links as JSON array. Format: [&#123;&quot;title&quot;: &quot;Link Name&quot;, &quot;url&quot;: &quot;https://example.com&quot;&#125;]
                          </p>
                        </div>
                      </>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
