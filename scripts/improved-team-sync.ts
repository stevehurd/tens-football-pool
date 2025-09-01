import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface TeamRecord {
  wins: number
  losses: number 
  ties: number
}

async function fetchTeamRecord(espnId: number, league: 'nfl' | 'college-football'): Promise<TeamRecord | null> {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/${league}/teams/${espnId}`
    console.log(`Fetching: ${url}`)
    
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
        
        console.log(`✅ ${data.team.displayName}: ${wins}-${losses}-${ties}`)
        return { wins, losses, ties }
      }
    }
    
    console.log(`⚠️ No record found for ${data.team?.displayName || 'Unknown team'}`)
    return null
    
  } catch (error) {
    console.error(`❌ Error fetching ESPN ID ${espnId}:`, error)
    return null
  }
}

async function syncTeamRecords() {
  console.log('🏈🎓 Syncing team records using ESPN ID lookups...')
  
  try {
    // Get all teams with ESPN IDs
    const teams = await prisma.team.findMany({
      where: {
        espnId: { not: null }
      },
      select: {
        id: true,
        name: true,
        league: true,
        espnId: true,
        wins: true,
        losses: true
      }
    })
    
    console.log(`Found ${teams.length} teams with ESPN IDs to sync`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const team of teams) {
      if (!team.espnId) continue
      
      const league = team.league === 'NFL' ? 'nfl' : 'college-football'
      const record = await fetchTeamRecord(team.espnId, league)
      
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
        errorCount++
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    console.log(`\n📊 Sync Results:`)
    console.log(`✅ Successfully updated: ${successCount} teams`)
    console.log(`❌ Failed to update: ${errorCount} teams`)
    console.log(`📈 Success rate: ${((successCount / teams.length) * 100).toFixed(1)}%`)
    
    // Show some updated teams
    console.log('\n🏆 Updated teams (top 10):')
    const updatedTeams = await prisma.team.findMany({
      where: {
        OR: [
          { wins: { gt: 0 } },
          { losses: { gt: 0 } }
        ]
      },
      select: { name: true, wins: true, losses: true, league: true },
      orderBy: { wins: 'desc' },
      take: 10
    })
    
    updatedTeams.forEach(team => {
      console.log(`  ${team.league === 'NFL' ? '🏈' : '🎓'} ${team.name}: ${team.wins}-${team.losses}`)
    })
    
    return { successCount, errorCount, totalTeams: teams.length }
    
  } catch (error) {
    console.error('❌ Sync failed:', error)
    throw error
  }
}

// If running directly
if (require.main === module) {
  syncTeamRecords()
    .then((results) => {
      console.log('\n🎉 Sync complete!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Sync failed:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}

export { syncTeamRecords }