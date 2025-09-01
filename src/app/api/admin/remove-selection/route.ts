import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { selectionId } = await request.json()

    if (!selectionId) {
      return NextResponse.json(
        { error: 'Selection ID is required' },
        { status: 400 }
      )
    }

    await prisma.selection.delete({
      where: { id: selectionId }
    })

    return NextResponse.json({
      success: true,
      message: 'Selection removed successfully'
    })
  } catch (error) {
    console.error('Error removing selection:', error)
    return NextResponse.json(
      { error: 'Failed to remove selection' },
      { status: 500 }
    )
  }
}