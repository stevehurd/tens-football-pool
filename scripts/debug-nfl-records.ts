async function debugNFLRecords() {
  console.log('🔍 Debugging NFL record types to exclude preseason...')
  
  try {
    // Test a few NFL teams to see the record structure
    const testTeams = [
      { name: 'Kansas City Chiefs', id: 12 },
      { name: 'Baltimore Ravens', id: 33 },
      { name: 'Buffalo Bills', id: 2 }
    ]
    
    for (const team of testTeams) {
      console.log(`\n🏈 ${team.name} (ID: ${team.id})`)
      
      const response = await fetch(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${team.id}`)
      const data = await response.json()
      
      if (data.team && data.team.record && data.team.record.items) {
        console.log(`Found ${data.team.record.items.length} record types:`)
        
        data.team.record.items.forEach((item: any, index: number) => {
          console.log(`\n  Record ${index + 1}:`)
          console.log(`    Type: ${item.type}`)
          console.log(`    Description: ${item.description}`)
          console.log(`    Summary: ${item.summary}`)
          
          if (item.stats) {
            const wins = item.stats.find((s: any) => s.name === 'wins')?.value || 0
            const losses = item.stats.find((s: any) => s.name === 'losses')?.value || 0
            const ties = item.stats.find((s: any) => s.name === 'ties')?.value || 0
            console.log(`    W-L-T: ${wins}-${losses}-${ties}`)
            
            // Show all stat types for debugging
            console.log(`    Available stats: ${item.stats.map((s: any) => s.name).join(', ')}`)
          }
        })
      } else {
        console.log('❌ No record data found')
      }
    }
    
    // Check what the current date is and if NFL regular season has started
    console.log('\n📅 Current season info:')
    console.log(`Date: ${new Date().toLocaleDateString()}`)
    console.log('NFL 2024 regular season: September 5, 2024 - January 5, 2025')
    console.log('NFL preseason: August 2024')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

debugNFLRecords()
  .catch(console.error)