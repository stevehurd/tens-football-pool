import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fixTeamLogos() {
  console.log('🔧 Fixing team logos to match correct ESPN IDs...')
  
  try {
    // Get all teams with ESPN IDs
    const teams = await prisma.team.findMany({
      where: { 
        espnId: { not: null },
        league: 'COLLEGE'
      },
      select: { 
        id: true,
        name: true, 
        logoUrl: true,
        espnId: true 
      }
    })
    
    console.log(`Found ${teams.length} college teams with ESPN IDs`)
    
    let fixedCount = 0
    let checkedCount = 0
    
    for (const team of teams) {
      if (!team.espnId) continue
      
      checkedCount++
      
      // Generate the correct logo URL based on ESPN ID
      const correctLogoUrl = `https://a.espncdn.com/i/teamlogos/ncaa/500/${team.espnId}.png`
      
      // Check if current logo URL is wrong
      const needsFix = team.logoUrl !== correctLogoUrl
      
      if (needsFix) {
        console.log(`🔧 ${team.name}:`)
        console.log(`   Old: ${team.logoUrl}`)
        console.log(`   New: ${correctLogoUrl}`)
        
        // Verify the new logo exists by attempting to fetch it
        try {
          const response = await fetch(correctLogoUrl, { method: 'HEAD' })
          
          if (response.ok) {
            // Update the logo URL
            await prisma.team.update({
              where: { id: team.id },
              data: { logoUrl: correctLogoUrl }
            })
            
            console.log(`   ✅ Updated successfully`)
            fixedCount++
          } else {
            console.log(`   ⚠️  Logo not found at ESPN (${response.status}), keeping existing logo`)
          }
        } catch (error) {
          console.log(`   ❌ Error checking logo: ${error}`)
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        console.log(`✅ ${team.name}: Logo already correct`)
      }
    }
    
    console.log(`\n📊 Logo Fix Results:`)
    console.log(`✅ Teams checked: ${checkedCount}`)
    console.log(`🔧 Teams fixed: ${fixedCount}`)
    console.log(`📈 Success rate: ${((fixedCount / checkedCount) * 100).toFixed(1)}%`)
    
    // Verify no more duplicates
    console.log('\n🔍 Checking for remaining duplicates...')
    
    const updatedTeams = await prisma.team.findMany({
      where: { 
        logoUrl: { not: null },
        league: 'COLLEGE'
      },
      select: { name: true, logoUrl: true }
    })
    
    const logoGroups: { [key: string]: string[] } = {}
    updatedTeams.forEach(team => {
      if (team.logoUrl) {
        if (!logoGroups[team.logoUrl]) logoGroups[team.logoUrl] = []
        logoGroups[team.logoUrl].push(team.name)
      }
    })
    
    const remainingDuplicates = Object.entries(logoGroups).filter(([url, teams]) => teams.length > 1)
    
    if (remainingDuplicates.length > 0) {
      console.log(`⚠️  Still have ${remainingDuplicates.length} duplicate logos:`)
      remainingDuplicates.forEach(([logoUrl, teamNames]) => {
        console.log(`   ${logoUrl}: ${teamNames.join(', ')}`)
      })
    } else {
      console.log(`✅ No duplicate logos remaining!`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

fixTeamLogos()
  .catch(console.error)
  .finally(() => prisma.$disconnect())