import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔧 Adding missing college teams...')
    
    const missingTeams = [
      // Teams that failed in the complete restore
      { name: 'Maryland Terrapins', abbreviation: 'MD', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/120.png', espnId: 120 },
      { name: 'Wake Forest Demon Deacons', abbreviation: 'WAKE', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/154.png', espnId: 154 },
      { name: 'Marshall Thundering Herd', abbreviation: 'MARSHALL', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/276.png', espnId: 276 },
      { name: 'Illinois Fighting Illini', abbreviation: 'ILL', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/356.png', espnId: 356 },
      { name: 'Western Michigan Broncos', abbreviation: 'WMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2711.png', espnId: 2711 },
      { name: 'Middle Tennessee Blue Raiders', abbreviation: 'MTSU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2393.png', espnId: 2393 },
      { name: 'James Madison Dukes', abbreviation: 'JMU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/256.png', espnId: 256 },
      { name: 'Miami RedHawks', abbreviation: 'MIAMI', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/193.png', espnId: 193 },
      { name: 'Liberty Flames', abbreviation: 'LIB', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2335.png', espnId: 2335 },
      { name: 'UNLV Rebels', abbreviation: 'UNLV', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2439.png', espnId: 2439 },
      { name: 'Southern Miss Golden Eagles', abbreviation: 'USM', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2624.png', espnId: 2624 },
      { name: 'Missouri State Bears', abbreviation: 'MOST', league: 'COLLEGE', conference: 'Missouri Valley', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png', espnId: 2623 },
      { name: 'Appalachian State Mountaineers', abbreviation: 'APP', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2026.png', espnId: 2026 },
      { name: 'Ball State Cardinals', abbreviation: 'BALL', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2050.png', espnId: 2050 },
      { name: 'Northwestern Wildcats', abbreviation: 'NW', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/77.png', espnId: 77 },
      { name: 'Old Dominion Monarchs', abbreviation: 'ODU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/295.png', espnId: 295 },
      { name: 'Jacksonville State Gamecocks', abbreviation: 'JVST', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/55.png', espnId: 55 },
      { name: 'Washington State Cougars', abbreviation: 'WSU', league: 'COLLEGE', conference: 'Pac-12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/265.png', espnId: 265 },
      { name: 'South Carolina Gamecocks', abbreviation: 'SC', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png', espnId: 2579 },
      { name: 'UConn Huskies', abbreviation: 'CONN', league: 'COLLEGE', conference: 'Independent', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/41.png', espnId: 41 },
      { name: 'UTSA Roadrunners', abbreviation: 'UTSA', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2636.png', espnId: 2636 },
      { name: 'Western Kentucky Hilltoppers', abbreviation: 'WKU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/98.png', espnId: 98 },
      { name: 'Georgia Tech Yellow Jackets', abbreviation: 'GT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png', espnId: 59 },
      { name: 'Coastal Carolina Chanticleers', abbreviation: 'CCU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/324.png', espnId: 324 },
      { name: 'San Jose State Spartans', abbreviation: 'SJSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/23.png', espnId: 23 },
      { name: 'Central Michigan Chippewas', abbreviation: 'CMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2117.png', espnId: 2117 },
      { name: 'UTEP Miners', abbreviation: 'UTEP', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2638.png', espnId: 2638 },
      { name: 'Georgia Southern Eagles', abbreviation: 'GASO', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/290.png', espnId: 290 },
      { name: 'Louisiana Ragin\' Cajuns', abbreviation: 'ULL', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/309.png', espnId: 309 },
      { name: 'Sam Houston Bearkats', abbreviation: 'SHSU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2534.png', espnId: 2534 },
      { name: 'Northern Illinois Huskies', abbreviation: 'NIU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2459.png', espnId: 2459 },
      { name: 'Troy Trojans', abbreviation: 'TROY', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2653.png', espnId: 2653 },
      { name: 'Eastern Michigan Eagles', abbreviation: 'EMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png', espnId: 2199 },
      { name: 'Delaware Blue Hens', abbreviation: 'DEL', league: 'COLLEGE', conference: 'CAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/48.png', espnId: 48 },
      { name: 'Toledo Rockets', abbreviation: 'TOL', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2649.png', espnId: 2649 },
      { name: 'Kent State Golden Flashes', abbreviation: 'KENT', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2309.png', espnId: 2309 },
      { name: 'Louisiana Tech Bulldogs', abbreviation: 'LT', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2348.png', espnId: 2348 },
      { name: 'Arkansas State Red Wolves', abbreviation: 'ARST', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2032.png', espnId: 2032 },
      { name: 'Buffalo Bulls', abbreviation: 'BUFF', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2084.png', espnId: 2084 },
      { name: 'Florida International Panthers', abbreviation: 'FIU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2229.png', espnId: 2229 },
      { name: 'South Florida Bulls', abbreviation: 'USF', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/58.png', espnId: 58 },
      { name: 'South Alabama Jaguars', abbreviation: 'USA', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/6.png', espnId: 6 },
      { name: 'North Texas Mean Green', abbreviation: 'UNT', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/249.png', espnId: 249 },
      { name: 'San Diego State Aztecs', abbreviation: 'SDSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/21.png', espnId: 21 },
      { name: 'Bowling Green Falcons', abbreviation: 'BGSU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2073.png', espnId: 2073 },
      { name: 'East Carolina Pirates', abbreviation: 'ECU', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/151.png', espnId: 151 },
      { name: 'UAB Blazers', abbreviation: 'UAB', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/5.png', espnId: 5 },
      { name: 'Ohio Bobcats', abbreviation: 'OHIO', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/195.png', espnId: 195 },
      { name: 'Texas State Bobcats', abbreviation: 'TXST', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/326.png', espnId: 326 },
      { name: 'Hawaii Rainbow Warriors', abbreviation: 'HAW', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/62.png', espnId: 62 },
      { name: 'Louisiana Monroe Warhawks', abbreviation: 'ULM', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2433.png', espnId: 2433 }
    ]
    
    let added = 0
    const errors = []
    
    for (const teamData of missingTeams) {
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
      message: `Added ${added} missing college teams`,
      added,
      total: missingTeams.length,
      errors: errors.slice(0, 5)
    })
    
  } catch (error) {
    console.error('Failed to add missing teams:', error)
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