import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { participantId } = await request.json()

    if (!participantId) {
      return NextResponse.json(
        { error: 'Participant ID is required' },
        { status: 400 }
      )
    }

    const result = await prisma.selection.deleteMany({
      where: { participantId }
    })

    return NextResponse.json({
      success: true,
      message: `Cleared ${result.count} selections`
    })
  } catch (error) {
    console.error('Error clearing selections:', error)
    return NextResponse.json(
      { error: 'Failed to clear selections' },
      { status: 500 }
    )
  }
}