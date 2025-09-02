import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔥 NUCLEAR OPTION: Complete database rebuild...')
    
    // Step 1: Clear everything
    await prisma.selection.deleteMany({})
    await prisma.team.deleteMany({})
    console.log('Cleared all selections and teams')
    
    // Step 2: Rebuild teams from seed (this has ESPN IDs)
    const teams = [
      // NFL Teams with ESPN IDs (from your working seed)
      { name: 'Arizona Cardinals', abbreviation: 'ARI', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png', espnId: 22 },
      { name: 'Atlanta Falcons', abbreviation: 'ATL', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png', espnId: 1 },
      { name: 'Baltimore Ravens', abbreviation: 'BAL', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png', espnId: 33 },
      { name: 'Buffalo Bills', abbreviation: 'BUF', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png', espnId: 2 },
      { name: 'Carolina Panthers', abbreviation: 'CAR', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png', espnId: 29 },
      { name: 'Chicago Bears', abbreviation: 'CHI', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png', espnId: 3 },
      { name: 'Cincinnati Bengals', abbreviation: 'CIN', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png', espnId: 4 },
      { name: 'Cleveland Browns', abbreviation: 'CLE', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png', espnId: 5 },
      { name: 'Dallas Cowboys', abbreviation: 'DAL', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png', espnId: 6 },
      { name: 'Denver Broncos', abbreviation: 'DEN', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png', espnId: 7 },
      { name: 'Detroit Lions', abbreviation: 'DET', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png', espnId: 8 },
      { name: 'Green Bay Packers', abbreviation: 'GB', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png', espnId: 9 },
      { name: 'Houston Texans', abbreviation: 'HOU', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png', espnId: 34 },
      { name: 'Indianapolis Colts', abbreviation: 'IND', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png', espnId: 11 },
      { name: 'Jacksonville Jaguars', abbreviation: 'JAX', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png', espnId: 30 },
      { name: 'Kansas City Chiefs', abbreviation: 'KC', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', espnId: 12 },
      { name: 'Las Vegas Raiders', abbreviation: 'LV', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png', espnId: 13 },
      { name: 'Los Angeles Chargers', abbreviation: 'LAC', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png', espnId: 24 },
      { name: 'Los Angeles Rams', abbreviation: 'LAR', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png', espnId: 14 },
      { name: 'Miami Dolphins', abbreviation: 'MIA', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png', espnId: 15 },
      { name: 'Minnesota Vikings', abbreviation: 'MIN', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png', espnId: 16 },
      { name: 'New England Patriots', abbreviation: 'NE', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png', espnId: 17 },
      { name: 'New Orleans Saints', abbreviation: 'NO', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png', espnId: 18 },
      { name: 'New York Giants', abbreviation: 'NYG', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png', espnId: 19 },
      { name: 'New York Jets', abbreviation: 'NYJ', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png', espnId: 20 },
      { name: 'Philadelphia Eagles', abbreviation: 'PHI', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png', espnId: 21 },
      { name: 'Pittsburgh Steelers', abbreviation: 'PIT', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png', espnId: 23 },
      { name: 'San Francisco 49ers', abbreviation: 'SF', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png', espnId: 25 },
      { name: 'Seattle Seahawks', abbreviation: 'SEA', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', espnId: 26 },
      { name: 'Tampa Bay Buccaneers', abbreviation: 'TB', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png', espnId: 27 },
      { name: 'Tennessee Titans', abbreviation: 'TEN', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png', espnId: 10 },
      { name: 'Washington Commanders', abbreviation: 'WAS', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/was.png', espnId: 28 },
      
      // College teams with ESPN IDs (key ones from your selections)
      { name: 'Alabama Crimson Tide', abbreviation: 'ALA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png', espnId: 333 },
      { name: 'Auburn Tigers', abbreviation: 'AUB', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png', espnId: 2 },
      { name: 'BYU Cougars', abbreviation: 'BYU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/252.png', espnId: 252 },
      { name: 'Clemson Tigers', abbreviation: 'CLEM', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png', espnId: 228 },
      { name: 'Florida Gators', abbreviation: 'FLA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png', espnId: 57 },
      { name: 'Georgia Bulldogs', abbreviation: 'UGA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png', espnId: 61 },
      { name: 'LSU Tigers', abbreviation: 'LSU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png', espnId: 99 },
      { name: 'Michigan Wolverines', abbreviation: 'MICH', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png', espnId: 130 },
      { name: 'Ohio State Buckeyes', abbreviation: 'OSU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png', espnId: 194 },
      { name: 'Oklahoma Sooners', abbreviation: 'OU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png', espnId: 201 },
      { name: 'Oregon Ducks', abbreviation: 'ORE', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png', espnId: 2483 },
      { name: 'Penn State Nittany Lions', abbreviation: 'PSU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png', espnId: 213 },
      { name: 'Tennessee Volunteers', abbreviation: 'TENN', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png', espnId: 2633 },
      { name: 'Texas Longhorns', abbreviation: 'TEX', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png', espnId: 251 },
      { name: 'USC Trojans', abbreviation: 'USC', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png', espnId: 30 },
      
      // Add more key college teams as needed...
      { name: 'Notre Dame Fighting Irish', abbreviation: 'ND', league: 'COLLEGE', conference: 'Independent', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png', espnId: 87 },
      { name: 'Miami Hurricanes', abbreviation: 'MIA', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png', espnId: 2390 },
      { name: 'Texas A&M Aggies', abbreviation: 'TAMU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png', espnId: 245 },
      { name: 'Kansas State Wildcats', abbreviation: 'KSU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png', espnId: 2306 },
      { name: 'Oklahoma State Cowboys', abbreviation: 'OKST', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/197.png', espnId: 197 },
      { name: 'Mississippi Rebels', abbreviation: 'MISS', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png', espnId: 145 }
    ]
    
    console.log('Creating teams...')
    for (const teamData of teams) {
      await prisma.team.create({
        data: {
          name: teamData.name,
          abbreviation: teamData.abbreviation,
          league: teamData.league,
          conference: teamData.conference || null,
          division: teamData.division || null,
          logoUrl: teamData.logoUrl,
          espnId: teamData.espnId,
          wins: 0,
          losses: 0,
          ties: 0
        }
      })
    }
    
    console.log(`Created ${teams.length} teams`)
    
    // Step 3: Restore key selections (at least the ones we know work)
    const keySelections = [
      // Steve's picks
      { participant: 'Steve', team: 'San Francisco 49ers', league: 'NFL', pickNumber: 1 },
      { participant: 'Steve', team: 'Penn State Nittany Lions', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Steve', team: 'Los Angeles Rams', league: 'NFL', pickNumber: 3 },
      
      // Al's picks
      { participant: 'Al', team: 'Cincinnati Bengals', league: 'NFL', pickNumber: 1 },
      { participant: 'Al', team: 'Baltimore Ravens', league: 'NFL', pickNumber: 2 },
      { participant: 'Al', team: 'BYU Cougars', league: 'COLLEGE', pickNumber: 3 },
      
      // Add more as we verify they work...
    ]
    
    let restored = 0
    for (const selection of keySelections) {
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
        await prisma.selection.create({
          data: {
            participantId: participant.id,
            teamId: team.id,
            selectionType: selection.league,
            pickNumber: selection.pickNumber
          }
        })
        restored++
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Nuclear option complete',
      teamsCreated: teams.length,
      selectionsRestored: restored,
      note: 'Database completely rebuilt with proper ESPN IDs and logos'
    })
    
  } catch (error) {
    console.error('Nuclear option failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}