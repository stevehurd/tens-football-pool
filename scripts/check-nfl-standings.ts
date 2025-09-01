async function checkNFLStandings() {
  console.log('🏈 Checking NFL standings for regular season records...')
  
  try {
    const response = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/standings')
    const data = await response.json()
    
    console.log('Standings API response keys:', Object.keys(data))
    
    if (data.standings && data.standings.entries) {
      console.log(`Found ${data.standings.entries.length} teams in standings`)
      
      // Check first few teams to see the record structure
      const sampleTeams = data.standings.entries.slice(0, 5)
      
      for (const entry of sampleTeams) {
        if (entry.team) {
          console.log(`\n${entry.team.displayName}:`)
          
          if (entry.stats) {
            entry.stats.forEach((stat: any) => {
              console.log(`  ${stat.name}: ${stat.displayValue || stat.value}`)
            })
          }
          
          // Look specifically for wins/losses
          const overallStat = entry.stats?.find((s: any) => s.name === 'overall')
          if (overallStat) {
            console.log(`  📊 Overall record: ${overallStat.displayValue}`)
          }
        }
      }
      
      // Check if Ravens record matches what we expect (should be less than 3-0 if excluding preseason)
      const ravens = data.standings.entries.find((team: any) => 
        team.team && (team.team.displayName.includes('Ravens') || team.team.id === '33')
      )
      
      if (ravens) {
        console.log(`\n🔍 Ravens specific check:`)
        const overallStat = ravens.stats?.find((s: any) => s.name === 'overall')
        console.log(`  Standings record: ${overallStat?.displayValue}`)
        
        const winsStat = ravens.stats?.find((s: any) => s.name === 'wins')
        const lossesStat = ravens.stats?.find((s: any) => s.name === 'losses')
        console.log(`  Wins: ${winsStat?.value}, Losses: ${lossesStat?.value}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error fetching standings:', error)
  }
  
  // Also check the current date to understand if we're in regular season
  console.log('\n📅 Current date analysis:')
  const now = new Date()
  console.log(`Current date: ${now.toLocaleDateString()}`)
  
  // NFL 2024 regular season dates
  const regularSeasonStart = new Date('2024-09-05')
  const regularSeasonEnd = new Date('2025-01-05')
  
  console.log(`NFL 2024 regular season: ${regularSeasonStart.toLocaleDateString()} - ${regularSeasonEnd.toLocaleDateString()}`)
  console.log(`Are we in regular season? ${now >= regularSeasonStart && now <= regularSeasonEnd}`)
  
  if (now >= regularSeasonStart) {
    console.log('✅ Regular season has started - records should exclude preseason')
  } else {
    console.log('⚠️  Regular season hasn\'t started - only preseason games available')
  }
}

checkNFLStandings()
  .catch(console.error)