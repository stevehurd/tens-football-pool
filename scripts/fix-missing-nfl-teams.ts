import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const allNFLTeams = [
  // AFC East
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

async function fixNFLTeams() {
  console.log('🏈 Fixing missing NFL teams...')

  let created = 0
  let updated = 0

  for (const team of allNFLTeams) {
    const existingTeam = await prisma.team.findFirst({
      where: {
        name: team.name,
        league: 'NFL'
      }
    })

    if (existingTeam) {
      // Update existing team
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
      // Create missing team
      await prisma.team.create({
        data: {
          name: team.name,
          league: 'NFL',
          espnId: team.espnId,
          conference: team.conference,
          division: team.division,
          abbreviation: team.abbreviation,
          wins: 0,
          losses: 0,
          ties: 0
        }
      })
      created++
      console.log(`🆕 Created ${team.name}`)
    }
  }

  console.log(`✅ NFL teams fix complete`)
  console.log(`🆕 Created: ${created} teams`)
  console.log(`🔄 Updated: ${updated} teams`)
  
  // Verify count
  const totalNFL = await prisma.team.count({
    where: { league: 'NFL' }
  })
  console.log(`📊 Total NFL teams: ${totalNFL}/32`)
}

async function main() {
  try {
    await fixNFLTeams()
  } catch (error) {
    console.error('❌ Error fixing NFL teams:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main