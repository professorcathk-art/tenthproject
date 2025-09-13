import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Admin access required' },
        { status: 403 }
      )
    }

    // Get all mentors with their projects and earnings
    const mentors = await prisma.mentorProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        projects: {
          select: {
            id: true,
            isActive: true,
            price: true,
            enrollments: {
              where: {
                status: 'CONFIRMED'
              },
              select: {
                amount: true
              }
            }
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    })

    // Transform the data to include calculated fields
    const transformedMentors = mentors.map(mentor => {
      const activeProjectsCount = mentor.projects.filter(p => p.isActive).length
      const totalEarnings = mentor.projects.reduce((total, project) => {
        const projectEarnings = project.enrollments.reduce((sum, enrollment) => sum + enrollment.amount, 0)
        return total + projectEarnings
      }, 0)

      return {
        id: mentor.id,
        user: mentor.user,
        bio: mentor.bio,
        specialties: mentor.specialties,
        rating: mentor.rating,
        totalReviews: mentor.totalReviews,
        hourlyRate: mentor.hourlyRate,
        projectsCount: activeProjectsCount,
        totalEarnings: totalEarnings,
        isVerified: mentor.isVerified
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
