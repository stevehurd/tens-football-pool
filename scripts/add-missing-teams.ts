import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ESPNTeam {
  team: {
    id: string
    uid: string
    slug: string
    abbreviation: string
    displayName: string
    shortDisplayName: string
    name: string
    nickname: string
    location: string
    color: string
    alternateColor: string
    isActive: boolean
    logos: Array<{
      href: string
      alt: string
      rel: string[]
      width: number
      height: number
    }>
  }
}

async function addMissingTeams() {
  console.log('🔍 Searching for missing Conference USA teams...')
  
  const missingTeams = [
    'Missouri State Bears',
    'Delaware Blue Hens'
  ]
  
  for (const teamName of missingTeams) {
    console.log(`\n📡 Searching for ${teamName}...`)
    
    try {
      // Search ESPN API for college teams
      const searchUrl = `https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams`
      const response = await fetch(searchUrl)
      
      if (!response.ok) {
        throw new Error(`ESPN API error: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`📊 Found ${data.sports[0].leagues[0].teams.length} total college teams`)
      
      // Look for our specific teams
      const allTeams: ESPNTeam[] = data.sports[0].leagues[0].teams
      
      let foundTeam: ESPNTeam | undefined
      
      // Try different matching strategies
      for (const espnTeam of allTeams) {
        const team = espnTeam.team
        
        if (
          team.displayName.toLowerCase().includes('missouri state') ||
          team.displayName.toLowerCase().includes('delaware') ||
          team.name.toLowerCase().includes('missouri state') ||
          team.name.toLowerCase().includes('delaware') ||
          team.location.toLowerCase().includes('missouri state') ||
          team.location.toLowerCase().includes('delaware')
        ) {
          console.log(`🎯 Potential match: ${team.displayName} (${team.name} ${team.nickname})`)
          
          // Check if this matches our target
          if (
            (teamName.includes('Missouri State') && team.displayName.toLowerCase().includes('missouri state')) ||
            (teamName.includes('Delaware') && team.displayName.toLowerCase().includes('delaware') && !team.displayName.toLowerCase().includes('state'))
          ) {
            foundTeam = espnTeam
            break
          }
        }
      }
      
      if (!foundTeam) {
        console.log(`❌ Could not find ${teamName} in ESPN API`)
        continue
      }
      
      const team = foundTeam.team
      console.log(`✅ Found: ${team.displayName}`)
      console.log(`   ESPN ID: ${team.id}`)
      console.log(`   Abbreviation: ${team.abbreviation}`)
      console.log(`   Location: ${team.location}`)
      console.log(`   Nickname: ${team.nickname}`)
      
      // Get the best logo
      let logoUrl = ''
      if (team.logos && team.logos.length > 0) {
        // Find the best quality logo
        const bestLogo = team.logos
          .filter(logo => logo.rel && logo.rel.includes('default'))
          .sort((a, b) => (b.width * b.height) - (a.width * a.height))[0] ||
          team.logos[0]
        
        logoUrl = bestLogo.href
        console.log(`   Logo: ${logoUrl}`)
      }
      
      // Check if team already exists
      const existingTeam = await prisma.team.findFirst({
        where: {
          OR: [
            { name: team.displayName },
            { espnId: parseInt(team.id) }
          ]
        }
      })
      
      if (existingTeam) {
        console.log(`⚠️  Team ${team.displayName} already exists in database`)
        continue
      }
      
      // Add to database
      console.log(`📝 Adding ${team.displayName} to database...`)
      
      const newTeam = await prisma.team.create({
        data: {
          name: team.displayName,
          abbreviation: team.abbreviation,
          league: 'COLLEGE',
          conference: 'Conference USA', // Both teams should be in Conference USA
          espnId: parseInt(team.id),
          logoUrl: logoUrl,
          wins: 0,
          losses: 0
        }
      })
      
      console.log(`✅ Successfully added ${newTeam.name} (ID: ${newTeam.id})`)
      
    } catch (error) {
      console.error(`❌ Error adding ${teamName}:`, error)
    }
  }
  
  // Final count check
  console.log('\n📊 Final team counts:')
  const totalTeams = await prisma.team.count()
  const nflTeams = await prisma.team.count({ where: { league: 'NFL' } })
  const collegeTeams = await prisma.team.count({ where: { league: 'COLLEGE' } })
  
  console.log(`Total teams: ${totalTeams}`)
  console.log(`NFL teams: ${nflTeams}`)
  console.log(`College teams: ${collegeTeams}`)
  
  if (collegeTeams === 134) {
    console.log('🎉 Perfect! We now have exactly 134 FBS teams')
  } else {
    console.log(`⚠️  Expected 134 college teams, but have ${collegeTeams}`)
  }
}

addMissingTeams()
  .catch(console.error)
  .finally(() => prisma.$disconnect())