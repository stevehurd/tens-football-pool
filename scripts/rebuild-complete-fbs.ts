import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ESPN_CFB_API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=500'

interface ESPNTeam {
  team: {
    id: string
    displayName: string
    shortDisplayName: string
    abbreviation?: string
    logos?: Array<{ href: string }>
    record?: {
      items?: Array<{
        stats?: Array<{
          name: string
          value: number
        }>
      }>
    }
  }
}

// Complete list of all FBS teams organized by conference (2024 season)
const fbsTeamsByConference: Record<string, string[]> = {
  'SEC': [
    'Alabama Crimson Tide',
    'Arkansas Razorbacks', 
    'Auburn Tigers',
    'Florida Gators',
    'Georgia Bulldogs',
    'Kentucky Wildcats',
    'LSU Tigers',
    'Ole Miss Rebels',
    'Mississippi State Bulldogs',
    'Missouri Tigers',
    'South Carolina Gamecocks',
    'Tennessee Volunteers',
    'Texas A&M Aggies',
    'Vanderbilt Commodores',
    'Texas Longhorns',
    'Oklahoma Sooners'
  ],
  'Big Ten': [
    'Illinois Fighting Illini',
    'Indiana Hoosiers',
    'Iowa Hawkeyes',
    'Maryland Terrapins',
    'Michigan Wolverines',
    'Michigan State Spartans',
    'Minnesota Golden Gophers',
    'Nebraska Cornhuskers',
    'Northwestern Wildcats',
    'Ohio State Buckeyes',
    'Penn State Nittany Lions',
    'Purdue Boilermakers',
    'Rutgers Scarlet Knights',
    'Wisconsin Badgers',
    'Oregon Ducks',
    'UCLA Bruins',
    'USC Trojans',
    'Washington Huskies'
  ],
  'ACC': [
    'Boston College Eagles',
    'Clemson Tigers',
    'Duke Blue Devils',
    'Florida State Seminoles',
    'Georgia Tech Yellow Jackets',
    'Louisville Cardinals',
    'Miami Hurricanes',
    'NC State Wolfpack',
    'North Carolina Tar Heels',
    'Pittsburgh Panthers',
    'Syracuse Orange',
    'Virginia Cavaliers',
    'Virginia Tech Hokies',
    'Wake Forest Demon Deacons',
    'Notre Dame Fighting Irish',
    'SMU Mustangs',
    'California Golden Bears',
    'Stanford Cardinal'
  ],
  'Big 12': [
    'Baylor Bears',
    'BYU Cougars',
    'Cincinnati Bearcats',
    'Houston Cougars',
    'Iowa State Cyclones',
    'Kansas Jayhawks',
    'Kansas State Wildcats',
    'Oklahoma State Cowboys',
    'TCU Horned Frogs',
    'Texas Tech Red Raiders',
    'UCF Knights',
    'West Virginia Mountaineers',
    'Arizona Wildcats',
    'Arizona State Sun Devils',
    'Colorado Buffaloes',
    'Utah Utes'
  ],
  'Pac-12': [
    'Oregon State Beavers',
    'Washington State Cougars'
  ],
  'American': [
    'East Carolina Pirates',
    'Memphis Tigers',
    'Navy Midshipmen',
    'South Florida Bulls',
    'Temple Owls',
    'Tulane Green Wave',
    'Tulsa Golden Hurricane',
    'UAB Blazers',
    'UTSA Roadrunners',
    'Charlotte 49ers',
    'Florida Atlantic Owls',
    'North Texas Mean Green',
    'Rice Owls'
  ],
  'Mountain West': [
    'Air Force Falcons',
    'Boise State Broncos',
    'Colorado State Rams',
    'Fresno State Bulldogs',
    'Hawaii Rainbow Warriors',
    'Nevada Wolf Pack',
    'New Mexico Lobos',
    'San Diego State Aztecs',
    'San Jose State Spartans',
    'UNLV Rebels',
    'Utah State Aggies',
    'Wyoming Cowboys'
  ],
  'Sun Belt': [
    'Appalachian State Mountaineers',
    'Arkansas State Red Wolves',
    'Coastal Carolina Chanticleers',
    'Georgia Southern Eagles',
    'Georgia State Panthers',
    'James Madison Dukes',
    'Louisiana Ragin\' Cajuns',
    'Louisiana Monroe Warhawks',
    'Marshall Thundering Herd',
    'Old Dominion Monarchs',
    'South Alabama Jaguars',
    'Southern Miss Golden Eagles',
    'Texas State Bobcats',
    'Troy Trojans'
  ],
  'MAC': [
    'Akron Zips',
    'Ball State Cardinals',
    'Bowling Green Falcons',
    'Buffalo Bulls',
    'Central Michigan Chippewas',
    'Eastern Michigan Eagles',
    'Kent State Golden Flashes',
    'Miami (OH) RedHawks',
    'Northern Illinois Huskies',
    'Ohio Bobcats',
    'Toledo Rockets',
    'Western Michigan Broncos'
  ],
  'Conference USA': [
    'Florida International Panthers',
    'Jacksonville State Gamecocks',
    'Louisiana Tech Bulldogs',
    'Liberty Flames',
    'Middle Tennessee Blue Raiders',
    'New Mexico State Aggies',
    'Sam Houston Bearkats',
    'UTEP Miners',
    'Western Kentucky Hilltoppers',
    'Kennesaw State Owls'
  ],
  'Independent': [
    'Army Black Knights',
    'UConn Huskies',
    'Massachusetts Minutemen'
  ]
}

