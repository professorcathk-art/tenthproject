import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Please sign in to access this page' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { mentorProfile: true }
    })

    if (!user || !user.mentorProfile) {
      return NextResponse.json(
        { message: 'Mentor profile not found' },
        { status: 404 }
      )
    }

    // Get all projects for this mentor with enrollments
    const projects = await prisma.project.findMany({
      where: { mentorId: user.mentorProfile.id },
      include: {
        enrollments: {
          include: {
            student: {
              select: {
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      category: project.category,
      difficulty: project.difficulty,
      duration: project.duration,
      price: project.price,
      learningPurpose: project.learningPurpose,
      isActive: project.isActive,
      currentStudents: project.currentStudents,
      maxStudents: project.maxStudents,
      createdAt: project.createdAt.toISOString(),
      enrollments: project.enrollments.map(enrollment => ({
        id: enrollment.id,
        student: enrollment.student,
        enrolledAt: enrollment.enrolledAt.toISOString()
      }))
    }))

    return NextResponse.json({ projects: transformedProjects })
  } catch (error) {
    console.error('Error fetching mentor projects:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
