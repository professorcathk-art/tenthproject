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
        { message: 'Mentor profile not found' },
        { status: 404 }
      )
    }

    // Get subscribers for this mentor
    const subscriptions = await prisma.mentorSubscription.findMany({
      where: { 
        mentorId: user.mentorProfile.id,
        isActive: true 
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { subscribedAt: 'desc' }
    })

    const subscribers = subscriptions.map(sub => ({
      id: sub.student.id,
      name: sub.student.name || 'Anonymous',
      email: sub.student.email,
      subscribedAt: sub.subscribedAt.toISOString()
    }))

    return NextResponse.json({ subscribers })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
