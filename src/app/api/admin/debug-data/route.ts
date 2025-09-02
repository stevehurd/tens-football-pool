import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all participants with their selections
    const participants = await prisma.participant.findMany({
      include: {
        selections: {
          include: {
            team: true
          }
        }
      }
    })
    
    // Get all teams to see what's available
    const allTeams = await prisma.team.findMany({
      select: {
        id: true,
        name: true,
        league: true,
        logoUrl: true,
        espnId: true,
        wins: true,
        losses: true
      }
    })
    
    // Group teams by league
    const nflTeams = allTeams.filter(t => t.league === 'NFL')
    const collegeTeams = allTeams.filter(t => t.league === 'COLLEGE')
    
    const report = {
      participants: participants.map(p => ({
        name: p.name,
        totalSelections: p.selections.length,
        nflSelections: p.selections.filter(s => s.selectionType === 'NFL').length,
        collegeSelections: p.selections.filter(s => s.selectionType === 'COLLEGE').length,
        selections: p.selections.map(s => ({
          pickNumber: s.pickNumber,
          type: s.selectionType,
          teamName: s.team.name,
          hasLogo: !!s.team.logoUrl,
          logoUrl: s.team.logoUrl,
          record: `${s.team.wins}-${s.team.losses}`
        }))
      })),
      teamCounts: {
        totalTeams: allTeams.length,
        nflTeams: nflTeams.length,
        collegeTeams: collegeTeams.length,
        teamsWithLogos: allTeams.filter(t => t.logoUrl).length,
        teamsWithoutLogos: allTeams.filter(t => !t.logoUrl).length,
        teamsWithEspnId: allTeams.filter(t => t.espnId).length
      },
      sampleTeams: {
        nflWithLogos: nflTeams.filter(t => t.logoUrl).slice(0, 3),
        nflWithoutLogos: nflTeams.filter(t => !t.logoUrl).slice(0, 3),
        collegeWithLogos: collegeTeams.filter(t => t.logoUrl).slice(0, 3),
        collegeWithoutLogos: collegeTeams.filter(t => !t.logoUrl).slice(0, 3)
      }
    }
    
    return NextResponse.json(report, { status: 200 })
    
  } catch (error) {
    console.error('Debug failed:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}