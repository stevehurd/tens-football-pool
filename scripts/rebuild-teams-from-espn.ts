import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ESPN API endpoints
const ESPN_NFL_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
const ESPN_CFB_API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200'

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

interface ESPNGroup {
  id: string
  name: string
  shortName: string
  teams: ESPNTeam[]
}

interface ESPNResponse {
  sports: Array<{
    leagues: Array<{
      groups?: ESPNGroup[]
      teams?: ESPNTeam[]
    }>
  }>
}

async function fetchESPNTeams(url: string): Promise<ESPNTeam[]> {
  try {
    console.log(`Fetching from: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: ESPNResponse = await response.json()
    
    let teams: ESPNTeam[] = []
    
    // Handle different ESPN API response structures
    if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
      const league = data.sports[0].leagues[0]
      
      // Some APIs return teams directly
      if (league.teams) {
        teams = league.teams
      }
      
      // Some APIs group teams by conference/division
      if (league.groups) {
        for (const group of league.groups) {
          teams = teams.concat(group.teams || [])
        }
      }
    }
    
    console.log(`Found ${teams.length} teams`)
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

async function rebuildTeamsFromESPN() {
  console.log('🔄 Starting complete team rebuild from ESPN API...')
  
  // Step 1: Clear ALL existing selections first, then teams
  console.log('🗑️ Clearing existing selections...')
  await prisma.selection.deleteMany({})
  console.log('✅ All existing selections cleared')
  
  console.log('🗑️ Clearing existing team data...')
  await prisma.team.deleteMany({})
  console.log('✅ All existing team data cleared')
  
  let totalTeams = 0
  
  try {
    // Step 2: Fetch and create NFL teams
    console.log('🏈 Fetching NFL teams from ESPN...')
    const nflTeams = await fetchESPNTeams(ESPN_NFL_API)
    
    for (const espnTeam of nflTeams) {
      const team = espnTeam.team
      const record = extractRecord(espnTeam)
      
      await prisma.team.create({
        data: {
          name: team.displayName,
          abbreviation: team.abbreviation || team.shortDisplayName,
          league: 'NFL',
          espnId: parseInt(team.id),
          logoUrl: team.logos?.[0]?.href,
          wins: record.wins,
          losses: record.losses,
          ties: record.ties
        }
      })
      
      console.log(`✅ Added NFL: ${team.displayName} (${record.wins}-${record.losses}-${record.ties})`)
      totalTeams++
    }
    
    console.log(`🏈 NFL teams complete: ${nflTeams.length} teams`)
    
    // Step 3: Fetch and create College teams
    console.log('🎓 Fetching College teams from ESPN...')
    const collegeTeams = await fetchESPNTeams(ESPN_CFB_API)
    
    for (const espnTeam of collegeTeams) {
      const team = espnTeam.team
      const record = extractRecord(espnTeam)
      
      await prisma.team.create({
        data: {
          name: team.displayName,
          abbreviation: team.abbreviation || team.shortDisplayName,
          league: 'COLLEGE',
          espnId: parseInt(team.id),
          logoUrl: team.logos?.[0]?.href,
          wins: record.wins,
          losses: record.losses,
          ties: record.ties
        }
      })
      
      console.log(`✅ Added College: ${team.displayName} (${record.wins}-${record.losses}-${record.ties})`)
      totalTeams++
    }
    
    console.log(`🎓 College teams complete: ${collegeTeams.length} teams`)
    
    // Step 4: Update teams with conference/division info via secondary API calls
    await updateTeamConferences()
    
  } catch (error) {
    console.error('❌ Error during team rebuild:', error)
    throw error
  }
  
  console.log(`✅ Team rebuild complete: ${totalTeams} total teams from ESPN API`)
}

async function updateTeamConferences() {
  console.log('🔄 Updating team conference/division information...')
  
  try {
    // Update NFL teams with conference/division
    const nflTeams = await prisma.team.findMany({
      where: { league: 'NFL' }
    })
    
    // NFL conference/division mapping (hardcoded as ESPN doesn't always provide this cleanly)
    const nflConferences: Record<string, { conference: string, division: string }> = {
      'Buffalo Bills': { conference: 'AFC', division: 'East' },
      'Miami Dolphins': { conference: 'AFC', division: 'East' },
      'New England Patriots': { conference: 'AFC', division: 'East' },
      'New York Jets': { conference: 'AFC', division: 'East' },
      'Baltimore Ravens': { conference: 'AFC', division: 'North' },
      'Cincinnati Bengals': { conference: 'AFC', division: 'North' },
      'Cleveland Browns': { conference: 'AFC', division: 'North' },
      'Pittsburgh Steelers': { conference: 'AFC', division: 'North' },
      'Houston Texans': { conference: 'AFC', division: 'South' },
      'Indianapolis Colts': { conference: 'AFC', division: 'South' },
      'Jacksonville Jaguars': { conference: 'AFC', division: 'South' },
      'Tennessee Titans': { conference: 'AFC', division: 'South' },
      'Denver Broncos': { conference: 'AFC', division: 'West' },
      'Kansas City Chiefs': { conference: 'AFC', division: 'West' },
      'Las Vegas Raiders': { conference: 'AFC', division: 'West' },
      'Los Angeles Chargers': { conference: 'AFC', division: 'West' },
      'Dallas Cowboys': { conference: 'NFC', division: 'East' },
      'New York Giants': { conference: 'NFC', division: 'East' },
      'Philadelphia Eagles': { conference: 'NFC', division: 'East' },
      'Washington Commanders': { conference: 'NFC', division: 'East' },
      'Chicago Bears': { conference: 'NFC', division: 'North' },
      'Detroit Lions': { conference: 'NFC', division: 'North' },
      'Green Bay Packers': { conference: 'NFC', division: 'North' },
      'Minnesota Vikings': { conference: 'NFC', division: 'North' },
      'Atlanta Falcons': { conference: 'NFC', division: 'South' },
      'Carolina Panthers': { conference: 'NFC', division: 'South' },
      'New Orleans Saints': { conference: 'NFC', division: 'South' },
      'Tampa Bay Buccaneers': { conference: 'NFC', division: 'South' },
      'Arizona Cardinals': { conference: 'NFC', division: 'West' },
      'Los Angeles Rams': { conference: 'NFC', division: 'West' },
      'San Francisco 49ers': { conference: 'NFC', division: 'West' },
      'Seattle Seahawks': { conference: 'NFC', division: 'West' }
    }
    
    for (const team of nflTeams) {
      const confInfo = nflConferences[team.name]
      if (confInfo) {
        await prisma.team.update({
          where: { id: team.id },
          data: {
            conference: confInfo.conference,
            division: confInfo.division
          }
        })
      }
    }
    
    // For college teams, we'll fetch conference info from a separate ESPN endpoint
    console.log('🎓 Fetching college conference information...')
    const collegeTeams = await prisma.team.findMany({
      where: { league: 'COLLEGE' }
    })
    
    // Update college teams with conference info (simplified approach)
    for (const team of collegeTeams) {
      try {
        const detailUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team.espnId}`
        const response = await fetch(detailUrl)
        if (response.ok) {
          const data = await response.json()
          const conference = data.team?.groups?.[0]?.name || data.team?.conference?.name
          
          if (conference) {
            await prisma.team.update({
              where: { id: team.id },
              data: { conference }
            })
            console.log(`✅ Updated ${team.name} - ${conference}`)
          }
        }
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.log(`⚠️ Could not fetch conference for ${team.name}`)
      }
    }
    
    console.log('✅ Conference/division updates complete')
    
  } catch (error) {
    console.error('❌ Error updating conferences:', error)
  }
}

async function main() {
  try {
    await rebuildTeamsFromESPN()
    
    // Final summary
    const nflCount = await prisma.team.count({ where: { league: 'NFL' } })
    const collegeCount = await prisma.team.count({ where: { league: 'COLLEGE' } })
    
    console.log('\n📊 Final Summary:')
    console.log(`🏈 NFL Teams: ${nflCount}`)
    console.log(`🎓 College Teams: ${collegeCount}`)
    console.log(`📈 Total Teams: ${nflCount + collegeCount}`)
    console.log('✅ All teams rebuilt from ESPN API with live stats!')
    
  } catch (error) {
    console.error('❌ Fatal error during rebuild:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main