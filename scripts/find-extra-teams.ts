import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findExtraTeams() {
  console.log('🔍 Finding which teams to remove to get exactly 134 FBS teams...')
  
  try {
    // Get all college teams
    const allCollegeTeams = await prisma.team.findMany({
      where: { league: 'COLLEGE' },
      select: { 
        id: true,
        name: true, 
        espnId: true, 
        conference: true,
        selections: {
          select: { id: true }
        }
      }
    })
    
    console.log(`📊 Current college teams: ${allCollegeTeams.length}`)
    console.log(`Need to remove: ${allCollegeTeams.length - 134} teams`)
    
    // Group by conference to see distribution
    const conferenceGroups: { [key: string]: any[] } = {}
    allCollegeTeams.forEach(team => {
      const conf = team.conference || 'No Conference'
      if (!conferenceGroups[conf]) conferenceGroups[conf] = []
      conferenceGroups[conf].push(team)
    })
    
    console.log('\n📋 Teams by conference:')
    Object.entries(conferenceGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([conference, teams]) => {
        console.log(`  ${conference}: ${teams.length} teams`)
        teams.forEach(team => {
          const hasSelections = team.selections.length > 0 ? ' (HAS SELECTIONS)' : ''
          console.log(`    - ${team.name} (ESPN ID: ${team.espnId})${hasSelections}`)
        })
      })
    
    // Find teams that might not be FBS
    console.log('\n🔍 Looking for potential non-FBS teams...')
    
    // Look for teams without ESPN IDs (most likely to be wrong)
    const noEspnId = allCollegeTeams.filter(team => !team.espnId)
    console.log(`\nTeams without ESPN ID: ${noEspnId.length}`)
    noEspnId.forEach(team => {
      const hasSelections = team.selections.length > 0 ? ' (HAS SELECTIONS)' : ''
      console.log(`  - ${team.name}${hasSelections}`)
    })
    
    // Look for teams that might be FCS or lower divisions
    // These would typically have ESPN IDs but might not be in major conferences
    console.log('\n🔍 Checking for potential FCS teams...')
    
    // Let's check some suspicious teams by searching known FCS conferences
    const suspiciousConferences = [
      'No Conference',
      'Independent',
      'Division II',
      'FCS'
    ]
    
    const suspiciousTeams = allCollegeTeams.filter(team => 
      suspiciousConferences.includes(team.conference || '') ||
      team.conference === null
    )
    
    console.log(`\nTeams in suspicious conferences: ${suspiciousTeams.length}`)
    suspiciousTeams.forEach(team => {
      const hasSelections = team.selections.length > 0 ? ' (HAS SELECTIONS)' : ''
      console.log(`  - ${team.name} (${team.conference || 'NULL'})${hasSelections}`)
    })
    
    // Let's also check the teams we just added
    console.log('\n📋 Recently added teams:')
    const recentlyAdded = ['Delaware Blue Hens', 'Missouri State Bears']
    
    for (const teamName of recentlyAdded) {
      const team = allCollegeTeams.find(t => t.name === teamName)
      if (team) {
        const hasSelections = team.selections.length > 0 ? ' (HAS SELECTIONS)' : ''
        console.log(`  ✅ ${team.name} - ${team.conference} (ESPN ID: ${team.espnId})${hasSelections}`)
      }
    }
    
    // Final recommendation
    console.log('\n💡 Recommendations for removal:')
    console.log('1. Teams without ESPN IDs are most likely to be incorrect')
    console.log('2. Teams without any player selections can be safely removed')
    console.log('3. Teams in "No Conference" or null conference might be incorrect')
    
    // Count teams with selections
    const teamsWithSelections = allCollegeTeams.filter(team => team.selections.length > 0)
    const teamsWithoutSelections = allCollegeTeams.filter(team => team.selections.length === 0)
    
    console.log(`\n📊 Teams with selections: ${teamsWithSelections.length}`)
    console.log(`📊 Teams without selections: ${teamsWithoutSelections.length}`)
    
    if (teamsWithoutSelections.length >= 2) {
      console.log('\n🎯 Safest teams to remove (no selections):')
      teamsWithoutSelections.slice(0, 5).forEach(team => {
        console.log(`  - ${team.name} (${team.conference || 'No Conference'}) - ESPN ID: ${team.espnId}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

findExtraTeams()
  .catch(console.error)
  .finally(() => prisma.$disconnect())