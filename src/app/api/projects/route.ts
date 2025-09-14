import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all active projects with mentor information
    const projects = await prisma.project.findMany({
      where: {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Error fetching projects:', error)
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
        { message: 'Only mentors can create projects' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      shortDescription,
      category,
      purposes,
      learningPurpose,
      difficulty,
      duration,
      price,
      maxStudents,
      objectives,
      prerequisites,
      tools,
      deliverables
    } = await request.json()

    // Validate required fields
    if (!title || !description || !category || !difficulty || !duration || !price || !maxStudents) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!purposes || purposes.length === 0) {
      return NextResponse.json(
        { message: 'At least one purpose must be selected' },
        { status: 400 }
      )
    }

    // Create the project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        shortDescription,
        category: category as 'TECHNOLOGY' | 'BUSINESS' | 'DESIGN' | 'ACADEMIC' | 'LANGUAGE' | 'CREATIVE' | 'OTHER',
        purposes: purposes as ('MONETARIZE' | 'LEISURE' | 'CAREER' | 'ACADEMIC')[],
        learningPurpose: learningPurpose as 'MONETARIZE' | 'LEISURE' | 'CAREER' | 'ACADEMIC' | undefined,
        difficulty: difficulty as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        duration: parseInt(duration),
        price: parseFloat(price),
        maxStudents: parseInt(maxStudents),
        objectives: objectives.filter((obj: string) => obj.trim() !== ''),
        prerequisites: prerequisites.filter((prereq: string) => prereq.trim() !== ''),
        tools: tools.filter((tool: string) => tool.trim() !== ''),
        deliverables: deliverables.filter((deliverable: string) => deliverable.trim() !== ''),
        mentorId: user.mentorProfile.id,
        isActive: true, // Projects are active by default, admin can review later
      }
    })

    return NextResponse.json(
      { 
        message: 'Project created successfully', 
        projectId: project.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Project creation error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
