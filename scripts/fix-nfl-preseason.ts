import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function fetchNFLRegularSeasonRecord(espnId: number): Promise<{ wins: number, losses: number, ties: number } | null> {
  try {
    // Try to get the most recent completed regular season (2024)
    // or current regular season if it has started
    const currentYear = new Date().getFullYear()
    const seasonYear = currentYear // Use current year, ESPN should handle the logic
    
    // Season type 2 = Regular season only (excludes preseason)
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${espnId}?season=${seasonYear}&seasontype=2`
    console.log(`Fetching regular season: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) {
      console.log(`❌ HTTP ${response.status} for ESPN ID ${espnId}`)
      return null
    }
    
    const data = await response.json()
    
    if (data.team && data.team.record && data.team.record.items) {
      const recordItem = data.team.record.items.find((item: any) => 
        item.type === 'total' || item.description === 'Overall Record'
      )
      
      if (recordItem && recordItem.stats) {
        let wins = 0, losses = 0, ties = 0
        
        for (const stat of recordItem.stats) {
          switch (stat.name?.toLowerCase()) {
            case 'wins':
              wins = stat.value || 0
              break
            case 'losses':
              losses = stat.value || 0
              break
            case 'ties':
              ties = stat.value || 0
              break
          }
        }
        
        // If no games played yet in current season, try previous season
        if (wins === 0 && losses === 0 && ties === 0) {
          console.log(`⚠️  No regular season games yet for ${data.team.displayName}, trying previous season...`)
          return await fetchPreviousSeasonRecord(espnId, seasonYear - 1)
        }
        
        console.log(`✅ ${data.team.displayName}: ${wins}-${losses}-${ties} (regular season only)`)
        return { wins, losses, ties }
      }
    }
    
    console.log(`⚠️ No record found for ESPN ID ${espnId}`)
    return null
    
  } catch (error) {
    console.error(`❌ Error fetching ESPN ID ${espnId}:`, error)
    return null
  }
}

async function fetchPreviousSeasonRecord(espnId: number, year: number): Promise<{ wins: number, losses: number, ties: number } | null> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${espnId}?season=${year}&seasontype=2`
    console.log(`  Trying ${year} season: ${url}`)
    
    const response = await fetch(url)
    if (!response.ok) return null
    
    const data = await response.json()
    
    if (data.team && data.team.record && data.team.record.items) {
      const recordItem = data.team.record.items.find((item: any) => item.type === 'total')
      
      if (recordItem && recordItem.stats) {
        let wins = 0, losses = 0, ties = 0
        
        for (const stat of recordItem.stats) {
          switch (stat.name?.toLowerCase()) {
            case 'wins':
              wins = stat.value || 0
              break
            case 'losses':
              losses = stat.value || 0
              break
            case 'ties':
              ties = stat.value || 0
              break
          }
        }
        
        console.log(`  ✅ ${data.team.displayName}: ${wins}-${losses}-${ties} (${year} final)`)
        return { wins, losses, ties }
      }
    }
    
    return null
  } catch (error) {
    return null
  }
}

async function fixNFLPreseasonRecords() {
  console.log('🏈 Fixing NFL records to exclude preseason games...')
  
  try {
    // Get all NFL teams
    const nflTeams = await prisma.team.findMany({
      where: {
        league: 'NFL',
        espnId: { not: null }
      },
      select: {
        id: true,
        name: true,
        espnId: true,
        wins: true,
        losses: true
      }
    })
    
    console.log(`Found ${nflTeams.length} NFL teams to update`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const team of nflTeams) {
      if (!team.espnId) continue
      
      const record = await fetchNFLRegularSeasonRecord(team.espnId)
      
      if (record) {
        try {
          await prisma.team.update({
            where: { id: team.id },
            data: {
              wins: record.wins,
              losses: record.losses
            }
          })
          successCount++
        } catch (updateError) {
          console.error(`❌ Failed to update ${team.name}:`, updateError)
          errorCount++
        }
      } else {
        console.log(`❌ No regular season record found for ${team.name}`)
        errorCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n📊 NFL Regular Season Sync Results:`)
    console.log(`✅ Successfully updated: ${successCount} teams`)
    console.log(`❌ Failed to update: ${errorCount} teams`)
    console.log(`📈 Success rate: ${((successCount / nflTeams.length) * 100).toFixed(1)}%`)
    
    // Show updated records
    console.log('\n🏆 Updated NFL teams:')
    const updatedNFLTeams = await prisma.team.findMany({
      where: { league: 'NFL' },
      select: { name: true, wins: true, losses: true },
      orderBy: { wins: 'desc' }
    })
    
    updatedNFLTeams.forEach(team => {
      console.log(`  🏈 ${team.name}: ${team.wins}-${team.losses}`)
    })
    
  } catch (error) {
    console.error('❌ Fix failed:', error)
  }
}

fixNFLPreseasonRecords()
  .catch(console.error)
  .finally(() => prisma.$disconnect())