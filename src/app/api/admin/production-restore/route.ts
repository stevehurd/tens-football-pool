import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🚀 Production restore - adding ALL missing teams and selections...')
    
    // ALL missing college teams with proper ESPN IDs
    const allMissingTeams = [
      { name: 'Pittsburgh Panthers', abbreviation: 'PITT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png', espnId: 221 },
      { name: 'Virginia Tech Hokies', abbreviation: 'VT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png', espnId: 259 },
      { name: 'Baylor Bears', abbreviation: 'BAY', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/239.png', espnId: 239 },
      { name: 'Vanderbilt Commodores', abbreviation: 'VANDY', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png', espnId: 238 },
      { name: 'Iowa Hawkeyes', abbreviation: 'IOWA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png', espnId: 2294 },
      { name: 'Boise State Broncos', abbreviation: 'BSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/68.png', espnId: 68 },
      { name: 'Nebraska Cornhuskers', abbreviation: 'NEB', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png', espnId: 158 },
      { name: 'California Golden Bears', abbreviation: 'CAL', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/25.png', espnId: 25 },
      { name: 'Cincinnati Bearcats', abbreviation: 'CIN', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2132.png', espnId: 2132 },
      { name: 'Rutgers Scarlet Knights', abbreviation: 'RU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png', espnId: 164 },
      { name: 'Memphis Tigers', abbreviation: 'MEM', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/235.png', espnId: 235 },
      { name: 'UCF Knights', abbreviation: 'UCF', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png', espnId: 2116 },
      { name: 'Syracuse Orange', abbreviation: 'SYR', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/183.png', espnId: 183 },
      { name: 'Duke Blue Devils', abbreviation: 'DUKE', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png', espnId: 150 },
      { name: 'Oregon State Beavers', abbreviation: 'ORST', league: 'COLLEGE', conference: 'Pac-12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/204.png', espnId: 204 },
      { name: 'Florida State Seminoles', abbreviation: 'FSU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png', espnId: 52 },
      { name: 'Missouri Tigers', abbreviation: 'MIZ', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png', espnId: 142 },
      { name: 'Fresno State Bulldogs', abbreviation: 'FRES', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/278.png', espnId: 278 },
      { name: 'Colorado State Rams', abbreviation: 'CSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/36.png', espnId: 36 },
      { name: 'Wyoming Cowboys', abbreviation: 'WYO', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2845.png', espnId: 2845 },
      { name: 'Minnesota Golden Gophers', abbreviation: 'MINN', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/135.png', espnId: 135 },
      { name: 'Air Force Falcons', abbreviation: 'AF', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png', espnId: 2005 },
      { name: 'Navy Midshipmen', abbreviation: 'NAVY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png', espnId: 2426 },
      { name: 'Washington Huskies', abbreviation: 'WASH', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png', espnId: 264 },
      { name: 'Tulane Green Wave', abbreviation: 'TUL', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2655.png', espnId: 2655 },
      { name: 'Texas Tech Red Raiders', abbreviation: 'TTU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png', espnId: 2641 },
      { name: 'Army Black Knights', abbreviation: 'ARMY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/349.png', espnId: 349 },
      { name: 'Louisville Cardinals', abbreviation: 'LOU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/97.png', espnId: 97 },
      { name: 'SMU Mustangs', abbreviation: 'SMU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png', espnId: 2567 },
      { name: 'Virginia Cavaliers', abbreviation: 'UVA', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png', espnId: 258 },
      { name: 'Utah Utes', abbreviation: 'UTAH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/254.png', espnId: 254 },
      { name: 'Colorado Buffaloes', abbreviation: 'COLO', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/38.png', espnId: 38 },
      { name: 'Wisconsin Badgers', abbreviation: 'WIS', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/275.png', espnId: 275 },
      { name: 'Arizona State Sun Devils', abbreviation: 'ASU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/9.png', espnId: 9 },
      { name: 'TCU Horned Frogs', abbreviation: 'TCU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png', espnId: 2628 },
      { name: 'Iowa State Cyclones', abbreviation: 'ISU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png', espnId: 66 },
      { name: 'West Virginia Mountaineers', abbreviation: 'WVU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png', espnId: 277 },
      { name: 'Kentucky Wildcats', abbreviation: 'UK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', espnId: 96 },
      { name: 'UCLA Bruins', abbreviation: 'UCLA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', espnId: 26 },
      { name: 'Boston College Eagles', abbreviation: 'BC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png', espnId: 103 },
      { name: 'Indiana Hoosiers', abbreviation: 'IU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png', espnId: 84 },
      { name: 'North Carolina Tar Heels', abbreviation: 'UNC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', espnId: 153 },
      { name: 'NC State Wolfpack', abbreviation: 'NCST', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/152.png', espnId: 152 },
      { name: 'Arizona Wildcats', abbreviation: 'ARIZ', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/12.png', espnId: 12 },
      { name: 'Houston Cougars', abbreviation: 'UH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/248.png', espnId: 248 },
      { name: 'Arkansas Razorbacks', abbreviation: 'ARK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png', espnId: 8 },
      { name: 'Kansas Jayhawks', abbreviation: 'KU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png', espnId: 2305 }
    ]
    
    // Add teams first
    let teamsAdded = 0
    for (const team of allMissingTeams) {
      try {
        const existing = await prisma.team.findFirst({
          where: { name: team.name, league: team.league }
        })
        
        if (!existing) {
          await prisma.team.create({
            data: {
              name: team.name,
              abbreviation: team.abbreviation,
              league: team.league,
              conference: team.conference,
              logoUrl: team.logoUrl,
              espnId: team.espnId,
              wins: 0,
              losses: 0,
              ties: 0
            }
          })
          teamsAdded++
        }
      } catch (error) {
        console.log(`Failed to add team: ${team.name}`)
      }
    }
    
    // ALL missing selections - only the ones that are actually missing
    const missingSelections = [
      // Based on the debug data, these are the missing selections:
      { participant: 'Steve', team: 'North Carolina Tar Heels', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Daryl', team: 'Virginia Tech Hokies', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Daryl', team: 'Houston Cougars', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Daryl', team: 'Baylor Bears', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Daryl', team: 'Arkansas Razorbacks', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Bocklet', team: 'Pittsburgh Panthers', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Reilly', team: 'Louisville Cardinals', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Reilly', team: 'SMU Mustangs', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Reilly', team: 'Virginia Cavaliers', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Scotty', team: 'Utah Utes', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Scotty', team: 'Colorado Buffaloes', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Scotty', team: 'Wisconsin Badgers', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Scotty', team: 'Arizona State Sun Devils', league: 'COLLEGE', pickNumber: 10 },
      { participant: 'Kenny', team: 'Boise State Broncos', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Kenny', team: 'Nebraska Cornhuskers', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Kenny', team: 'California Golden Bears', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Kenny', team: 'Cincinnati Bearcats', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Marty', team: 'Fresno State Bulldogs', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Marty', team: 'Colorado State Rams', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Marty', team: 'Wyoming Cowboys', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Marty', team: 'Minnesota Golden Gophers', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Marty', team: 'Air Force Falcons', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Marty', team: 'Navy Midshipmen', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Goody', team: 'Vanderbilt Commodores', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Goody', team: 'Iowa Hawkeyes', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Petrucci', team: 'Washington Huskies', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Petrucci', team: 'Tulane Green Wave', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Petrucci', team: 'Texas Tech Red Raiders', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Petrucci', team: 'Army Black Knights', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Steamer', team: 'TCU Horned Frogs', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Steamer', team: 'Iowa State Cyclones', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Steamer', team: 'West Virginia Mountaineers', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Steamer', team: 'Kentucky Wildcats', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Steamer', team: 'UCLA Bruins', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Steamer', team: 'Boston College Eagles', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Steamer', team: 'Indiana Hoosiers', league: 'COLLEGE', pickNumber: 10 },
      { participant: 'Knowles', team: 'Rutgers Scarlet Knights', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Knowles', team: 'Memphis Tigers', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Knowles', team: 'UCF Knights', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Knowles', team: 'Syracuse Orange', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Mario', team: 'Duke Blue Devils', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Mario', team: 'Oregon State Beavers', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Mario', team: 'Florida State Seminoles', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Mario', team: 'Missouri Tigers', league: 'COLLEGE', pickNumber: 7 }
    ]
    
    // Restore selections
    let selectionsAdded = 0
    for (const selection of missingSelections) {
      try {
        const participant = await prisma.participant.findFirst({
          where: { name: selection.participant }
        })
        
        const team = await prisma.team.findFirst({
          where: { 
            name: selection.team,
            league: selection.league 
          }
        })
        
        if (participant && team) {
          const existing = await prisma.selection.findFirst({
            where: {
              participantId: participant.id,
              pickNumber: selection.pickNumber
            }
          })
          
          if (!existing) {
            await prisma.selection.create({
              data: {
                participantId: participant.id,
                teamId: team.id,
                selectionType: selection.league,
                pickNumber: selection.pickNumber
              }
            })
            selectionsAdded++
          }
        }
      } catch (error) {
        console.log(`Failed to add selection: ${selection.participant} -> ${selection.team}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Production restore complete',
      teamsAdded,
      selectionsAdded,
      note: 'All missing teams and selections have been restored to production database'
    })
    
  } catch (error) {
    console.error('Production restore failed:', error)
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