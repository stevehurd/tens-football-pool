import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ESPN API endpoints
const ESPN_NFL_API = 'https://site.web.api.espn.com/apis/site/v2/sports/football/nfl/teams'
const ESPN_CFB_API = 'https://site.web.api.espn.com/apis/site/v2/sports/football/college-football/teams?season=2025'

interface ESPNTeam {
  id: string
  displayName: string
  shortDisplayName: string
  abbreviation: string
  record?: {
    items: Array<{
      description: string
      type: string
      summary: string
      stats: Array<{
        name: string
        value: number
      }>
    }>
  }
}

async function fetchESPNData(url: string): Promise<any> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error)
    return null
  }
}

async function syncNFLTeams() {
  console.log('🏈 Syncing NFL team data from ESPN...')
  
  const data = await fetchESPNData(ESPN_NFL_API)
  if (!data?.sports?.[0]?.leagues?.[0]?.teams) {
    console.log('❌ Failed to fetch NFL data')
    return
  }

  const nflTeams = data.sports[0].leagues[0].teams

  for (const teamData of nflTeams) {
    const team = teamData.team as ESPNTeam
    
    // Extract wins and losses from record
    let wins = 0
    let losses = 0
    
    if (team.record?.items) {
      for (const record of team.record.items) {
        if (record.type === 'total') {
          const winStat = record.stats.find(s => s.name === 'wins')
          const lossStat = record.stats.find(s => s.name === 'losses')
          wins = winStat?.value || 0
          losses = lossStat?.value || 0
          break
        }
      }
    }

    try {
      await prisma.team.upsert({
        where: { name: team.displayName },
        update: {
          abbreviation: team.abbreviation,
          wins,
          losses,
        },
        create: {
          name: team.displayName,
          abbreviation: team.abbreviation,
          league: 'NFL',
          wins,
          losses,
        },
      })
      
      console.log(`✅ ${team.displayName}: ${wins}-${losses}`)
    } catch (error) {
      console.log(`❌ Failed to update ${team.displayName}: ${error}`)
    }
  }
}

async function syncCollegeTeams() {
  console.log('🏫 Syncing College team data from ESPN...')
  
  const data = await fetchESPNData(ESPN_CFB_API + '?limit=500')
  if (!data?.sports?.[0]?.leagues?.[0]?.teams) {
    console.log('❌ Failed to fetch College data')
    return
  }

  const collegeTeams = data.sports[0].leagues[0].teams.slice(0, 100) // Limit for demo

  for (const teamData of collegeTeams) {
    const team = teamData.team as ESPNTeam
    
    // Extract wins and losses from record
    let wins = 0
    let losses = 0
    
    if (team.record?.items) {
      for (const record of team.record.items) {
        if (record.type === 'total') {
          const winStat = record.stats.find(s => s.name === 'wins')
          const lossStat = record.stats.find(s => s.name === 'losses')
          wins = winStat?.value || 0
          losses = lossStat?.value || 0
          break
        }
      }
    }

    // Try to find existing team by name matching
    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [
          { name: team.displayName },
          { name: team.shortDisplayName },
          { name: { contains: team.displayName.split(' ')[0] } }
        ],
        league: 'COLLEGE'
      }
    })

    if (existingTeam) {
      try {
        await prisma.team.update({
          where: { id: existingTeam.id },
          data: {
            abbreviation: team.abbreviation,
            wins,
            losses,
          },
        })
        
        console.log(`✅ Updated ${existingTeam.name}: ${wins}-${losses}`)
      } catch (error) {
        console.log(`❌ Failed to update ${existingTeam.name}: ${error}`)
      }
    } else {
      console.log(`⚠️  No match found for ${team.displayName}`)
    }
  }
}

async function syncAllTeamData() {
  console.log('🔄 Starting team data synchronization...')
  
  try {
    await syncNFLTeams()
    await syncCollegeTeams()
    
    console.log('\n🎉 Team data synchronization complete!')
    console.log('💡 Run this script regularly during the season to update records')
  } catch (error) {
    console.error('❌ Synchronization failed:', error)
  }
}

async function main() {
  try {
    await syncAllTeamData()
  } catch (error) {
    console.error('Script failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()