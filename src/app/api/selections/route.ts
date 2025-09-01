import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const participantId = searchParams.get('participantId')

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    const selections = await prisma.selection.findMany({
      where: { participantId },
      include: { team: true },
      orderBy: { pickNumber: 'asc' },
    })
    
    return NextResponse.json(selections)
  } catch (error) {
    console.error('Error fetching selections:', error)
    return NextResponse.json(
      { error: 'Failed to fetch selections' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { participantId, teamId, selectionType, pickNumber } = body

    if (!participantId || !teamId || !selectionType || !pickNumber) {
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
        { error: 'Team already selected' },
        { status: 400 }
      )
    }

    // Check if participant already has this pick number
    const existingPickSelection = await prisma.selection.findFirst({
      where: { participantId, pickNumber },
    })

    if (existingPickSelection) {
      return NextResponse.json(
        { error: 'Pick number already used' },
        { status: 400 }
      )
    }

    // Count current selections by type
    const currentSelections = await prisma.selection.findMany({
      where: { participantId },
      include: { team: true },
    })

    const nflCount = currentSelections.filter(s => s.selectionType === 'NFL').length
    const collegeCount = currentSelections.filter(s => s.selectionType === 'COLLEGE').length

    // Validate selection limits
    if (selectionType === 'NFL' && nflCount >= 2) {
      return NextResponse.json(
        { error: 'Cannot select more than 2 NFL teams' },
        { status: 400 }
      )
    }

    if (selectionType === 'COLLEGE' && collegeCount >= 8) {
      return NextResponse.json(
        { error: 'Cannot select more than 8 college teams' },
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
    
    return NextResponse.json(selection)
  } catch (error) {
    console.error('Error creating selection:', error)
    return NextResponse.json(
      { error: 'Failed to create selection' },
      { status: 500 }
    )
  }
}