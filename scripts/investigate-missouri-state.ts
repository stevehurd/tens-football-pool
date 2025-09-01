import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function investigateMissouriState() {
  console.log('🔍 Investigating Missouri State Bears and team count...')
  
  // First, let's search the ESPN API more broadly
  console.log('\n📡 Fetching all college teams from ESPN...')
  
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams')
    const data = await response.json()
    
    const allTeams = data.sports[0].leagues[0].teams
    console.log(`📊 Total teams in ESPN API: ${allTeams.length}`)
    
    // Search for Missouri State variations
    console.log('\n🔍 Searching for Missouri State variations...')
    const missouriMatches = allTeams.filter((espnTeam: any) => {
      const team = espnTeam.team
      const searchText = `${team.displayName} ${team.name} ${team.nickname} ${team.location}`.toLowerCase()
      
      return searchText.includes('missouri') && (
        searchText.includes('state') ||
        searchText.includes('bears')
      )
    })
    
    console.log(`Found ${missouriMatches.length} Missouri-related matches:`)
    missouriMatches.forEach((espnTeam: any) => {
      const team = espnTeam.team
      console.log(`  - ${team.displayName} (${team.name} ${team.nickname}) - ESPN ID: ${team.id}`)
    })
    
    // Also search for just "Bears"
    console.log('\n🐻 Searching for teams with "Bears"...')
    const bearMatches = allTeams.filter((espnTeam: any) => {
      const team = espnTeam.team
      const searchText = `${team.displayName} ${team.name} ${team.nickname}`.toLowerCase()
      return searchText.includes('bears')
    })
    
    console.log(`Found ${bearMatches.length} Bears teams:`)
    bearMatches.forEach((espnTeam: any) => {
      const team = espnTeam.team
      console.log(`  - ${team.displayName} (${team.name} ${team.nickname}) - ESPN ID: ${team.id}`)
    })
    
    // Check our current database for Conference USA teams
    console.log('\n📋 Current Conference USA teams in database:')
    const cusaTeams = await prisma.team.findMany({
      where: { conference: 'Conference USA' },
      select: { name: true, espnId: true }
    })
    
    console.log(`Found ${cusaTeams.length} Conference USA teams:`)
    cusaTeams.forEach(team => {
      console.log(`  - ${team.name} (ESPN ID: ${team.espnId})`)
    })
    
    // Check for potential duplicates
    console.log('\n🔍 Checking for potential duplicate teams...')
    const allDbTeams = await prisma.team.findMany({
      where: { league: 'COLLEGE' },
      select: { name: true, espnId: true, conference: true }
    })
    
    // Group by ESPN ID to find duplicates
    const espnIdGroups: { [key: string]: any[] } = {}
    allDbTeams.forEach(team => {
      if (team.espnId) {
        const key = team.espnId.toString()
        if (!espnIdGroups[key]) espnIdGroups[key] = []
        espnIdGroups[key].push(team)
      }
    })
    
    console.log('Teams with duplicate ESPN IDs:')
    Object.entries(espnIdGroups).forEach(([espnId, teams]) => {
      if (teams.length > 1) {
        console.log(`  ESPN ID ${espnId}:`)
        teams.forEach(team => {
          console.log(`    - ${team.name} (${team.conference})`)
        })
      }
    })
    
    // Check teams without ESPN IDs
    const teamsWithoutEspnId = allDbTeams.filter(team => !team.espnId)
    console.log(`\n📋 Teams without ESPN ID: ${teamsWithoutEspnId.length}`)
    teamsWithoutEspnId.forEach(team => {
      console.log(`  - ${team.name} (${team.conference})`)
    })
    
  } catch (error) {
    console.error('Error:', error)
  }
}

investigateMissouriState()
  .catch(console.error)
  .finally(() => prisma.$disconnect())