import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// FBS conferences only
const fbsConferences = [
  'SEC',
  'Big Ten', 
  'ACC',
  'Big 12',
  'Pac-12',
  'American',
  'Mountain West',
  'Sun Belt',
  'MAC',
  'C-USA',
  'Independent' // Only FBS independents
]

// FBS Independent teams (manually verified)
const fbsIndependents = [
  'Army Black Knights',
  'Notre Dame Fighting Irish',
  'UConn Huskies',
  'Massachusetts Minutemen'
]

async function keepOnlyFBSTeams() {
  console.log('🏈 Removing non-FBS teams from database...')
  
  // First, let's see what we have
  const allCollegeTeams = await prisma.team.findMany({
    where: { league: 'COLLEGE' },
    select: { id: true, name: true, conference: true }
  })
  
  console.log(`Total college teams before cleanup: ${allCollegeTeams.length}`)
  
  // Identify teams to keep (FBS only)
  const teamsToKeep = allCollegeTeams.filter(team => {
    // Keep teams in FBS conferences
    if (fbsConferences.includes(team.conference || '')) {
      // For independents, only keep the FBS ones
      if (team.conference === 'Independent') {
        return fbsIndependents.includes(team.name)
      }
      return true
    }
    return false
  })
  
  console.log(`FBS teams to keep: ${teamsToKeep.length}`)
  
  // Get teams to remove
  const teamsToRemove = allCollegeTeams.filter(team => 
    !teamsToKeep.some(keep => keep.id === team.id)
  )
  
  console.log(`Teams to remove: ${teamsToRemove.length}`)
  
  // Show what we're removing
  console.log('\nTeams being removed:')
  const removeByConference = teamsToRemove.reduce((acc, team) => {
    const conf = team.conference || 'Unknown'
    acc[conf] = (acc[conf] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  Object.entries(removeByConference).forEach(([conf, count]) => {
    console.log(`  ${conf}: ${count} teams`)
  })
  
  // Remove non-FBS teams
  if (teamsToRemove.length > 0) {
    const teamIds = teamsToRemove.map(t => t.id)
    
    // First remove any selections for these teams
    const deletedSelections = await prisma.selection.deleteMany({
      where: {
        teamId: { in: teamIds }
      }
    })
    console.log(`\nDeleted ${deletedSelections.count} selections for non-FBS teams`)
    
    // Then remove the teams
    const deletedTeams = await prisma.team.deleteMany({
      where: {
        id: { in: teamIds }
      }
    })
    console.log(`Deleted ${deletedTeams.count} non-FBS teams`)
  }
  
  // Final count
  const finalCount = await prisma.team.count({
    where: { league: 'COLLEGE' }
  })
  
  console.log(`\n✅ Cleanup complete!`)
  console.log(`📊 Final FBS team count: ${finalCount}`)
  console.log(`🗑️ Removed: ${allCollegeTeams.length - finalCount} non-FBS teams`)
  
  // Show final conference distribution
  const finalDistribution = await prisma.team.groupBy({
    by: ['conference'],
    where: { league: 'COLLEGE' },
    _count: { conference: true }
  })
  
  console.log('\n📈 Final FBS conference distribution:')
  finalDistribution
    .sort((a, b) => (b._count.conference || 0) - (a._count.conference || 0))
    .forEach(item => {
      console.log(`  ${item.conference}: ${item._count.conference} teams`)
    })
}

async function main() {
  try {
    await keepOnlyFBSTeams()
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