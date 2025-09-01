import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkSyncResults() {
  console.log('🔍 Checking team sync results...')
  
  try {
    // Check NFL teams
    console.log('\n🏈 NFL Team Records:')
    const nflTeams = await prisma.team.findMany({
      where: { league: 'NFL' },
      select: { name: true, wins: true, losses: true, abbreviation: true },
      orderBy: { name: 'asc' }
    })
    
    let nflWithRecords = 0
    nflTeams.forEach(team => {
      if (team.wins > 0 || team.losses > 0) {
        console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses}`)
        nflWithRecords++
      } else {
        console.log(`  ❌ ${team.name}: 0-0 (no record)`)
      }
    })
    
    console.log(`\nNFL teams with updated records: ${nflWithRecords}/${nflTeams.length}`)
    
    // Check College teams
    console.log('\n🎓 College Team Records (showing first 20 with records):')
    const collegeTeams = await prisma.team.findMany({
      where: { league: 'COLLEGE' },
      select: { name: true, wins: true, losses: true, conference: true, espnId: true },
      orderBy: [{ wins: 'desc' }, { name: 'asc' }]
    })
    
    let collegeWithRecords = 0
    let collegeWithoutRecords = 0
    const teamsWithRecords: any[] = []
    const teamsWithoutRecords: any[] = []
    
    collegeTeams.forEach(team => {
      if (team.wins > 0 || team.losses > 0) {
        teamsWithRecords.push(team)
        collegeWithRecords++
      } else {
        teamsWithoutRecords.push(team)
        collegeWithoutRecords++
      }
    })
    
    // Show teams with records
    console.log('\nTeams WITH updated records:')
    teamsWithRecords.slice(0, 10).forEach(team => {
      console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses} (${team.conference})`)
    })
    
    if (teamsWithRecords.length > 10) {
      console.log(`  ... and ${teamsWithRecords.length - 10} more teams with records`)
    }
    
    // Show teams without records
    console.log('\nTeams WITHOUT records (first 10):')
    teamsWithoutRecords.slice(0, 10).forEach(team => {
      console.log(`  ❌ ${team.name}: 0-0 (${team.conference}) - ESPN ID: ${team.espnId}`)
    })
    
    if (teamsWithoutRecords.length > 10) {
      console.log(`  ... and ${teamsWithoutRecords.length - 10} more teams without records`)
    }
    
    console.log(`\nCollege teams with records: ${collegeWithRecords}/${collegeTeams.length}`)
    console.log(`College teams without records: ${collegeWithoutRecords}/${collegeTeams.length}`)
    
    // Check some specific teams that should have records
    console.log('\n🔍 Checking specific teams that should have records...')
    const specificTeams = [
      'Georgia Bulldogs',
      'Alabama Crimson Tide', 
      'Ohio State Buckeyes',
      'Michigan Wolverines',
      'Texas Longhorns',
      'Delaware Blue Hens',
      'Missouri State Bears'
    ]
    
    for (const teamName of specificTeams) {
      const team = await prisma.team.findFirst({
        where: { name: teamName },
        select: { name: true, wins: true, losses: true, conference: true, espnId: true }
      })
      
      if (team) {
        if (team.wins > 0 || team.losses > 0) {
          console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses}`)
        } else {
          console.log(`  ❌ ${team.name}: 0-0 (ESPN ID: ${team.espnId})`)
        }
      } else {
        console.log(`  ⚠️ ${teamName}: Not found`)
      }
    }
    
    // Summary
    console.log('\n📊 Summary:')
    console.log(`Total teams: ${nflTeams.length + collegeTeams.length}`)
    console.log(`Teams with updated records: ${nflWithRecords + collegeWithRecords}`)
    console.log(`Teams still showing 0-0: ${(nflTeams.length - nflWithRecords) + collegeWithoutRecords}`)
    
    if (collegeWithoutRecords > 0) {
      console.log('\n💡 Teams without records might need:')
      console.log('1. Better name matching in the sync function')
      console.log('2. ESPN ID-based matching instead of name matching')
      console.log('3. Manual correction for teams with different names in ESPN')
    }
    
  } catch (error) {
    console.error('❌ Error checking sync results:', error)
  }
}

checkSyncResults()
  .catch(console.error)
  .finally(() => prisma.$disconnect())