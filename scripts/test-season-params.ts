async function testSeasonParams() {
  console.log('🔍 Testing different season parameters for NFL records...')
  
  const teamId = 12 // Chiefs - should have fewer wins if we exclude preseason
  
  // Test different season parameters
  const testUrls = [
    {
      name: 'Default (all games)',
      url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}`
    },
    {
      name: 'Regular Season 2024',
      url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}?season=2024&seasontype=2`
    },
    {
      name: 'Current Year Regular Season', 
      url: `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}?seasontype=2`
    },
    {
      name: 'Scoreboard approach',
      url: 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
    }
  ]
  
  for (const test of testUrls) {
    console.log(`\n📡 ${test.name}: ${test.url}`)
    
    try {
      const response = await fetch(test.url)
      const data = await response.json()
      
      if (test.name === 'Scoreboard approach') {
        // Different structure for scoreboard
        if (data.leagues && data.leagues[0] && data.leagues[0].standings) {
          console.log('✅ Found standings in scoreboard')
          const standings = data.leagues[0].standings.entries
          
          const chiefs = standings?.find((team: any) => 
            team.team && team.team.displayName.includes('Chiefs')
          )
          
          if (chiefs) {
            const record = chiefs.stats?.find((s: any) => s.name === 'overall')
            console.log(`  Chiefs record from standings: ${record?.displayValue}`)
          }
        } else {
          console.log('❌ No standings found in scoreboard')
        }
      } else {
        // Regular team endpoint
        if (data.team && data.team.record && data.team.record.items) {
          const totalRecord = data.team.record.items.find((item: any) => item.type === 'total')
          if (totalRecord && totalRecord.stats) {
            const wins = totalRecord.stats.find((s: any) => s.name === 'wins')?.value || 0
            const losses = totalRecord.stats.find((s: any) => s.name === 'losses')?.value || 0
            const ties = totalRecord.stats.find((s: any) => s.name === 'ties')?.value || 0
            
            console.log(`✅ Chiefs record: ${wins}-${losses}-${ties}`)
          }
        } else {
          console.log('❌ No record data found')
        }
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error}`)
    }
  }
  
  // Also try to get current week info to understand what games are counting
  console.log(`\n📅 Checking current NFL week...`)
  try {
    const scoreboardUrl = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard'
    const response = await fetch(scoreboardUrl)
    const data = await response.json()
    
    if (data.week) {
      console.log(`Current week: ${data.week.number}`)
      console.log(`Week text: ${data.week.text}`)
    }
    
    if (data.season) {
      console.log(`Season: ${data.season.year}`)
      console.log(`Season type: ${data.season.type}`)
    }
    
    // Check if there are games today/recent
    if (data.events && data.events.length > 0) {
      console.log(`Found ${data.events.length} games in current scoreboard`)
      const recentGame = data.events[0]
      console.log(`Sample game: ${recentGame.shortName} (${recentGame.status?.type?.description})`)
    }
    
  } catch (error) {
    console.log(`❌ Scoreboard error: ${error}`)
  }
}

testSeasonParams()
  .catch(console.error)