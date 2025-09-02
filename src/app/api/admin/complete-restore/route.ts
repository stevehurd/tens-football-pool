import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔄 Starting complete data restore...')
    
    // COMPLETE selection data from your original SQLite
    const allSelections = [
      // Al - 10 selections
      { participant: 'Al', team: 'Cincinnati Bengals', league: 'NFL', pickNumber: 1 },
      { participant: 'Al', team: 'Baltimore Ravens', league: 'NFL', pickNumber: 2 },
      { participant: 'Al', team: 'BYU Cougars', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Al', team: 'Kansas State Wildcats', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Al', team: 'Maryland Terrapins', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Al', team: 'Wake Forest Demon Deacons', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Al', team: 'Marshall Thundering Herd', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Al', team: 'Illinois Fighting Illini', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Al', team: 'Western Michigan Broncos', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Al', team: 'Middle Tennessee Blue Raiders', league: 'COLLEGE', pickNumber: 10 },
      
      // Bocklet - 10 selections
      { participant: 'Bocklet', team: 'Pittsburgh Steelers', league: 'NFL', pickNumber: 1 },
      { participant: 'Bocklet', team: 'James Madison Dukes', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Bocklet', team: 'Miami RedHawks', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Bocklet', team: 'Liberty Flames', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Bocklet', team: 'UNLV Rebels', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Bocklet', team: 'Miami Hurricanes', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Bocklet', team: 'Washington Commanders', league: 'NFL', pickNumber: 7 },
      { participant: 'Bocklet', team: 'Pittsburgh Panthers', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Bocklet', team: 'Southern Miss Golden Eagles', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Bocklet', team: 'Missouri State Bears', league: 'COLLEGE', pickNumber: 10 },
      
      // Brian - 10 selections
      { participant: 'Brian', team: 'Alabama Crimson Tide', league: 'COLLEGE', pickNumber: 1 },
      { participant: 'Brian', team: 'Oklahoma Sooners', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Brian', team: 'Green Bay Packers', league: 'NFL', pickNumber: 3 },
      { participant: 'Brian', team: 'Jacksonville Jaguars', league: 'NFL', pickNumber: 4 },
      { participant: 'Brian', team: 'Mississippi Rebels', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Brian', team: 'Oklahoma State Cowboys', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Brian', team: 'Michigan State Spartans', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Brian', team: 'Appalachian State Mountaineers', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Brian', team: 'Ball State Cardinals', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Brian', team: 'Northwestern Wildcats', league: 'COLLEGE', pickNumber: 10 },
      
      // Daryl - 10 selections
      { participant: 'Daryl', team: 'Michigan Wolverines', league: 'COLLEGE', pickNumber: 1 },
      { participant: 'Daryl', team: 'Detroit Lions', league: 'NFL', pickNumber: 2 },
      { participant: 'Daryl', team: 'Auburn Tigers', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Daryl', team: 'Seattle Seahawks', league: 'NFL', pickNumber: 4 },
      { participant: 'Daryl', team: 'Virginia Tech Hokies', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Daryl', team: 'Houston Cougars', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Daryl', team: 'Florida Gators', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Daryl', team: 'Baylor Bears', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Daryl', team: 'Arkansas Razorbacks', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Daryl', team: 'Old Dominion Monarchs', league: 'COLLEGE', pickNumber: 10 },
      
      // Goody - 10 selections
      { participant: 'Goody', team: 'Philadelphia Eagles', league: 'NFL', pickNumber: 1 },
      { participant: 'Goody', team: 'Clemson Tigers', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Goody', team: 'Tennessee Volunteers', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Goody', team: 'Vanderbilt Commodores', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Goody', team: 'Iowa Hawkeyes', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Goody', team: 'Jacksonville State Gamecocks', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Goody', team: 'Washington State Cougars', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Goody', team: 'New York Giants', league: 'NFL', pickNumber: 8 },
      { participant: 'Goody', team: 'South Carolina Gamecocks', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Goody', team: 'UConn Huskies', league: 'COLLEGE', pickNumber: 10 },
      
      // Continue with all other participants...
      // KOB - 10 selections
      { participant: 'KOB', team: 'Kansas City Chiefs', league: 'NFL', pickNumber: 1 },
      { participant: 'KOB', team: 'Oregon Ducks', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'KOB', team: 'UTSA Roadrunners', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'KOB', team: 'Kansas Jayhawks', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'KOB', team: 'Western Kentucky Hilltoppers', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'KOB', team: 'Las Vegas Raiders', league: 'NFL', pickNumber: 6 },
      { participant: 'KOB', team: 'Georgia Tech Yellow Jackets', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'KOB', team: 'Coastal Carolina Chanticleers', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'KOB', team: 'San Jose State Spartans', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'KOB', team: 'Central Michigan Chippewas', league: 'COLLEGE', pickNumber: 10 },
      
      // Kenny - 10 selections
      { participant: 'Kenny', team: 'Los Angeles Chargers', league: 'NFL', pickNumber: 1 },
      { participant: 'Kenny', team: 'Texas Longhorns', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Kenny', team: 'Miami Dolphins', league: 'NFL', pickNumber: 3 },
      { participant: 'Kenny', team: 'Boise State Broncos', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Kenny', team: 'Texas A&M Aggies', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Kenny', team: 'Nebraska Cornhuskers', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Kenny', team: 'UTEP Miners', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Kenny', team: 'California Golden Bears', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Kenny', team: 'Cincinnati Bearcats', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Kenny', team: 'Georgia Southern Eagles', league: 'COLLEGE', pickNumber: 10 },
      
      // Knowles - 10 selections
      { participant: 'Knowles', team: 'Ohio State Buckeyes', league: 'COLLEGE', pickNumber: 1 },
      { participant: 'Knowles', team: 'LSU Tigers', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Knowles', team: 'Dallas Cowboys', league: 'NFL', pickNumber: 3 },
      { participant: 'Knowles', team: 'Rutgers Scarlet Knights', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Knowles', team: 'Memphis Tigers', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Knowles', team: 'Louisiana Ragin\' Cajuns', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Knowles', team: 'UCF Knights', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Knowles', team: 'Syracuse Orange', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Knowles', team: 'Carolina Panthers', league: 'NFL', pickNumber: 9 },
      { participant: 'Knowles', team: 'Sam Houston Bearkats', league: 'COLLEGE', pickNumber: 10 },
      
      // Mario - 10 selections
      { participant: 'Mario', team: 'Houston Texans', league: 'NFL', pickNumber: 1 },
      { participant: 'Mario', team: 'Chicago Bears', league: 'NFL', pickNumber: 2 },
      { participant: 'Mario', team: 'Duke Blue Devils', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Mario', team: 'Oregon State Beavers', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Mario', team: 'Florida State Seminoles', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Mario', team: 'Northern Illinois Huskies', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Mario', team: 'Missouri Tigers', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Mario', team: 'Troy Trojans', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Mario', team: 'Eastern Michigan Eagles', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Mario', team: 'Delaware Blue Hens', league: 'COLLEGE', pickNumber: 10 },
      
      // Marty - 10 selections
      { participant: 'Marty', team: 'Buffalo Bills', league: 'NFL', pickNumber: 1 },
      { participant: 'Marty', team: 'Atlanta Falcons', league: 'NFL', pickNumber: 2 },
      { participant: 'Marty', team: 'Toledo Rockets', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Marty', team: 'Fresno State Bulldogs', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Marty', team: 'Colorado State Rams', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Marty', team: 'Wyoming Cowboys', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Marty', team: 'Minnesota Golden Gophers', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Marty', team: 'Air Force Falcons', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Marty', team: 'Navy Midshipmen', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Marty', team: 'Kent State Golden Flashes', league: 'COLLEGE', pickNumber: 10 },
      
      // Petrucci - 10 selections
      { participant: 'Petrucci', team: 'Georgia Bulldogs', league: 'COLLEGE', pickNumber: 1 },
      { participant: 'Petrucci', team: 'New England Patriots', league: 'NFL', pickNumber: 2 },
      { participant: 'Petrucci', team: 'Washington Huskies', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Petrucci', team: 'Tulane Green Wave', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Petrucci', team: 'Texas Tech Red Raiders', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Petrucci', team: 'Denver Broncos', league: 'NFL', pickNumber: 6 },
      { participant: 'Petrucci', team: 'Louisiana Tech Bulldogs', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Petrucci', team: 'Army Black Knights', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Petrucci', team: 'Arkansas State Red Wolves', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Petrucci', team: 'Buffalo Bulls', league: 'COLLEGE', pickNumber: 10 },
      
      // Reilly - 10 selections
      { participant: 'Reilly', team: 'Tampa Bay Buccaneers', league: 'NFL', pickNumber: 1 },
      { participant: 'Reilly', team: 'Louisville Cardinals', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Reilly', team: 'SMU Mustangs', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Reilly', team: 'Florida International Panthers', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Reilly', team: 'Arizona Cardinals', league: 'NFL', pickNumber: 5 },
      { participant: 'Reilly', team: 'South Florida Bulls', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Reilly', team: 'Virginia Cavaliers', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Reilly', team: 'South Alabama Jaguars', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Reilly', team: 'North Texas Mean Green', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Reilly', team: 'San Diego State Aztecs', league: 'COLLEGE', pickNumber: 10 },
      
      // Scotty - 10 selections
      { participant: 'Scotty', team: 'New York Jets', league: 'NFL', pickNumber: 1 },
      { participant: 'Scotty', team: 'USC Trojans', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Scotty', team: 'Utah Utes', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Scotty', team: 'Indianapolis Colts', league: 'NFL', pickNumber: 4 },
      { participant: 'Scotty', team: 'Colorado Buffaloes', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Scotty', team: 'Bowling Green Falcons', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Scotty', team: 'East Carolina Pirates', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Scotty', team: 'UAB Blazers', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Scotty', team: 'Wisconsin Badgers', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Scotty', team: 'Arizona State Sun Devils', league: 'COLLEGE', pickNumber: 10 },
      
      // Steamer - 10 selections
      { participant: 'Steamer', team: 'Minnesota Vikings', league: 'NFL', pickNumber: 1 },
      { participant: 'Steamer', team: 'Notre Dame Fighting Irish', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Steamer', team: 'TCU Horned Frogs', league: 'COLLEGE', pickNumber: 3 },
      { participant: 'Steamer', team: 'Iowa State Cyclones', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Steamer', team: 'West Virginia Mountaineers', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Steamer', team: 'Kentucky Wildcats', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Steamer', team: 'Tennessee Titans', league: 'NFL', pickNumber: 7 },
      { participant: 'Steamer', team: 'UCLA Bruins', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Steamer', team: 'Boston College Eagles', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Steamer', team: 'Indiana Hoosiers', league: 'COLLEGE', pickNumber: 10 },
      
      // Steve - 10 selections
      { participant: 'Steve', team: 'San Francisco 49ers', league: 'NFL', pickNumber: 1 },
      { participant: 'Steve', team: 'Penn State Nittany Lions', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Steve', team: 'Los Angeles Rams', league: 'NFL', pickNumber: 3 },
      { participant: 'Steve', team: 'Ohio Bobcats', league: 'COLLEGE', pickNumber: 4 },
      { participant: 'Steve', team: 'North Carolina Tar Heels', league: 'COLLEGE', pickNumber: 5 },
      { participant: 'Steve', team: 'Texas State Bobcats', league: 'COLLEGE', pickNumber: 6 },
      { participant: 'Steve', team: 'NC State Wolfpack', league: 'COLLEGE', pickNumber: 7 },
      { participant: 'Steve', team: 'Hawaii Rainbow Warriors', league: 'COLLEGE', pickNumber: 8 },
      { participant: 'Steve', team: 'Arizona Wildcats', league: 'COLLEGE', pickNumber: 9 },
      { participant: 'Steve', team: 'Louisiana Monroe Warhawks', league: 'COLLEGE', pickNumber: 10 }
    ]
    
    console.log(`Total selections to restore: ${allSelections.length}`)
    
    // Clear existing selections first
    await prisma.selection.deleteMany({})
    console.log('Cleared all existing selections')
    
    let restored = 0
    let failed = 0
    const failures = []
    
    for (const selection of allSelections) {
      try {
        // Find participant
        const participant = await prisma.participant.findFirst({
          where: { name: selection.participant }
        })
        
        if (!participant) {
          failures.push(`Participant not found: ${selection.participant}`)
          failed++
          continue
        }
        
        // Find team - try multiple variations for college teams
        let team = await prisma.team.findFirst({
          where: { 
            name: selection.team,
            league: selection.league 
          }
        })
        
        // If not found, try fuzzy matching for college teams
        if (!team && selection.league === 'COLLEGE') {
          const variations = [
            selection.team.replace('Ole Miss Rebels', 'Mississippi Rebels'),
            selection.team.replace('USC Trojans', 'Southern California Trojans'),
            selection.team.replace('Miami (OH) RedHawks', 'Miami RedHawks'),
            selection.team.replace('Louisiana Ragin\' Cajuns', 'Louisiana Ragin\' Cajuns'),
            selection.team
          ]
          
          for (const variation of variations) {
            team = await prisma.team.findFirst({
              where: { 
                name: { contains: variation.split(' ')[0], mode: 'insensitive' },
                league: selection.league 
              }
            })
            if (team) break
          }
        }
        
        if (team) {
          await prisma.selection.create({
            data: {
              participantId: participant.id,
              teamId: team.id,
              selectionType: selection.league,
              pickNumber: selection.pickNumber
            }
          })
          restored++
          console.log(`✅ ${selection.participant} -> ${selection.team}`)
        } else {
          failures.push(`Team not found: ${selection.team} (${selection.league})`)
          failed++
          console.log(`❌ ${selection.participant} -> ${selection.team} (${selection.league})`)
        }
        
      } catch (error) {
        failures.push(`Error: ${selection.participant} -> ${selection.team}: ${error}`)
        failed++
      }
    }
    
    // Now fix all logos
    const teamsWithoutLogos = await prisma.team.findMany({
      where: { logoUrl: null }
    })
    
    let logosFixed = 0
    for (const team of teamsWithoutLogos) {
      let logoUrl = null
      
      if (team.league === 'NFL') {
        const abbr = team.abbreviation?.toLowerCase()
        if (abbr) {
          logoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${abbr}.png`
        }
      } else if (team.league === 'COLLEGE' && team.espnId) {
        logoUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.espnId}.png`
      }
      
      if (logoUrl) {
        await prisma.team.update({
          where: { id: team.id },
          data: { logoUrl }
        })
        logosFixed++
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Complete restore finished`,
      selectionsRestored: restored,
      selectionsFailed: failed,
      logosFixed,
      totalAttempted: allSelections.length,
      successRate: `${((restored / allSelections.length) * 100).toFixed(1)}%`,
      failures: failures.slice(0, 10) // First 10 failures
    })
    
  } catch (error) {
    console.error('Complete restore failed:', error)
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