import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetNFLToZero() {
  console.log('🏈 Resetting NFL teams to 0-0 until regular season starts...')
  
  // NFL 2025 regular season starts September 4, 2025
  const regularSeasonStart = new Date('2025-09-04')
  const today = new Date()
  
  console.log(`Today: ${today.toDateString()}`)
  console.log(`NFL 2025 regular season starts: ${regularSeasonStart.toDateString()}`)
  console.log(`Regular season started: ${today >= regularSeasonStart}`)
  
  if (today < regularSeasonStart) {
    console.log('⚠️  Regular season hasn\'t started yet - resetting all NFL teams to 0-0')
    
    try {
      const result = await prisma.team.updateMany({
        where: { league: 'NFL' },
        data: {
          wins: 0,
          losses: 0
        }
      })
      
      console.log(`✅ Reset ${result.count} NFL teams to 0-0 records`)
      
      // Show the reset teams
      const nflTeams = await prisma.team.findMany({
        where: { league: 'NFL' },
        select: { name: true, wins: true, losses: true },
        orderBy: { name: 'asc' }
      })
      
      console.log('\n🏈 NFL teams now showing:')
      nflTeams.forEach(team => {
        console.log(`  ${team.name}: ${team.wins}-${team.losses}`)
      })
      
    } catch (error) {
      console.error('❌ Error resetting NFL teams:', error)
    }
    
  } else {
    console.log('✅ Regular season has started - NFL records should show actual games')
  }
  
  console.log('\n💡 The sync will automatically show regular season records once the season begins on 09/04/25')
}

resetNFLToZero()
  .catch(console.error)
  .finally(() => prisma.$disconnect())