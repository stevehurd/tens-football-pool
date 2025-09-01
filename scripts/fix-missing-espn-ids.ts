import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Manual mapping for teams that didn't match due to name variations
const nameMapping: Record<string, string> = {
  // ESPN Name -> Our Standard Name
  'SMU Mustangs': 'SMU Mustangs',
  'Tulane Green Wave': 'Tulane Green Wave', 
  'UTSA Roadrunners': 'UTSA Roadrunners',
  'TCU Horned Frogs': 'TCU Horned Frogs',
  'Texas Tech Red Raiders': 'Texas Tech Red Raiders',
  'Purdue Boilermakers': 'Purdue Boilermakers',
  'Sam Houston Bearkats': 'Sam Houston Bearkats',
  'UTEP Miners': 'UTEP Miners',
  'Toledo Rockets': 'Toledo Rockets',
  'Western Michigan Broncos': 'Western Michigan Broncos',
  'Hawaii Rainbow Warriors': 'Hawaii Rainbow Warriors',
  'Wyoming Cowboys': 'Wyoming Cowboys',
  'South Carolina Gamecocks': 'South Carolina Gamecocks',
  'Tennessee Volunteers': 'Tennessee Volunteers',
  'Louisiana Monroe Warhawks': 'Louisiana Monroe Warhawks',
  'Southern Miss Golden Eagles': 'Southern Miss Golden Eagles',
  'Troy Trojans': 'Troy Trojans',
  
  // Alternate ESPN names that might match
  'Hawai\'i Rainbow Warriors': 'Hawaii Rainbow Warriors',
  'UL Monroe Warhawks': 'Louisiana Monroe Warhawks',
  'Southern Mississippi Golden Eagles': 'Southern Miss Golden Eagles',
  'Tennessee Vols': 'Tennessee Volunteers',
  'USC Gamecocks': 'South Carolina Gamecocks'
}

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

async function fetchESPNTeams(): Promise<ESPNTeam[]> {
  const ESPN_CFB_API = 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/teams?limit=500'
  
  try {
    console.log('Fetching ESPN teams...')
    const response = await fetch(ESPN_CFB_API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: any = await response.json()
    
    let teams: ESPNTeam[] = []
    if (data.sports?.[0]?.leagues?.[0]?.teams) {
      teams = data.sports[0].leagues[0].teams
    }
    
    console.log(`Found ${teams.length} ESPN teams`)
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

async function fixMissingESPNIds() {
  console.log('🔍 Fixing missing ESPN IDs for FBS teams...')
  
  // Get teams without ESPN IDs
  const teamsWithoutESPN = await prisma.team.findMany({
    where: {
      league: 'COLLEGE',
      espnId: null
    }
  })
  
  console.log(`Found ${teamsWithoutESPN.length} teams without ESPN IDs`)
  
  // Get ESPN data
  const espnTeams = await fetchESPNTeams()
  
  let fixedCount = 0
  
  for (const dbTeam of teamsWithoutESPN) {
    console.log(`\n🔍 Looking for: ${dbTeam.name}`)
    
    // Try different matching strategies
    let matchingEspnTeam: ESPNTeam | undefined
    
    // Strategy 1: Direct name match
    matchingEspnTeam = espnTeams.find(espnTeam => 
      espnTeam.team.displayName.toLowerCase() === dbTeam.name.toLowerCase()
    )
    
    if (!matchingEspnTeam) {
      // Strategy 2: Partial matches with key words
      const dbWords = dbTeam.name.toLowerCase().split(' ')
      matchingEspnTeam = espnTeams.find(espnTeam => {
        const espnName = espnTeam.team.displayName.toLowerCase()
        return dbWords.every(word => {
          // Skip common words
          if (['the', 'of', 'and', 'at'].includes(word)) return true
          return espnName.includes(word)
        })
      })
    }
    
    if (!matchingEspnTeam) {
      // Strategy 3: Try alternate names
      const alternateNames = [
        dbTeam.name.replace('Hawaii', 'Hawai\'i'),
        dbTeam.name.replace('Louisiana Monroe', 'UL Monroe'),
        dbTeam.name.replace('Southern Miss', 'Southern Mississippi'),
        dbTeam.name.replace('Tennessee Volunteers', 'Tennessee'),
        dbTeam.name.replace('South Carolina Gamecocks', 'South Carolina'),
        dbTeam.name.replace('TCU Horned Frogs', 'TCU'),
        dbTeam.name.replace('SMU Mustangs', 'SMU'),
        dbTeam.name.replace('UTSA Roadrunners', 'UTSA'),
        dbTeam.name.replace('UTEP Miners', 'UTEP')
      ]
      
      for (const altName of alternateNames) {
        matchingEspnTeam = espnTeams.find(espnTeam => 
          espnTeam.team.displayName.toLowerCase().includes(altName.toLowerCase()) ||
          altName.toLowerCase().includes(espnTeam.team.displayName.toLowerCase())
        )
        if (matchingEspnTeam) {
          console.log(`   Found with alternate name: ${altName} -> ${matchingEspnTeam.team.displayName}`)
          break
        }
      }
    }
    
    if (matchingEspnTeam) {
      const team = matchingEspnTeam.team
      const record = extractRecord(matchingEspnTeam)
      
      try {
        await prisma.team.update({
          where: { id: dbTeam.id },
          data: {
            espnId: parseInt(team.id),
            abbreviation: team.abbreviation || team.shortDisplayName || dbTeam.abbreviation,
            logoUrl: team.logos?.[0]?.href || dbTeam.logoUrl,
            wins: record.wins,
            losses: record.losses,
            ties: record.ties
          }
        })
        
        console.log(`✅ ${dbTeam.name} -> ESPN ID: ${team.id} (${team.displayName})`)
        fixedCount++
      } catch (error) {
        console.log(`❌ Error updating ${dbTeam.name}: ${error}`)
      }
    } else {
      console.log(`❌ No ESPN match found for: ${dbTeam.name}`)
      
      // Show some potential matches for manual review
      const possibleMatches = espnTeams.filter(espnTeam => {
        const espnName = espnTeam.team.displayName.toLowerCase()
        const dbName = dbTeam.name.toLowerCase()
        const firstWord = dbName.split(' ')[0]
        const lastWord = dbName.split(' ')[dbName.split(' ').length - 1]
        return espnName.includes(firstWord) || espnName.includes(lastWord)
      }).slice(0, 3)
      
      if (possibleMatches.length > 0) {
        console.log('   Possible matches:')
        possibleMatches.forEach(match => {
          console.log(`     - ${match.team.displayName}`)
        })
      }
    }
  }
  
  console.log(`\n✅ Fixed ${fixedCount} teams with ESPN IDs`)
  
  // Final check
  const remainingWithoutESPN = await prisma.team.count({
    where: {
      league: 'COLLEGE',
      espnId: null
    }
  })
  
  console.log(`📊 Teams still without ESPN IDs: ${remainingWithoutESPN}`)
  
  if (remainingWithoutESPN > 0) {
    console.log('\n⚠️  Teams without ESPN IDs will not get live stat updates.')
    console.log('   Their records will remain 0-0-0 unless manually updated.')
  }
}

async function main() {
  try {
    await fixMissingESPNIds()
  } catch (error) {
    console.error('❌ Fatal error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main