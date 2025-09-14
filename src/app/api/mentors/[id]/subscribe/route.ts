import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Please sign in to subscribe to mentors' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { subscribe } = await request.json()

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify mentor exists
    const mentor = await prisma.mentorProfile.findUnique({
      where: { id }
    })

    if (!mentor) {
      return NextResponse.json(
        { message: 'Mentor not found' },
        { status: 404 }
      )
    }

    if (subscribe) {
      // Subscribe to mentor
      await prisma.mentorSubscription.upsert({
        where: {
          mentorId_studentId: {
            mentorId: id,
            studentId: user.id
          }
        },
        update: {
          isActive: true,
          subscribedAt: new Date()
        },
        create: {
          mentorId: id,
          studentId: user.id,
          isActive: true,
          subscribedAt: new Date()
        }
      })
    } else {
      // Unsubscribe from mentor
      await prisma.mentorSubscription.updateMany({
        where: {
          mentorId: id,
          studentId: user.id
        },
        data: {
          isActive: false
        }
      })
    }

    return NextResponse.json({ 
      message: subscribe ? 'Subscribed successfully' : 'Unsubscribed successfully',
      subscribed: subscribe
    })
  } catch (error) {
    console.error('Error toggling subscription:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
