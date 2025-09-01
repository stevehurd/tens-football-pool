import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function restoreUMassAndVerify() {
  console.log('🔧 Restoring UMass and verifying against ESPN FBS teams...')
  
  try {
    // First, restore UMass
    console.log('\n1. Restoring UMass Minutemen...')
    
    // Check if UMass still exists
    const existingUMass = await prisma.team.findFirst({
      where: { 
        OR: [
          { name: 'Massachusetts Minutemen' },
          { name: { contains: 'Massachusetts' } },
          { espnId: 113 }
        ]
      }
    })
    
    if (existingUMass) {
      console.log(`⚠️  UMass already exists: ${existingUMass.name}`)
    } else {
      // Restore UMass
      const newUMass = await prisma.team.create({
        data: {
          name: 'Massachusetts Minutemen',
          abbreviation: 'MASS',
          league: 'COLLEGE',
          conference: 'MAC', // Mid-American Conference
          espnId: 113,
          logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/113.png',
          wins: 0,
          losses: 0
        }
      })
      console.log(`✅ Restored UMass Minutemen (ID: ${newUMass.id})`)
    }
    
    // Now let's check ESPN for the actual FBS team count in 2025
    console.log('\n2. Fetching ESPN FBS teams for verification...')
    
    try {
      // Use the limit=200 endpoint to get more teams
      const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200')
      const data = await response.json()
      
      if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
        const allTeams = data.sports[0].leagues[0].teams
        console.log(`📊 ESPN shows ${allTeams.length} total college football teams`)
        
        // Try to determine which are FBS vs FCS
        // FBS teams are typically in major conferences
        const majorConferences = [
          'ACC', 'American', 'Big 12', 'Big Ten', 'Conference USA', 'MAC', 
          'Mountain West', 'Pac-12', 'SEC', 'Sun Belt', 'Independent'
        ]
        
        let fbsCount = 0
        const conferenceCount: { [key: string]: number } = {}
        
        for (const espnTeam of allTeams) {
          const team = espnTeam.team
          
          // Try to determine conference from ESPN data
          // This is tricky because ESPN doesn't always provide conference info in this endpoint
          
          fbsCount++
          
          // For now, just count all teams ESPN returns in this endpoint
          console.log(`${fbsCount}: ${team.displayName} (ESPN ID: ${team.id})`)
          
          if (fbsCount >= 20) {
            console.log('... (truncated, showing first 20)')
            break
          }
        }
        
        console.log(`\nTotal teams from ESPN: ${allTeams.length}`)
        
        // Check our current count
        const currentCount = await prisma.team.count({ where: { league: 'COLLEGE' } })
        console.log(`Our current count: ${currentCount}`)
        
        if (currentCount > 134) {
          console.log(`\nWe have ${currentCount - 134} extra teams`)
          console.log('The standard FBS count is 134 teams for 2024-2025')
          console.log('However, with realignment, this number can fluctuate slightly')
          
          // Let's verify our count by conference
          console.log('\n📋 Our current FBS distribution:')
          const conferences = await prisma.team.groupBy({
            by: ['conference'],
            where: { league: 'COLLEGE' },
            _count: true,
            orderBy: { conference: 'asc' }
          })
          
          let total = 0
          conferences.forEach(conf => {
            console.log(`  ${conf.conference || 'NULL'}: ${conf._count} teams`)
            total += conf._count
          })
          console.log(`  Total: ${total} teams`)
          
          // The discrepancy might be due to recent realignment
          // Let's keep our current count if it's close to 134
          if (currentCount >= 134 && currentCount <= 136) {
            console.log('\n✅ Our count is within reasonable range for current FBS')
            console.log('With ongoing realignment, exact counts can vary slightly')
          }
        }
        
      } else {
        console.log('❌ Unexpected ESPN API response structure')
      }
      
    } catch (error) {
      console.error('❌ Error fetching ESPN data:', error)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

restoreUMassAndVerify()
  .catch(console.error)
  .finally(() => prisma.$disconnect())