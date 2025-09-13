import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all mentors with active projects
    const mentors = await prisma.mentorProfile.findMany({
      where: {
        projects: {
          some: {
            isActive: true
          }
        }
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
          select: {
            id: true
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })

    // Transform the data to include calculated fields
    const transformedMentors = mentors.map(mentor => {
      const projectsCount = mentor.projects.length
      const avgRating = mentor.reviews.length > 0 
        ? mentor.reviews.reduce((sum, review) => sum + review.rating, 0) / mentor.reviews.length
        : 0

      return {
        id: mentor.id,
        user: mentor.user,
        bio: mentor.bio,
        specialties: mentor.specialties,
        experience: mentor.experience,
        rating: avgRating,
        totalReviews: mentor.reviews.length,
        isVerified: mentor.isVerified,
        languages: mentor.languages,
        hourlyRate: mentor.hourlyRate,
        totalStudents: mentor.totalReviews, // Using totalReviews as proxy for total students
        projectsCount
      }
    })

    return NextResponse.json({ mentors: transformedMentors })
  } catch (error) {
    console.error('Error fetching mentors:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
