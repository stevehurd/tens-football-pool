import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ESPN API endpoints
const ESPN_NFL_API = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams'
const ESPN_CFB_API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=200'

interface ESPNTeam {
  team: {
    id: string
    displayName: string
    shortDisplayName: string
    abbreviation?: string
    logos?: Array<{ href: string }>
    record?: {
      items?: Array<{
        stats?: Array<{
          name: string
          value: number
        }>
      }>
    }
  }
}

async function fetchESPNTeams(url: string): Promise<ESPNTeam[]> {
  try {
    console.log(`Fetching from: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: any = await response.json()
    
    let teams: ESPNTeam[] = []
    
    // Handle different ESPN API response structures
    if (data.sports && data.sports[0] && data.sports[0].leagues && data.sports[0].leagues[0]) {
      const league = data.sports[0].leagues[0]
      
      // Some APIs return teams directly
      if (league.teams) {
        teams = league.teams
      }
      
      // Some APIs group teams by conference/division
      if (league.groups) {
        for (const group of league.groups) {
          teams = teams.concat(group.teams || [])
        }
      }
    }
    
    console.log(`Found ${teams.length} teams`)
    return teams
  } catch (error) {
    console.error('Error fetching ESPN data:', error)
    throw error
  }
}

function extractRecord(espnTeam: ESPNTeam): { wins: number, losses: number, ties: number } {
  let wins = 0, losses = 0, ties = 0
  
  const team = espnTeam.team
  if (team.record && team.record.items) {
    for (const item of team.record.items) {
      if (item.stats) {
        for (const stat of item.stats) {
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
      }
    }
  }
  
  return { wins, losses, ties }
}

async function syncNFLTeams(): Promise<number> {
  console.log('🏈 Syncing NFL teams with latest stats...')
  const nflTeams = await fetchESPNTeams(ESPN_NFL_API)
  let updatedCount = 0

  for (const espnTeam of nflTeams) {
    const team = espnTeam.team
    const record = extractRecord(espnTeam)
    
    try {
      const result = await prisma.team.updateMany({
        where: { 
          name: team.displayName,
          league: 'NFL' 
        },
        data: {
          abbreviation: team.abbreviation || team.shortDisplayName,
          wins: record.wins,
          losses: record.losses,
          logoUrl: team.logos?.[0]?.href,
        },
      })
      
      if (result.count > 0) {
        console.log(`✅ Updated ${team.displayName}: ${record.wins}-${record.losses}-${record.ties}`)
        updatedCount++
      }
    } catch (error) {
      console.error(`Failed to update ${team.displayName}:`, error)
    }
  }

  return updatedCount
}

async function syncCollegeTeams(): Promise<number> {
  console.log('🎓 Syncing College teams with latest stats...')
  const collegeTeams = await fetchESPNTeams(ESPN_CFB_API)
  let updatedCount = 0

  // Get existing college teams from our database to match against ESPN data
  const existingTeams = await prisma.team.findMany({
    where: { league: 'COLLEGE' },
  })

  for (const existingTeam of existingTeams) {
    // Find matching ESPN team by name similarity
    const espnTeam = collegeTeams.find((espnTeam) => {
      const team = espnTeam.team
      const existingName = existingTeam.name.toLowerCase()
      const espnName = team.displayName.toLowerCase()
      const espnShort = team.shortDisplayName.toLowerCase()
      
      return (
        existingName === espnName ||
        existingName.includes(espnName) ||
        espnName.includes(existingName) ||
        existingName.includes(espnShort) ||
        espnShort.includes(existingName)
      )
    })

    if (espnTeam) {
      const team = espnTeam.team
      const record = extractRecord(espnTeam)
      
      try {
        await prisma.team.update({
          where: { id: existingTeam.id },
          data: {
            abbreviation: team.abbreviation || team.shortDisplayName || existingTeam.abbreviation,
            wins: record.wins,
            losses: record.losses,
            logoUrl: team.logos?.[0]?.href || existingTeam.logoUrl,
          },
        })
        
        console.log(`✅ Updated ${existingTeam.name}: ${record.wins}-${record.losses}-${record.ties}`)
        updatedCount++
      } catch (error) {
        console.error(`Failed to update ${existingTeam.name}:`, error)
      }
    } else {
      console.log(`⚠️ No ESPN match found for: ${existingTeam.name}`)
    }
  }

  return updatedCount
}

function isNFLRegularSeasonActive(): boolean {
  const today = new Date()
  const currentYear = today.getFullYear()
  
  // NFL regular season typically starts first Thursday after Labor Day (around Sept 4-10)
  // For 2025, it starts September 4th
  const regularSeasonStart = new Date(`${currentYear}-09-04`)
  
  // NFL regular season ends in January of following year
  const regularSeasonEnd = new Date(`${currentYear + 1}-01-15`)
  
  return today >= regularSeasonStart && today <= regularSeasonEnd
}

async function fetchTeamRecord(espnId: number, league: 'nfl' | 'college-football'): Promise<{ wins: number, losses: number, ties: number } | null> {
  try {
    // For NFL, check if regular season has started
    if (league === 'nfl' && !isNFLRegularSeasonActive()) {
      console.log(`NFL regular season hasn't started yet - returning 0-0 for team ${espnId}`)
      return { wins: 0, losses: 0, ties: 0 }
    }
    
    const currentYear = new Date().getFullYear()
    
    // For NFL, use seasontype=2 to get regular season only (excludes preseason)
    // For college, use regular endpoint since they don't have preseason like NFL
    const seasonParam = league === 'nfl' ? `?season=${currentYear}&seasontype=2` : ''
    const url = `https://site.api.espn.com/apis/site/v2/sports/football/${league}/teams/${espnId}${seasonParam}`
    
    const response = await fetch(url)
    if (!response.ok) {
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
        
        return { wins, losses, ties }
      }
    }
    
    return null
    
  } catch (error) {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Starting improved team sync using ESPN ID lookups...')
    
    // Get all teams with ESPN IDs
    const teams = await prisma.team.findMany({
      where: {
        espnId: { not: null }
      },
      select: {
        id: true,
        name: true,
        league: true,
        espnId: true
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
          console.error(`Failed to update ${team.name}:`, updateError)
          errorCount++
        }
      } else {
        errorCount++
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    const totalUpdated = successCount
    console.log(`Sync complete: ${totalUpdated} teams updated successfully, ${errorCount} failed`)
    
    return NextResponse.json({
      success: true,
      updated: totalUpdated,
      failed: errorCount,
      totalTeams: teams.length,
      successRate: `${((successCount / teams.length) * 100).toFixed(1)}%`,
      message: `Successfully updated ${totalUpdated} teams using ESPN ID lookups`
    })
  } catch (error) {
    console.error('Team sync failed:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}