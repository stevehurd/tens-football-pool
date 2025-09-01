import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ESPNTeamDetail {
  team: {
    id: string
    displayName: string
    logos?: Array<{ href: string }>
  }
}

async function fetchTeamLogo(espnId: number): Promise<string | null> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/${espnId}`
    console.log(`  Fetching logo from: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`  HTTP ${response.status} - skipping`)
      return null
    }
    
    const data: ESPNTeamDetail = await response.json()
    
    if (data.team?.logos && data.team.logos.length > 0) {
      // Get the first (usually highest quality) logo
      const logoUrl = data.team.logos[0].href
      console.log(`  Found logo: ${logoUrl}`)
      return logoUrl
    }
    
    console.log(`  No logos found in API response`)
    return null
  } catch (error) {
    console.log(`  Error fetching logo: ${error}`)
    return null
  }
}

async function updateMissingLogos() {
  console.log('🎨 Fetching missing team logos from ESPN API...')
  
  // Get teams without logos
  const teamsWithoutLogos = await prisma.team.findMany({
    where: {
      logoUrl: null,
      espnId: { not: null }
    },
    select: {
      id: true,
      name: true,
      espnId: true,
      league: true
    }
  })
  
  console.log(`Found ${teamsWithoutLogos.length} teams without logos`)
  
  let updatedCount = 0
  let errorCount = 0
  
  for (const team of teamsWithoutLogos) {
    console.log(`\n🔍 ${team.name} (ESPN ID: ${team.espnId})`)
    
    if (!team.espnId) {
      console.log(`  No ESPN ID - skipping`)
      errorCount++
      continue
    }
    
    const logoUrl = await fetchTeamLogo(team.espnId)
    
    if (logoUrl) {
      try {
        await prisma.team.update({
          where: { id: team.id },
          data: { logoUrl }
        })
        
        console.log(`  ✅ Updated ${team.name} with logo`)
        updatedCount++
      } catch (error) {
        console.log(`  ❌ Database error: ${error}`)
        errorCount++
      }
    } else {
      console.log(`  ⚠️ No logo found for ${team.name}`)
      errorCount++
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 200))
  }
  
  console.log(`\n📊 Logo update complete:`)
  console.log(`✅ Updated: ${updatedCount} teams`)
  console.log(`❌ Failed/No logo: ${errorCount} teams`)
  
  // Final verification
  const remainingWithoutLogos = await prisma.team.count({
    where: { logoUrl: null }
  })
  
  console.log(`📈 Teams still without logos: ${remainingWithoutLogos}`)
  
  if (remainingWithoutLogos === 0) {
    console.log('🎉 SUCCESS: All teams now have logo URLs!')
  } else {
    // Show teams still missing logos
    const stillMissing = await prisma.team.findMany({
      where: { logoUrl: null },
      select: { name: true, league: true, espnId: true }
    })
    
    console.log('\n⚠️ Teams still without logos:')
    stillMissing.forEach(team => {
      console.log(`  - ${team.name} (${team.league}) ${team.espnId ? `ESPN ID: ${team.espnId}` : 'No ESPN ID'}`)
    })
  }
}

async function main() {
  try {
    await updateMissingLogos()
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