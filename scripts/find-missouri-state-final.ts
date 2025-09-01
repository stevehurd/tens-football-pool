import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function findMissouriStateFinal() {
  console.log('🔍 Final search for Missouri State Bears...')
  
  try {
    // Use the endpoint that gives us 200 teams
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200')
    const data = await response.json()
    
    const allTeams = data.sports[0].leagues[0].teams
    console.log(`📊 Total teams available: ${allTeams.length}`)
    
    // Search more broadly for Missouri State
    console.log('\n🔍 Searching for Missouri State variations (broader search)...')
    
    const candidates = allTeams.filter((espnTeam: any) => {
      const team = espnTeam.team
      const searchText = `${team.displayName} ${team.name} ${team.nickname} ${team.location} ${team.abbreviation}`.toLowerCase()
      
      return (
        searchText.includes('missouri state') ||
        searchText.includes('mo state') ||
        searchText.includes('missouri st') ||
        (searchText.includes('missouri') && searchText.includes('bears')) ||
        (searchText.includes('state') && searchText.includes('bears') && searchText.includes('missouri'))
      )
    })
    
    console.log(`Found ${candidates.length} potential candidates:`)
    
    for (const espnTeam of candidates) {
      const team = espnTeam.team
      console.log(`\n📋 Candidate: ${team.displayName}`)
      console.log(`   Full Name: ${team.name} ${team.nickname}`)
      console.log(`   Location: ${team.location}`)
      console.log(`   ESPN ID: ${team.id}`)
      console.log(`   Abbreviation: ${team.abbreviation}`)
      
      // Get logo if available
      if (team.logos && team.logos.length > 0) {
        console.log(`   Logo: ${team.logos[0].href}`)
      }
    }
    
    // Also check if we already have the right team under a different name
    console.log('\n📋 Checking if we already have Missouri State under a different name...')
    
    const allDbTeams = await prisma.team.findMany({
      where: { league: 'COLLEGE' },
      select: { name: true, espnId: true, conference: true }
    })
    
    // Check if any of our candidates are already in the database
    for (const espnTeam of candidates) {
      const team = espnTeam.team
      const existingTeam = allDbTeams.find(dbTeam => 
        dbTeam.espnId === parseInt(team.id) || 
        dbTeam.name.toLowerCase().includes(team.displayName.toLowerCase()) ||
        team.displayName.toLowerCase().includes(dbTeam.name.toLowerCase())
      )
      
      if (existingTeam) {
        console.log(`✅ Found match: ${team.displayName} is already in DB as "${existingTeam.name}" in ${existingTeam.conference}`)
      } else {
        console.log(`❌ ${team.displayName} is NOT in our database`)
      }
    }
    
    // Let's also specifically search for "Missouri State" as that's what the user mentioned
    console.log('\n🎯 Direct search for "Missouri State"...')
    
    const directMatch = allTeams.find((espnTeam: any) => {
      const team = espnTeam.team
      return team.displayName.toLowerCase() === 'missouri state bears' || 
             team.displayName.toLowerCase().includes('missouri state')
    })
    
    if (directMatch) {
      console.log('✅ Found direct match for Missouri State!')
      console.log(directMatch.team)
    } else {
      console.log('❌ No direct match found for "Missouri State"')
      
      // Check if Missouri State is actually an FCS team (not FBS)
      console.log('\n🔍 Checking if Missouri State is FCS...')
      
      try {
        // Let's also try without the groups parameter to get all divisions
        const allDivisionsResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=500')
        const allDivisionsData = await allDivisionsResponse.json()
        
        const allDivisionTeams = allDivisionsData.sports[0].leagues[0].teams
        console.log(`📊 All divisions teams: ${allDivisionTeams.length}`)
        
        const missouriStateMatch = allDivisionTeams.find((espnTeam: any) => {
          const team = espnTeam.team
          return team.displayName.toLowerCase().includes('missouri state')
        })
        
        if (missouriStateMatch) {
          console.log('✅ Found Missouri State in all divisions!')
          console.log(missouriStateMatch.team)
        } else {
          console.log('❌ Missouri State not found even in all divisions')
        }
        
      } catch (error) {
        console.error('Error searching all divisions:', error)
      }
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

findMissouriStateFinal()
  .catch(console.error)
  .finally(() => prisma.$disconnect())