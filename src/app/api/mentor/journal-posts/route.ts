import { NextRequest, NextResponse } from 'next/server'
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

    // Get journal posts for this mentor
    const posts = await prisma.journalPost.findMany({
      where: { mentorId: user.mentorProfile.id },
      include: {
        views: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      isPublic: post.isPublic,
      attachments: post.attachments,
      createdAt: post.createdAt.toISOString(),
      views: post.views.length
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error('Error fetching journal posts:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { title, content, excerpt, isPublic, attachments } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { message: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Create journal post
    const post = await prisma.journalPost.create({
      data: {
        mentorId: user.mentorProfile.id,
        title,
        content,
        excerpt: excerpt || null,
        isPublic: isPublic || false,
        attachments: attachments || null
      }
    })

    return NextResponse.json({ 
      message: 'Post created successfully',
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        isPublic: post.isPublic,
        attachments: post.attachments,
        createdAt: post.createdAt.toISOString(),
        views: 0
      }
    })
  } catch (error) {
    console.error('Error creating journal post:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
