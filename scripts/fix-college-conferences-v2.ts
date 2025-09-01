import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ESPNTeam {
  team: {
    id: string
    displayName: string
    shortDisplayName: string
    abbreviation?: string
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
    }>
  }>
}

async function fetchESPNTeamsWithConferences(): Promise<Map<string, string>> {
  const ESPN_CFB_API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=400'
  const teamConferenceMap = new Map<string, string>()
  
  try {
    console.log(`Fetching from: ${ESPN_CFB_API}`)
    const response = await fetch(ESPN_CFB_API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: ESPNResponse = await response.json()
    
    if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
      const league = data.sports[0].leagues[0]
      
      // Process groups (conferences)
      if (league.groups) {
        for (const group of league.groups) {
          console.log(`Processing conference: ${group.name} (${group.teams?.length || 0} teams)`)
          
          if (group.teams) {
            for (const espnTeam of group.teams) {
              const team = espnTeam.team
              teamConferenceMap.set(team.id, group.name)
              console.log(`  - ${team.displayName} → ${group.name}`)
            }
          }
        }
      }
    }
    
    console.log(`Found ${teamConferenceMap.size} teams with conference information`)
    return teamConferenceMap
  } catch (error) {
    console.error('Error fetching ESPN data:', error)
    throw error
  }
}

async function updateCollegeConferences() {
  console.log('🎓 Updating college team conferences from ESPN API groups...')
  
  // Fetch conference mapping from ESPN
  const teamConferenceMap = await fetchESPNTeamsWithConferences()
  
  // Get all college teams from database
  const collegeTeams = await prisma.team.findMany({
    where: { league: 'COLLEGE' }
  })
  
  console.log(`\nUpdating ${collegeTeams.length} college teams in database...`)
  
  let updatedCount = 0
  let notFoundCount = 0
  
  for (const team of collegeTeams) {
    if (!team.espnId) {
      console.log(`⚠️ Skipping ${team.name} - no ESPN ID`)
      notFoundCount++
      continue
    }
    
    const conference = teamConferenceMap.get(team.espnId.toString())
    
    if (conference) {
      try {
        await prisma.team.update({
          where: { id: team.id },
          data: { conference }
        })
        console.log(`✅ Updated ${team.name} → ${conference}`)
        updatedCount++
      } catch (error) {
        console.log(`❌ Failed to update ${team.name}: ${error}`)
        notFoundCount++
      }
    } else {
      console.log(`⚠️ No conference found for ${team.name} (ESPN ID: ${team.espnId})`)
      notFoundCount++
    }
  }
  
  console.log(`\n📊 Conference update complete:`)
  console.log(`✅ Updated: ${updatedCount} teams`)
  console.log(`❌ Not found/errors: ${notFoundCount} teams`)
  console.log(`📈 Success rate: ${((updatedCount / collegeTeams.length) * 100).toFixed(1)}%`)
}

async function main() {
  try {
    await updateCollegeConferences()
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