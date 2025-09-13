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

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { mentorProfile: true }
    })

    if (!user || !user.mentorProfile) {
      return NextResponse.json(
        { message: 'Only mentors can view students' },
        { status: 403 }
      )
    }

    // Get all students enrolled in this mentor's projects
    const enrollments = await prisma.enrollment.findMany({
      where: {
        project: {
          mentorId: user.mentorProfile.id
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    })

    // Group enrollments by student
    const studentsMap = new Map()
    
    enrollments.forEach(enrollment => {
      const studentId = enrollment.student.id
      
      if (!studentsMap.has(studentId)) {
        studentsMap.set(studentId, {
          id: enrollment.student.id,
          name: enrollment.student.name,
          email: enrollment.student.email,
          enrollments: []
        })
      }
      
      studentsMap.get(studentId).enrollments.push({
        id: enrollment.id,
        status: enrollment.status,
        progress: enrollment.progress,
        enrolledAt: enrollment.enrolledAt.toISOString(),
        project: enrollment.project
      })
    })

    const students = Array.from(studentsMap.values())

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