async function fetchESPNTeams(url: string): Promise<ESPNTeam[]> {
  try {
    console.log(`Fetching from: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: any = await response.json()
    
    let teams: ESPNTeam[] = []
    
    if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
      const league = data.sports[0].leagues[0]
      
      if (league.teams) {
        teams = league.teams
      }
      
      if (league.groups) {
        for (const group of league.groups) {
          teams = teams.concat(group.teams || [])
        }
      }
    }
    
    console.log(`Found ${teams.length} total teams from ESPN`)
    return teams
  } catch (error) {
    console.error('Error fetching ESPN data:', error)
    throw error
  }
}

function extractRecord(espnTeam: ESPNTeam): { wins: number, losses: number, ties: number } {
  let wins = 0, losses = 0, ties = 0
  
  const team = espnTeam.team
  if (team.record && team.record.items) {
    for (const item of team.record.items) {
      if (item.stats) {
        for (const stat of item.stats) {
          switch (stat.name?.toLowerCase()) {
            case 'wins':
              wins = stat.value || 0
              break
            case 'losses':
              losses = stat.value || 0
              break
            case 'ties':
              ties = stat.value || 0
              break
          }
        }
      }
    }
  }
  
  return { wins, losses, ties }
}

// Function to find best name match
function findBestMatch(espnName: string, fbsTeams: string[]): string | null {
  const cleanEspnName = espnName.toLowerCase().trim()
  
  // Direct match
  const directMatch = fbsTeams.find(team => team.toLowerCase() === cleanEspnName)
  if (directMatch) return directMatch
  
  // Partial matches
  for (const fbsTeam of fbsTeams) {
    const cleanFbsName = fbsTeam.toLowerCase()
    
    // Check if ESPN name contains FBS team name or vice versa
    if (cleanEspnName.includes(cleanFbsName.split(' ')[0]) && 
        cleanEspnName.includes(cleanFbsName.split(' ')[cleanFbsName.split(' ').length - 1])) {
      return fbsTeam
    }
    
    // Check reverse
    if (cleanFbsName.includes(cleanEspnName.split(' ')[0]) && 
        cleanFbsName.includes(cleanEspnName.split(' ')[cleanEspnName.split(' ').length - 1])) {
      return fbsTeam
    }
  }
  
  return null
}

async function rebuildFBSTeams() {
  console.log('🏈 Rebuilding complete FBS team database...')
  
  // Clear existing college teams and their selections
  console.log('🗑️ Clearing existing college teams...')
  await prisma.selection.deleteMany({
    where: {
      team: {
        league: 'COLLEGE'
      }
    }
  })
  await prisma.team.deleteMany({
    where: { league: 'COLLEGE' }
  })
  
  // Get all ESPN teams
  const espnTeams = await fetchESPNTeams(ESPN_CFB_API)
  
  // Create flat list of all FBS teams
  const allFBSTeams = Object.values(fbsTeamsByConference).flat()
  console.log(`Target FBS teams: ${allFBSTeams.length}`)
  
  let createdCount = 0
  let notFoundCount = 0
  
  // Create teams by matching ESPN data to our FBS list
  for (const [conference, fbsTeamsInConf] of Object.entries(fbsTeamsByConference)) {
    console.log(`\n📍 Processing ${conference} (${fbsTeamsInConf.length} teams)`)
    
    for (const fbsTeamName of fbsTeamsInConf) {
      // Find matching ESPN team
      const matchingEspnTeam = espnTeams.find(espnTeam => {
        const match = findBestMatch(espnTeam.team.displayName, [fbsTeamName])
        return match === fbsTeamName
      })
      
      if (matchingEspnTeam) {
        const team = matchingEspnTeam.team
        const record = extractRecord(matchingEspnTeam)
        
        try {
          await prisma.team.create({
            data: {
              name: fbsTeamName, // Use our standardized name
              abbreviation: team.abbreviation || team.shortDisplayName,
              league: 'COLLEGE',
              conference: conference,
              espnId: parseInt(team.id),
              logoUrl: team.logos?.[0]?.href,
              wins: record.wins,
              losses: record.losses,
              ties: record.ties
            }
          })
        } catch (error) {
          // If espnId conflict, create without espnId
          await prisma.team.create({
            data: {
              name: fbsTeamName,
              abbreviation: team.abbreviation || team.shortDisplayName,
              league: 'COLLEGE',
              conference: conference,
              logoUrl: team.logos?.[0]?.href,
              wins: record.wins,
              losses: record.losses,
              ties: record.ties
            }
          })
          console.log(`⚠️ ${fbsTeamName} (ESPN ID conflict, created without ESPN ID)`)
          createdCount++
          continue
        }
        
        console.log(`✅ ${fbsTeamName} (ESPN: ${team.displayName})`)
        createdCount++
      } else {
        // Create without ESPN data
        await prisma.team.create({
          data: {
            name: fbsTeamName,
            league: 'COLLEGE',
            conference: conference,
            wins: 0,
            losses: 0,
            ties: 0
          }
        })
        
        console.log(`⚠️ ${fbsTeamName} (no ESPN match)`)
        notFoundCount++
      }
    }
  }
  
  console.log(`\n✅ FBS rebuild complete!`)
  console.log(`📊 Created: ${createdCount} teams with ESPN data`)
  console.log(`⚠️ Created: ${notFoundCount} teams without ESPN data`)
  console.log(`🎯 Total: ${createdCount + notFoundCount} FBS teams`)
  
  // Final verification
  const finalCount = await prisma.team.count({ where: { league: 'COLLEGE' } })
  console.log(`\n🔍 Database verification: ${finalCount} college teams`)
  
  if (finalCount === 134) {
    console.log('🎉 SUCCESS: All 134 FBS teams are now in the database!')
  } else {
    console.log(`❌ WARNING: Expected 134 teams, got ${finalCount}`)
  }
}

async function main() {
  try {
    await rebuildFBSTeams()
  } catch (error) {
    console.error('❌ Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main