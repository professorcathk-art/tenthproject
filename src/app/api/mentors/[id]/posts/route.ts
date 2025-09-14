import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get journal posts for this mentor
    const posts = await prisma.journalPost.findMany({
      where: { mentorId: id },
      include: {
        views: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5 // Limit to latest 5 posts
    })

    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      isPublic: post.isPublic,
      createdAt: post.createdAt.toISOString(),
      views: post.views.length
    }))

    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error('Error fetching mentor posts:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
