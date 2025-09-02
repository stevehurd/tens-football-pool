import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Starting selection migration...')
    
    // Manually recreate the selections that we know worked locally
    const selections = [
      // Al's NFL picks
      { participant: 'Al', team: 'Cincinnati Bengals', league: 'NFL', pickNumber: 1 },
      { participant: 'Al', team: 'Baltimore Ravens', league: 'NFL', pickNumber: 2 },
      
      // Bocklet's NFL picks  
      { participant: 'Bocklet', team: 'Pittsburgh Steelers', league: 'NFL', pickNumber: 1 },
      { participant: 'Bocklet', team: 'Washington Commanders', league: 'NFL', pickNumber: 7 },
      
      // Brian's NFL picks
      { participant: 'Brian', team: 'Green Bay Packers', league: 'NFL', pickNumber: 3 },
      { participant: 'Brian', team: 'Jacksonville Jaguars', league: 'NFL', pickNumber: 4 },
      
      // Daryl's NFL picks
      { participant: 'Daryl', team: 'Detroit Lions', league: 'NFL', pickNumber: 2 },
      { participant: 'Daryl', team: 'Seattle Seahawks', league: 'NFL', pickNumber: 4 },
      
      // Goody's NFL picks
      { participant: 'Goody', team: 'Philadelphia Eagles', league: 'NFL', pickNumber: 1 },
      { participant: 'Goody', team: 'New York Giants', league: 'NFL', pickNumber: 8 },
      
      // KOB's NFL picks
      { participant: 'KOB', team: 'Kansas City Chiefs', league: 'NFL', pickNumber: 1 },
      { participant: 'KOB', team: 'Las Vegas Raiders', league: 'NFL', pickNumber: 6 },
      
      // Kenny's NFL picks
      { participant: 'Kenny', team: 'Los Angeles Chargers', league: 'NFL', pickNumber: 1 },
      { participant: 'Kenny', team: 'Miami Dolphins', league: 'NFL', pickNumber: 3 },
      
      // Knowles's NFL picks
      { participant: 'Knowles', team: 'Dallas Cowboys', league: 'NFL', pickNumber: 3 },
      { participant: 'Knowles', team: 'Carolina Panthers', league: 'NFL', pickNumber: 9 },
      
      // Mario's NFL picks
      { participant: 'Mario', team: 'Houston Texans', league: 'NFL', pickNumber: 1 },
      { participant: 'Mario', team: 'Chicago Bears', league: 'NFL', pickNumber: 2 },
      
      // Marty's NFL picks
      { participant: 'Marty', team: 'Buffalo Bills', league: 'NFL', pickNumber: 1 },
      { participant: 'Marty', team: 'Atlanta Falcons', league: 'NFL', pickNumber: 2 },
      
      // Petrucci's NFL picks
      { participant: 'Petrucci', team: 'New England Patriots', league: 'NFL', pickNumber: 2 },
      { participant: 'Petrucci', team: 'Denver Broncos', league: 'NFL', pickNumber: 6 },
      
      // Reilly's NFL picks
      { participant: 'Reilly', team: 'Tampa Bay Buccaneers', league: 'NFL', pickNumber: 1 },
      { participant: 'Reilly', team: 'Arizona Cardinals', league: 'NFL', pickNumber: 5 },
      
      // Scotty's NFL picks
      { participant: 'Scotty', team: 'New York Jets', league: 'NFL', pickNumber: 1 },
      { participant: 'Scotty', team: 'Indianapolis Colts', league: 'NFL', pickNumber: 4 },
      
      // Steamer's NFL picks
      { participant: 'Steamer', team: 'Minnesota Vikings', league: 'NFL', pickNumber: 1 },
      { participant: 'Steamer', team: 'Tennessee Titans', league: 'NFL', pickNumber: 7 },
      
      // Steve's NFL picks
      { participant: 'Steve', team: 'San Francisco 49ers', league: 'NFL', pickNumber: 1 },
      { participant: 'Steve', team: 'Los Angeles Rams', league: 'NFL', pickNumber: 3 },
    ]
    
    let migratedCount = 0
    
    for (const selection of selections) {
      // Find participant
      const participant = await prisma.participant.findFirst({
        where: { name: selection.participant }
      })
      
      if (!participant) {
        console.log(`Participant not found: ${selection.participant}`)
        continue
      }
      
      // Find team
      const team = await prisma.team.findFirst({
        where: { 
          name: selection.team,
          league: selection.league 
        }
      })
      
      if (!team) {
        console.log(`Team not found: ${selection.team}`)
        continue
      }
      
      // Create selection
      try {
        await prisma.selection.create({
          data: {
            participantId: participant.id,
            teamId: team.id,
            selectionType: selection.league,
            pickNumber: selection.pickNumber
          }
        })
        migratedCount++
        console.log(`✅ Migrated: ${selection.participant} -> ${selection.team}`)
      } catch (error) {
        console.log(`❌ Failed: ${selection.participant} -> ${selection.team}`, error)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} NFL selections`,
      migrated: migratedCount,
      total: selections.length
    })
    
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Also support GET for testing
export async function GET() {
  return POST()
}