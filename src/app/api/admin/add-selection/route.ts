import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { participantId, teamId, pickNumber, selectionType } = await request.json()

    if (!participantId || !teamId || !pickNumber || !selectionType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if participant already has this team
    const existingTeamSelection = await prisma.selection.findFirst({
      where: { participantId, teamId },
    })

    if (existingTeamSelection) {
      return NextResponse.json(
        { error: 'Team already selected by this participant' },
        { status: 400 }
      )
    }

    // Check if participant already has this pick number
    const existingPickSelection = await prisma.selection.findFirst({
      where: { participantId, pickNumber },
    })

    if (existingPickSelection) {
      return NextResponse.json(
        { error: 'Pick number already used by this participant' },
        { status: 400 }
      )
    }

    // Check selection type limits
    const currentSelections = await prisma.selection.findMany({
      where: { participantId },
    })

    const nflCount = currentSelections.filter(s => s.selectionType === 'NFL').length
    const collegeCount = currentSelections.filter(s => s.selectionType === 'COLLEGE').length

    if (selectionType === 'NFL' && nflCount >= 2) {
      return NextResponse.json(
        { error: 'Participant already has 2 NFL teams' },
        { status: 400 }
      )
    }

    if (selectionType === 'COLLEGE' && collegeCount >= 8) {
      return NextResponse.json(
        { error: 'Participant already has 8 college teams' },
        { status: 400 }
      )
    }

    // Create the selection
    const selection = await prisma.selection.create({
      data: {
        participantId,
        teamId,
        selectionType,
        pickNumber,
      },
      include: { team: true },
    })
    
    return NextResponse.json({
      success: true,
      selection,
      message: 'Selection added successfully'
    })
  } catch (error) {
    console.error('Error adding selection:', error)
    return NextResponse.json(
      { error: 'Failed to add selection' },
      { status: 500 }
    )
  }
}