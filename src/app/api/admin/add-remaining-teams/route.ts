import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔧 Adding remaining college teams...')
    
    const remainingTeams = [
      // Teams still failing in complete restore
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
      { name: 'Steamer Notre Dame Fighting Irish', abbreviation: 'ND', league: 'COLLEGE', conference: 'Independent', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png', espnId: 87 },
      { name: 'TCU Horned Frogs', abbreviation: 'TCU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png', espnId: 2628 },
      { name: 'Iowa State Cyclones', abbreviation: 'ISU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png', espnId: 66 },
      { name: 'West Virginia Mountaineers', abbreviation: 'WVU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png', espnId: 277 },
      { name: 'Kentucky Wildcats', abbreviation: 'UK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', espnId: 96 },
      { name: 'UCLA Bruins', abbreviation: 'UCLA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', espnId: 26 },
      { name: 'Boston College Eagles', abbreviation: 'BC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png', espnId: 103 },
      { name: 'Indiana Hoosiers', abbreviation: 'IU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png', espnId: 84 },
      { name: 'North Carolina Tar Heels', abbreviation: 'UNC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', espnId: 153 },
      { name: 'NC State Wolfpack', abbreviation: 'NCST', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/152.png', espnId: 152 },
      { name: 'Arizona Wildcats', abbreviation: 'ARIZ', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/12.png', espnId: 12 }
    ]
    
    let added = 0
    const errors = []
    
    for (const teamData of remainingTeams) {
      try {
        // Check if team already exists
        const existing = await prisma.team.findFirst({
          where: {
            name: teamData.name,
            league: teamData.league
          }
        })
        
        if (!existing) {
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
        }
      } catch (error) {
        console.log(`❌ Failed to add: ${teamData.name}`, error)
        errors.push(`${teamData.name}: ${error}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Added ${added} remaining college teams`,
      added,
      total: remainingTeams.length,
      errors: errors.slice(0, 5)
    })
    
  } catch (error) {
    console.error('Failed to add remaining teams:', error)
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