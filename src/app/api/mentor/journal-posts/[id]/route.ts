import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: postId } = await params

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

    // Check if the post belongs to this mentor
    const post = await prisma.journalPost.findFirst({
      where: { 
        id: postId,
        mentorId: user.mentorProfile.id 
      }
    })

    if (!post) {
      return NextResponse.json(
        { message: 'Post not found' },
        { status: 404 }
      )
    }

    // Delete the post
    await prisma.journalPost.delete({
      where: { id: postId }
    })

    return NextResponse.json({ 
      message: 'Post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting journal post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
