async function checkFullESPNRoster() {
  console.log('🔍 Checking different ESPN API endpoints...')
  
  // Try different endpoints
  const endpoints = [
    'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams',
    'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200',
    'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?groups=80', // FBS
  ]
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 Testing: ${endpoint}`)
    
    try {
      const response = await fetch(endpoint)
      const data = await response.json()
      
      if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
        const teams = data.sports[0].leagues[0].teams
        console.log(`✅ Found ${teams?.length || 0} teams`)
        
        if (teams && teams.length > 50) {
          // Search for Missouri State in this larger dataset
          console.log('🔍 Searching for Missouri State...')
          
          const missouriMatches = teams.filter((espnTeam: any) => {
            const team = espnTeam.team
            const searchText = `${team.displayName} ${team.name} ${team.nickname} ${team.location}`.toLowerCase()
            
            return searchText.includes('missouri')
          })
          
          console.log(`Found ${missouriMatches.length} Missouri matches:`)
          missouriMatches.forEach((espnTeam: any) => {
            const team = espnTeam.team
            console.log(`  - ${team.displayName} (${team.name} ${team.nickname}) - ESPN ID: ${team.id}`)
            console.log(`    Location: ${team.location}`)
          })
        }
      } else {
        console.log('❌ Unexpected response structure')
        console.log(Object.keys(data))
      }
    } catch (error) {
      console.error(`❌ Error: ${error}`)
    }
  }
  
  // Also try searching ESPN directly for Missouri State
  console.log('\n🔍 Trying to search ESPN for Missouri State directly...')
  try {
    // Sometimes teams are in different divisions, let's try FCS
    const fcsUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?groups=81' // FCS
    const response = await fetch(fcsUrl)
    const data = await response.json()
    
    if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
      const teams = data.sports[0].leagues[0].teams
      console.log(`📊 FCS teams found: ${teams?.length || 0}`)
      
      if (teams) {
        const missouriMatches = teams.filter((espnTeam: any) => {
          const team = espnTeam.team
          const searchText = `${team.displayName} ${team.name} ${team.nickname} ${team.location}`.toLowerCase()
          
          return searchText.includes('missouri')
        })
        
        console.log(`Found ${missouriMatches.length} Missouri matches in FCS:`)
        missouriMatches.forEach((espnTeam: any) => {
          const team = espnTeam.team
          console.log(`  - ${team.displayName} (${team.name} ${team.nickname}) - ESPN ID: ${team.id}`)
          console.log(`    Location: ${team.location}`)
        })
      }
    }
  } catch (error) {
    console.error(`❌ FCS search error: ${error}`)
  }
}

checkFullESPNRoster()
  .catch(console.error)