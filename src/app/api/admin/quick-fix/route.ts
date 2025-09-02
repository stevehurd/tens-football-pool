import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🚀 Quick fix - adding critical missing teams...')
    
    // Top 10 most critical teams that are definitely missing
    const criticalTeams = [
      { name: 'Pittsburgh Panthers', abbreviation: 'PITT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png', espnId: 221 },
      { name: 'Virginia Tech Hokies', abbreviation: 'VT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png', espnId: 259 },
      { name: 'Baylor Bears', abbreviation: 'BAY', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/239.png', espnId: 239 },
      { name: 'Vanderbilt Commodores', abbreviation: 'VANDY', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png', espnId: 238 },
      { name: 'Iowa Hawkeyes', abbreviation: 'IOWA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png', espnId: 2294 }
    ]
    
    let added = 0
    
    for (const teamData of criticalTeams) {
      try {
        await prisma.team.create({
          data: {
            name: teamData.name,
            abbreviation: teamData.abbreviation,
            league: teamData.league,
            conference: teamData.conference,
            logoUrl: teamData.logoUrl,
            espnId: teamData.espnId,
            wins: 0,
            losses: 0,
            ties: 0
          }
        })
        added++
        console.log(`✅ Added: ${teamData.name}`)
      } catch (error) {
        console.log(`❌ Failed to add: ${teamData.name}`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Quick fix complete - added ${added} critical teams`,
      added
    })
    
  } catch (error) {
    console.error('Quick fix failed:', error)
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