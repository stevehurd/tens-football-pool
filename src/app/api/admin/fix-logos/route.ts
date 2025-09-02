import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔧 Fixing team logos...')
    
    // Get all teams without logos
    const teamsWithoutLogos = await prisma.team.findMany({
      where: {
        logoUrl: null
      }
    })
    
    console.log(`Found ${teamsWithoutLogos.length} teams without logos`)
    
    let fixedCount = 0
    
    for (const team of teamsWithoutLogos) {
      let logoUrl = null
      
      if (team.league === 'NFL') {
        // NFL logos: Use team abbreviation
        const abbr = team.abbreviation?.toLowerCase()
        if (abbr) {
          logoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${abbr}.png`
        }
      } else if (team.league === 'COLLEGE' && team.espnId) {
        // College logos: Use ESPN ID
        logoUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.espnId}.png`
      }
      
      if (logoUrl) {
        try {
          await prisma.team.update({
            where: { id: team.id },
            data: { logoUrl }
          })
          fixedCount++
          console.log(`✅ Fixed logo for ${team.name}: ${logoUrl}`)
        } catch (error) {
          console.log(`❌ Failed to fix ${team.name}: ${error}`)
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Fixed logos for ${fixedCount} teams`,
      fixed: fixedCount,
      total: teamsWithoutLogos.length
    })
    
  } catch (error) {
    console.error('Logo fix failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}