import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      contactEmail,
      contactName,
      comment
    } = await request.json()

    // Validate required fields
    if (!name || !contactEmail) {
      return NextResponse.json(
        { message: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Create the category suggestion
    const suggestion = await prisma.categorySuggestion.create({
      data: {
        name,
        description,
        contactEmail,
        contactName,
        comment,
        status: 'PENDING'
      }
    })

    return NextResponse.json(
      { 
        message: 'Category suggestion submitted successfully',
        suggestionId: suggestion.id 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error submitting category suggestion:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
