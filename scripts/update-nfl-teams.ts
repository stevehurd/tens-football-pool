import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const nflTeams = [
  // AFC East (ESPN NFL team IDs are different from college)
  { name: 'Buffalo Bills', espnId: 2, conference: 'AFC', division: 'East', abbreviation: 'BUF' },
  { name: 'Miami Dolphins', espnId: 15, conference: 'AFC', division: 'East', abbreviation: 'MIA' },
  { name: 'New England Patriots', espnId: 17, conference: 'AFC', division: 'East', abbreviation: 'NE' },
  { name: 'New York Jets', espnId: 20, conference: 'AFC', division: 'East', abbreviation: 'NYJ' },

  // AFC North
  { name: 'Baltimore Ravens', espnId: 33, conference: 'AFC', division: 'North', abbreviation: 'BAL' },
  { name: 'Cincinnati Bengals', espnId: 4, conference: 'AFC', division: 'North', abbreviation: 'CIN' },
  { name: 'Cleveland Browns', espnId: 5, conference: 'AFC', division: 'North', abbreviation: 'CLE' },
  { name: 'Pittsburgh Steelers', espnId: 23, conference: 'AFC', division: 'North', abbreviation: 'PIT' },

  // AFC South
  { name: 'Houston Texans', espnId: 34, conference: 'AFC', division: 'South', abbreviation: 'HOU' },
  { name: 'Indianapolis Colts', espnId: 11, conference: 'AFC', division: 'South', abbreviation: 'IND' },
  { name: 'Jacksonville Jaguars', espnId: 30, conference: 'AFC', division: 'South', abbreviation: 'JAX' },
  { name: 'Tennessee Titans', espnId: 10, conference: 'AFC', division: 'South', abbreviation: 'TEN' },

  // AFC West
  { name: 'Denver Broncos', espnId: 7, conference: 'AFC', division: 'West', abbreviation: 'DEN' },
  { name: 'Kansas City Chiefs', espnId: 12, conference: 'AFC', division: 'West', abbreviation: 'KC' },
  { name: 'Las Vegas Raiders', espnId: 13, conference: 'AFC', division: 'West', abbreviation: 'LV' },
  { name: 'Los Angeles Chargers', espnId: 24, conference: 'AFC', division: 'West', abbreviation: 'LAC' },

  // NFC East
  { name: 'Dallas Cowboys', espnId: 6, conference: 'NFC', division: 'East', abbreviation: 'DAL' },
  { name: 'New York Giants', espnId: 19, conference: 'NFC', division: 'East', abbreviation: 'NYG' },
  { name: 'Philadelphia Eagles', espnId: 21, conference: 'NFC', division: 'East', abbreviation: 'PHI' },
  { name: 'Washington Commanders', espnId: 28, conference: 'NFC', division: 'East', abbreviation: 'WAS' },

  // NFC North
  { name: 'Chicago Bears', espnId: 3, conference: 'NFC', division: 'North', abbreviation: 'CHI' },
  { name: 'Detroit Lions', espnId: 8, conference: 'NFC', division: 'North', abbreviation: 'DET' },
  { name: 'Green Bay Packers', espnId: 9, conference: 'NFC', division: 'North', abbreviation: 'GB' },
  { name: 'Minnesota Vikings', espnId: 16, conference: 'NFC', division: 'North', abbreviation: 'MIN' },

  // NFC South
  { name: 'Atlanta Falcons', espnId: 1, conference: 'NFC', division: 'South', abbreviation: 'ATL' },
  { name: 'Carolina Panthers', espnId: 29, conference: 'NFC', division: 'South', abbreviation: 'CAR' },
  { name: 'New Orleans Saints', espnId: 18, conference: 'NFC', division: 'South', abbreviation: 'NO' },
  { name: 'Tampa Bay Buccaneers', espnId: 27, conference: 'NFC', division: 'South', abbreviation: 'TB' },

  // NFC West
  { name: 'Arizona Cardinals', espnId: 22, conference: 'NFC', division: 'West', abbreviation: 'ARI' },
  { name: 'Los Angeles Rams', espnId: 14, conference: 'NFC', division: 'West', abbreviation: 'LAR' },
  { name: 'San Francisco 49ers', espnId: 25, conference: 'NFC', division: 'West', abbreviation: 'SF' },
  { name: 'Seattle Seahawks', espnId: 26, conference: 'NFC', division: 'West', abbreviation: 'SEA' }
]

async function updateNFLTeams() {
  console.log('🏈 Starting NFL teams update...')

  let updated = 0

  // Update NFL teams
  for (const team of nflTeams) {
    const existingTeam = await prisma.team.findFirst({
      where: {
        name: team.name,
        league: 'NFL'
      }
    })

    if (existingTeam) {
      // Check if ESPN ID is already in use by another NFL team
      const conflictingTeam = await prisma.team.findFirst({
        where: {
          espnId: team.espnId,
          league: 'NFL',
          id: { not: existingTeam.id }
        }
      })

      if (conflictingTeam) {
        console.log(`⚠️  ESPN ID ${team.espnId} already used by NFL team ${conflictingTeam.name}, skipping ${team.name}`)
        continue
      }

      await prisma.team.update({
        where: { id: existingTeam.id },
        data: {
          espnId: team.espnId,
          conference: team.conference,
          division: team.division,
          abbreviation: team.abbreviation
        }
      })
      updated++
      console.log(`✅ Updated ${team.name}`)
    } else {
      console.log(`❌ Team not found: ${team.name}`)
    }
  }

  console.log(`✅ NFL teams update complete`)
  console.log(`🔄 Updated: ${updated} teams`)
}

async function main() {
  try {
    await updateNFLTeams()
  } catch (error) {
    console.error('❌ Error updating NFL teams:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main