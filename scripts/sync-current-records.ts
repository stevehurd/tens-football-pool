import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample current 2025 early season records based on games played so far
const current2025Records = [
  // College teams with games played (Week 1 results)
  { name: 'Ohio State', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Penn State', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Iowa State', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'South Florida', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Illinois', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Alabama', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Georgia', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Michigan', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'USC', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Oregon', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Florida State', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Notre Dame', wins: 1, losses: 0, league: 'COLLEGE' },
  { name: 'Clemson', wins: 1, losses: 0, league: 'COLLEGE' },
  
  // Teams that lost Week 1
  { name: 'Texas', wins: 0, losses: 1, league: 'COLLEGE' },
  { name: 'Kansas State', wins: 0, losses: 1, league: 'COLLEGE' },
  { name: 'Hawaii', wins: 0, losses: 1, league: 'COLLEGE' },
  
  // Teams that haven't played yet
  { name: 'Wisconsin', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Iowa', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Minnesota', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Northwestern', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Indiana', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Purdue', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Michigan State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Maryland', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Florida', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Auburn', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'LSU', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Tennessee', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Kentucky', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Missouri', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'South Carolina', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Vanderbilt', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Mississippi State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Arkansas', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Oklahoma', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Oklahoma State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Baylor', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'TCU', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Texas Tech', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Kansas', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'West Virginia', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Miami (FL)', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'NC State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Wake Forest', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Duke', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Virginia', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Virginia Tech', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Louisville', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Pittsburgh', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Syracuse', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Boston College', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Stanford', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'California', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'UCLA', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Washington', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Oregon State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Washington State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Colorado', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Utah', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Arizona', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Arizona State', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Texas A&M', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Mississippi', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'BYU', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'SMU', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Marshall', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Florida International', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'Louisiana-Monroe', wins: 0, losses: 0, league: 'COLLEGE' },
  { name: 'San Diego State', wins: 0, losses: 0, league: 'COLLEGE' },
  
  // NFL teams (season hasn't started yet)
  { name: 'Kansas City Chiefs', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Buffalo Bills', wins: 0, losses: 0, league: 'NFL' },
  { name: 'San Francisco 49ers', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Los Angeles Rams', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Detroit Lions', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Seattle Seahawks', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Green Bay Packers', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Jacksonville Jaguars', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Tampa Bay Buccaneers', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Arizona Cardinals', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Cincinnati Bengals', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Baltimore Ravens', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Buffalo Bills', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Minnesota Vikings', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Kansas City Chiefs', wins: 0, losses: 0, league: 'NFL' },
  { name: 'New York Jets', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Dallas Cowboys', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Philadelphia Eagles', wins: 0, losses: 0, league: 'NFL' },
  { name: 'New England Patriots', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Indianapolis Colts', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Las Vegas Raiders', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Denver Broncos', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Los Angeles Chargers', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Houston Texans', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Washington Commanders', wins: 0, losses: 0, league: 'NFL' },
  { name: 'New Orleans Saints', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Chicago Bears', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Cleveland Browns', wins: 0, losses: 0, league: 'NFL' },
  { name: 'Pittsburgh Steelers', wins: 0, losses: 0, league: 'NFL' },
]

async function updateCurrentRecords() {
  console.log('🏈 Updating with current 2025 season records...')

  let updatedCount = 0

  for (const record of current2025Records) {
    try {
      const result = await prisma.team.updateMany({
        where: { 
          name: record.name,
          league: record.league
        },
        data: {
          wins: record.wins,
          losses: record.losses,
        },
      })
      
      if (result.count > 0) {
        console.log(`✅ ${record.league}: ${record.name} -> ${record.wins}-${record.losses}`)
        updatedCount++
      }
    } catch (error) {
      console.log(`❌ Failed to update ${record.name}: ${error}`)
    }
  }

  console.log(`\n🎉 Updated ${updatedCount} teams with current 2025 records!`)
  return updatedCount
}

async function main() {
  try {
    await updateCurrentRecords()
  } catch (error) {
    console.error('Failed to update current records:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()