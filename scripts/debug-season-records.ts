async function debugSeasonRecords() {
  console.log('🔍 Checking for season-specific NFL records...')
  
  try {
    // Test Ravens (should have 3-0 record if including preseason)
    const teamId = 33 // Ravens
    
    // Try different endpoints and parameters
    const endpoints = [
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}`,
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}?season=2024&seasontype=2`, // Regular season
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}?season=2024&seasontype=1`, // Preseason
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}?season=2024&seasontype=3`, // Postseason
    ]
    
    for (const url of endpoints) {
      console.log(`\n📡 Testing: ${url}`)
      
      try {
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.team && data.team.record) {
          console.log(`✅ Response received for ${data.team.displayName}`)
          
          if (data.team.record.items) {
            data.team.record.items.forEach((item: any, index: number) => {
              const wins = item.stats?.find((s: any) => s.name === 'wins')?.value || 0
              const losses = item.stats?.find((s: any) => s.name === 'losses')?.value || 0
              const ties = item.stats?.find((s: any) => s.name === 'ties')?.value || 0
              
              console.log(`  Record ${index + 1}: ${item.type} - ${wins}-${losses}-${ties} (${item.description || 'No description'})`)
            })
          }
          
          // Also check if there are seasons data
          if (data.team.seasons) {
            console.log(`  Seasons available: ${data.team.seasons.length}`)
            if (data.team.seasons[0] && data.team.seasons[0].record) {
              console.log(`  Season record structure:`, Object.keys(data.team.seasons[0].record))
            }
          }
        } else {
          console.log(`❌ No record data`)
        }
        
      } catch (error) {
        console.log(`❌ Error: ${error}`)
      }
    }
    
    // Also try the scoreboard/standings endpoint which might have regular season only
    console.log(`\n📡 Testing standings endpoint...`)
    try {
      const standingsUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/standings'
      const response = await fetch(standingsUrl)
      const data = await response.json()
      
      if (data.standings) {
        console.log(`✅ Found standings data`)
        
        // Look for Ravens in standings
        const ravens = data.standings.entries?.find((team: any) => 
          team.team && team.team.id === '33'
        )
        
        if (ravens) {
          console.log(`  Ravens standings record:`)
          console.log(`    Overall: ${ravens.stats.find((s: any) => s.name === 'overall')?.displayValue}`)
          console.log(`    Stats available:`, ravens.stats.map((s: any) => s.name).join(', '))
        }
      }
      
    } catch (error) {
      console.log(`❌ Standings error: ${error}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugSeasonRecords()
  .catch(console.error)