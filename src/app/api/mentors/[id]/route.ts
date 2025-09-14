import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: mentorId } = await params

    // Get mentor with their projects
    const mentor = await prisma.mentorProfile.findUnique({
      where: {
        id: mentorId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        projects: {
          where: {
            isActive: true
          },
          include: {
            reviews: {
              select: {
                rating: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!mentor) {
      return NextResponse.json(
        { message: 'Mentor not found' },
        { status: 404 }
      )
    }

    // Transform projects data
    const transformedProjects = mentor.projects.map(project => {
      const avgRating = project.reviews.length > 0 
        ? project.reviews.reduce((sum, review) => sum + review.rating, 0) / project.reviews.length
        : 0

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        category: project.category,
        difficulty: project.difficulty,
        duration: project.duration,
        price: project.price,
        rating: avgRating,
        totalReviews: project.reviews.length
      }
    })

    // Transform mentor data
    const transformedMentor = {
      id: mentor.id,
      user: mentor.user,
      bio: mentor.bio || 'No bio available',
      specialties: mentor.specialties,
      experience: mentor.experience || 'Experience not specified',
      qualifications: mentor.qualifications,
      languages: mentor.languages,
      isVerified: mentor.isVerified,
      rating: mentor.rating,
      totalReviews: mentor.totalReviews,
      website: mentor.website,
      linkedin: mentor.linkedin,
      github: mentor.github,
      twitter: mentor.twitter,
      instagram: mentor.instagram,
      personalLinks: mentor.personalLinks,
      portfolio: mentor.portfolio,
      teachingMethods: mentor.teachingMethods
    }

    return NextResponse.json({ 
      mentor: transformedMentor,
      projects: transformedProjects,
      isWishlisted: false // TODO: Check if current user has this mentor in wishlist
    })
  } catch (error) {
    console.error('Error fetching mentor:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
