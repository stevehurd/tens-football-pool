import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateCollegeConferences() {
  console.log('🎓 Updating college team conferences from ESPN API...')
  
  const collegeTeams = await prisma.team.findMany({
    where: { league: 'COLLEGE' }
  })
  
  console.log(`Found ${collegeTeams.length} college teams to update`)
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const team of collegeTeams) {
    if (!team.espnId) {
      console.log(`⚠️ Skipping ${team.name} - no ESPN ID`)
      continue
    }
    
    try {
      const detailUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${team.espnId}`
      console.log(`Fetching conference for ${team.name} (ESPN ID: ${team.espnId})`)
      
      const response = await fetch(detailUrl)
      if (response.ok) {
        const data = await response.json()
        
        // Try different paths to find conference information
        let conference = null
        
        // Path 1: team.groups[0].name (most common)
        if (data.team?.groups?.[0]?.name) {
          conference = data.team.groups[0].name
        }
        // Path 2: team.conference.name
        else if (data.team?.conference?.name) {
          conference = data.team.conference.name
        }
        // Path 3: Look in team.groups for conference info
        else if (data.team?.groups?.length > 0) {
          for (const group of data.team.groups) {
            if (group.name && !group.name.includes('Division')) {
              conference = group.name
              break
            }
          }
        }
        
        if (conference) {
          await prisma.team.update({
            where: { id: team.id },
            data: { conference }
          })
          console.log(`✅ Updated ${team.name} - ${conference}`)
          updatedCount++
        } else {
          console.log(`❌ No conference found for ${team.name}`)
          errorCount++
        }
      } else {
        console.log(`❌ Failed to fetch data for ${team.name} (HTTP ${response.status})`)
        errorCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 150))
      
    } catch (error) {
      console.log(`❌ Error fetching conference for ${team.name}: ${error}`)
      errorCount++
    }
  }
  
  console.log(`\n📊 Conference update complete:`)
  console.log(`✅ Updated: ${updatedCount} teams`)
  console.log(`❌ Errors: ${errorCount} teams`)
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