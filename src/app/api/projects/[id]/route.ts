import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params

    // Get project with mentor information
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isActive: true
      },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    // Calculate average rating
    const avgRating = project.reviews.length > 0 
      ? project.reviews.reduce((sum, review) => sum + review.rating, 0) / project.reviews.length
      : 0

    // Transform the data to match the frontend interface
    const transformedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      shortDescription: project.shortDescription || '',
      category: project.category,
      difficulty: project.difficulty,
      duration: project.duration,
      price: project.price,
      currency: project.currency,
      objectives: project.objectives,
      prerequisites: project.prerequisites,
      tools: project.tools,
      deliverables: project.deliverables,
      mentor: {
        name: project.mentor.user.name || 'Anonymous',
        bio: project.mentor.bio || 'No bio available',
        rating: project.mentor.rating || 4.5,
        totalReviews: project.mentor.totalReviews || 0,
        specialties: project.mentor.specialties,
        experience: project.mentor.experience || 'Experience not specified',
        isVerified: project.mentor.isVerified
      },
      rating: avgRating,
      totalReviews: project.reviews.length,
      maxStudents: project.maxStudents,
      currentStudents: project.currentStudents
    }

    return NextResponse.json({ project: transformedProject })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
