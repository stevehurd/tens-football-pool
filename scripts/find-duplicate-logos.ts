import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findDuplicateLogos() {
  console.log('🔍 Finding duplicate team logos...')
  
  try {
    // Get all teams with logos
    const teams = await prisma.team.findMany({
      where: { 
        logoUrl: { not: null },
        league: 'COLLEGE'
      },
      select: { 
        id: true,
        name: true, 
        logoUrl: true, 
        conference: true,
        espnId: true 
      },
      orderBy: { name: 'asc' }
    })
    
    console.log(`Found ${teams.length} college teams with logos`)
    
    // Group by logo URL to find duplicates
    const logoGroups: { [key: string]: any[] } = {}
    teams.forEach(team => {
      if (team.logoUrl) {
        if (!logoGroups[team.logoUrl]) logoGroups[team.logoUrl] = []
        logoGroups[team.logoUrl].push(team)
      }
    })
    
    // Find duplicates
    const duplicateLogos = Object.entries(logoGroups).filter(([url, teams]) => teams.length > 1)
    
    console.log(`\n🔍 Found ${duplicateLogos.length} duplicate logo URLs:`)
    
    duplicateLogos.forEach(([logoUrl, duplicateTeams], index) => {
      console.log(`\n${index + 1}. Logo: ${logoUrl}`)
      console.log(`   Used by ${duplicateTeams.length} teams:`)
      
      duplicateTeams.forEach(team => {
        console.log(`     - ${team.name} (${team.conference}) - ESPN ID: ${team.espnId}`)
      })
      
      // Suggest which one should keep the logo
      const primaryTeam = duplicateTeams.find(team => 
        team.name.toLowerCase().includes('florida') && !team.name.toLowerCase().includes('international') ||
        team.name.toLowerCase().includes('miami') && !team.name.toLowerCase().includes('ohio') ||
        team.name.toLowerCase().includes('louisiana') && !team.name.toLowerCase().includes('monroe') ||
        team.name.toLowerCase() === team.name.toLowerCase() // fallback
      ) || duplicateTeams[0]
      
      console.log(`   📝 Suggestion: Keep logo for "${primaryTeam.name}"`)
    })
    
    // Also check for teams that might have wrong logos based on ESPN ID mismatch
    console.log(`\n🔍 Checking for potential ESPN ID/logo mismatches...`)
    
    const suspiciousTeams = teams.filter(team => {
      if (!team.logoUrl || !team.espnId) return false
      
      // Extract ESPN ID from logo URL if possible
      const logoIdMatch = team.logoUrl.match(/\/(\d+)\.png/)
      if (logoIdMatch) {
        const logoEspnId = parseInt(logoIdMatch[1])
        if (logoEspnId !== team.espnId) {
          return true
        }
      }
      return false
    })
    
    if (suspiciousTeams.length > 0) {
      console.log(`\nFound ${suspiciousTeams.length} teams with potential ESPN ID/logo mismatches:`)
      suspiciousTeams.forEach(team => {
        const logoIdMatch = team.logoUrl?.match(/\/(\d+)\.png/)
        const logoEspnId = logoIdMatch ? logoIdMatch[1] : 'unknown'
        console.log(`  - ${team.name}: ESPN ID ${team.espnId}, but logo has ID ${logoEspnId}`)
        console.log(`    Logo: ${team.logoUrl}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

findDuplicateLogos()
  .catch(console.error)
  .finally(() => prisma.$disconnect())