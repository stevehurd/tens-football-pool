async function debugESPNAPI() {
  console.log('🔍 Debugging ESPN API responses...')
  
  // Test NFL API
  console.log('\n🏈 Testing NFL API...')
  try {
    const nflResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams')
    const nflData = await nflResponse.json()
    
    console.log('NFL API Response structure:')
    console.log(Object.keys(nflData))
    
    if (nflData.sports && nflData.sports[0]) {
      console.log('Sports[0] keys:', Object.keys(nflData.sports[0]))
      
      if (nflData.sports[0].leagues && nflData.sports[0].leagues[0]) {
        const league = nflData.sports[0].leagues[0]
        console.log('League keys:', Object.keys(league))
        
        if (league.teams && league.teams.length > 0) {
          console.log(`Found ${league.teams.length} NFL teams`)
          
          // Look at first team structure
          const firstTeam = league.teams[0]
          console.log('\nFirst NFL team structure:')
          console.log('Team keys:', Object.keys(firstTeam))
          
          if (firstTeam.team) {
            console.log('Team.team keys:', Object.keys(firstTeam.team))
            console.log(`Team name: ${firstTeam.team.displayName}`)
            
            if (firstTeam.team.record) {
              console.log('Record structure:', JSON.stringify(firstTeam.team.record, null, 2))
            } else {
              console.log('❌ No record found in team object')
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('NFL API Error:', error)
  }
  
  // Test College API
  console.log('\n🎓 Testing College API...')
  try {
    const cfbResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=10')
    const cfbData = await cfbResponse.json()
    
    console.log('CFB API Response structure:')
    console.log(Object.keys(cfbData))
    
    if (cfbData.sports && cfbData.sports[0]) {
      console.log('Sports[0] keys:', Object.keys(cfbData.sports[0]))
      
      if (cfbData.sports[0].leagues && cfbData.sports[0].leagues[0]) {
        const league = cfbData.sports[0].leagues[0]
        console.log('League keys:', Object.keys(league))
        
        if (league.teams && league.teams.length > 0) {
          console.log(`Found ${league.teams.length} CFB teams`)
          
          // Look at first team structure
          const firstTeam = league.teams[0]
          console.log('\nFirst CFB team structure:')
          console.log('Team keys:', Object.keys(firstTeam))
          
          if (firstTeam.team) {
            console.log('Team.team keys:', Object.keys(firstTeam.team))
            console.log(`Team name: ${firstTeam.team.displayName}`)
            
            if (firstTeam.team.record) {
              console.log('Record structure:', JSON.stringify(firstTeam.team.record, null, 2))
            } else {
              console.log('❌ No record found in team object')
            }
            
            // Check if there's season record elsewhere
            console.log('\nLooking for season records...')
            if (firstTeam.team.seasons) {
              console.log('Seasons found:', Object.keys(firstTeam.team.seasons))
            }
            
            if (firstTeam.team.statistics) {
              console.log('Statistics found:', Object.keys(firstTeam.team.statistics))
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('CFB API Error:', error)
  }
  
  // Try a different approach - individual team endpoint
  console.log('\n🔍 Testing individual team endpoint...')
  try {
    // Test Georgia Bulldogs (ESPN ID 61)
    const teamResponse = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams/61')
    const teamData = await teamResponse.json()
    
    console.log('Individual team API response:')
    console.log(Object.keys(teamData))
    
    if (teamData.team) {
      console.log('Team keys:', Object.keys(teamData.team))
      console.log(`Team: ${teamData.team.displayName}`)
      
      if (teamData.team.record) {
        console.log('Record:', JSON.stringify(teamData.team.record, null, 2))
      }
      
      if (teamData.team.seasons) {
        console.log('Seasons available')
        const currentSeason = teamData.team.seasons[0]
        if (currentSeason) {
          console.log('Current season keys:', Object.keys(currentSeason))
          if (currentSeason.record) {
            console.log('Season record:', JSON.stringify(currentSeason.record, null, 2))
          }
        }
      }
    }
    
  } catch (error) {
    console.error('Individual team API Error:', error)
  }
}

debugESPNAPI()
  .catch(console.error)