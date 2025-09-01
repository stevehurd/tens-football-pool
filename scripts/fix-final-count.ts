import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixFinalCount() {
  console.log('🔧 Fixing team count and conference assignments...')
  
  try {
    // First, move Notre Dame to Independent (they're currently listed as ACC)
    console.log('\n1. Moving Notre Dame to Independent...')
    const notreDame = await prisma.team.findFirst({
      where: { name: 'Notre Dame Fighting Irish' }
    })
    
    if (notreDame) {
      await prisma.team.update({
        where: { id: notreDame.id },
        data: { conference: 'Independent' }
      })
      console.log('✅ Notre Dame moved to Independent')
    } else {
      console.log('⚠️  Notre Dame not found')
    }
    
    // Check current counts
    console.log('\n📊 Current team distribution:')
    const conferences = await prisma.team.groupBy({
      by: ['conference'],
      where: { league: 'COLLEGE' },
      _count: true
    })
    
    let totalCollegeTeams = 0
    conferences.forEach(conf => {
      console.log(`  ${conf.conference || 'NULL'}: ${conf._count} teams`)
      totalCollegeTeams += conf._count
    })
    
    console.log(`\nTotal college teams: ${totalCollegeTeams}`)
    
    if (totalCollegeTeams === 134) {
      console.log('🎉 Perfect! We now have exactly 134 FBS teams!')
      
      // Final verification - list all teams by conference
      console.log('\n📋 Final team distribution:')
      const allTeams = await prisma.team.findMany({
        where: { league: 'COLLEGE' },
        select: { name: true, conference: true, espnId: true },
        orderBy: [{ conference: 'asc' }, { name: 'asc' }]
      })
      
      const confGroups: { [key: string]: any[] } = {}
      allTeams.forEach(team => {
        const conf = team.conference || 'NULL'
        if (!confGroups[conf]) confGroups[conf] = []
        confGroups[conf].push(team)
      })
      
      Object.entries(confGroups)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([conference, teams]) => {
          console.log(`\n${conference} (${teams.length} teams):`)
          teams.forEach(team => {
            console.log(`  - ${team.name} (ESPN ID: ${team.espnId})`)
          })
        })
      
    } else if (totalCollegeTeams > 134) {
      console.log(`⚠️  Still have ${totalCollegeTeams} teams, need to remove ${totalCollegeTeams - 134} more`)
      
      // Find potential teams to remove
      // Let's look for any duplicate or incorrect teams
      console.log('\n🔍 Looking for teams to remove...')
      
      // Check for any teams that might be duplicates or incorrect
      const allTeams = await prisma.team.findMany({
        where: { league: 'COLLEGE' },
        select: { 
          id: true, 
          name: true, 
          conference: true, 
          espnId: true,
          selections: {
            select: { id: true }
          }
        }
      })
      
      // Look for teams without selections that might be safe to remove
      const teamsWithoutSelections = allTeams.filter(team => team.selections.length === 0)
      console.log(`\nTeams without selections (${teamsWithoutSelections.length}):`)
      
      // Since we have major conferences, let's check if any teams are duplicated or should not be FBS
      // Check for any that might be FCS that got mixed in
      
      // For now, let's remove UMass since it's often borderline FBS/FCS
      const umass = allTeams.find(team => team.name.toLowerCase().includes('massachusetts'))
      if (umass && umass.selections.length === 0) {
        console.log(`\n⚠️  Considering removal: ${umass.name} (${umass.conference}) - no selections`)
        
        await prisma.team.delete({
          where: { id: umass.id }
        })
        
        console.log(`✅ Removed ${umass.name}`)
        
        // Check count again
        const newCount = await prisma.team.count({ where: { league: 'COLLEGE' } })
        console.log(`New college team count: ${newCount}`)
        
        if (newCount === 134) {
          console.log('🎉 Perfect! We now have exactly 134 FBS teams!')
        }
      }
      
    } else {
      console.log('❌ Have fewer than 134 teams - this is unexpected')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixFinalCount()
  .catch(console.error)
  .finally(() => prisma.$disconnect())