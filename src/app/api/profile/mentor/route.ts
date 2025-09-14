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

    const profile = {
      bio: user.mentorProfile.bio,
      specialties: user.mentorProfile.specialties,
      experience: user.mentorProfile.experience,
      qualifications: user.mentorProfile.qualifications,
      languages: user.mentorProfile.languages,
      website: user.mentorProfile.website,
      linkedin: user.mentorProfile.linkedin,
      github: user.mentorProfile.github,
      portfolio: user.mentorProfile.portfolio,
      teachingMethods: user.mentorProfile.teachingMethods
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Error fetching mentor profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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

    const {
      bio,
      specialties,
      experience,
      qualifications,
      languages,
      website,
      linkedin,
      github,
      portfolio,
      teachingMethods
    } = await request.json()

    // Update the mentor profile
    const updatedProfile = await prisma.mentorProfile.update({
      where: { id: user.mentorProfile.id },
      data: {
        bio: bio || null,
        specialties: specialties || [],
        experience: experience || null,
        qualifications: qualifications || [],
        languages: languages || [],
        website: website || null,
        linkedin: linkedin || null,
        github: github || null,
        portfolio: portfolio || null,
        teachingMethods: teachingMethods || []
      }
    })

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: {
        bio: updatedProfile.bio,
        specialties: updatedProfile.specialties,
        experience: updatedProfile.experience,
        qualifications: updatedProfile.qualifications,
        languages: updatedProfile.languages,
        website: updatedProfile.website,
        linkedin: updatedProfile.linkedin,
        github: updatedProfile.github,
        portfolio: updatedProfile.portfolio,
        teachingMethods: updatedProfile.teachingMethods
      }
    })
  } catch (error) {
    console.error('Error updating mentor profile:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
