import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyFinalRecords() {
  console.log('🔍 Verifying final team records after sync...')
  
  try {
    // Check NFL teams (should all be 0-0 since regular season hasn't started)
    console.log('\n🏈 NFL Team Records (should all be 0-0):')
    const nflTeams = await prisma.team.findMany({
      where: { league: 'NFL' },
      select: { name: true, wins: true, losses: true },
      orderBy: { name: 'asc' }
    })
    
    let nflCorrect = 0
    let nflIncorrect = 0
    
    nflTeams.forEach(team => {
      if (team.wins === 0 && team.losses === 0) {
        console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses}`)
        nflCorrect++
      } else {
        console.log(`  ❌ ${team.name}: ${team.wins}-${team.losses} (should be 0-0)`)
        nflIncorrect++
      }
    })
    
    console.log(`\nNFL Summary: ${nflCorrect} correct (0-0), ${nflIncorrect} incorrect`)
    
    // Check college teams (should have actual records)
    console.log('\n🎓 College Team Records (showing teams with records):')
    const collegeTeams = await prisma.team.findMany({
      where: { 
        league: 'COLLEGE',
        OR: [
          { wins: { gt: 0 } },
          { losses: { gt: 0 } }
        ]
      },
      select: { name: true, wins: true, losses: true, conference: true },
      orderBy: { wins: 'desc' }
    })
    
    console.log(`Found ${collegeTeams.length} college teams with records:`)
    collegeTeams.slice(0, 10).forEach(team => {
      console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses} (${team.conference})`)
    })
    
    if (collegeTeams.length > 10) {
      console.log(`  ... and ${collegeTeams.length - 10} more teams`)
    }
    
    // Check total counts
    console.log('\n📊 Summary:')
    const totalTeams = await prisma.team.count()
    const nflTotal = await prisma.team.count({ where: { league: 'NFL' } })
    const collegeTotal = await prisma.team.count({ where: { league: 'COLLEGE' } })
    
    console.log(`Total teams: ${totalTeams}`)
    console.log(`NFL teams: ${nflTotal} (all should be 0-0)`)
    console.log(`College teams: ${collegeTotal} (should have actual records)`)
    
    // Check specific newly added teams
    console.log('\n🔍 Checking recently added teams:')
    const specificTeams = [
      'Delaware Blue Hens',
      'Missouri State Bears'
    ]
    
    for (const teamName of specificTeams) {
      const team = await prisma.team.findFirst({
        where: { name: teamName },
        select: { name: true, wins: true, losses: true, conference: true, espnId: true }
      })
      
      if (team) {
        console.log(`  ✅ ${team.name}: ${team.wins}-${team.losses} (${team.conference}) - ESPN ID: ${team.espnId}`)
      } else {
        console.log(`  ❌ ${teamName}: Not found`)
      }
    }
    
    console.log('\n🎉 Sync verification complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

verifyFinalRecords()
  .catch(console.error)
  .finally(() => prisma.$disconnect())