import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample final 2024 NFL season records (you would get these from ESPN API for 2024 season)
const nfl2024FinalRecords = [
  { name: 'Baltimore Ravens', wins: 13, losses: 4 },
  { name: 'Buffalo Bills', wins: 13, losses: 4 },
  { name: 'Kansas City Chiefs', wins: 11, losses: 6 },
  { name: 'Houston Texans', wins: 10, losses: 7 },
  { name: 'Pittsburgh Steelers', wins: 10, losses: 7 },
  { name: 'Los Angeles Chargers', wins: 9, losses: 8 },
  { name: 'Denver Broncos', wins: 9, losses: 8 },
  { name: 'Indianapolis Colts', wins: 8, losses: 9 },
  { name: 'Miami Dolphins', wins: 8, losses: 9 },
  { name: 'Cincinnati Bengals', wins: 7, losses: 10 },
  { name: 'New York Jets', wins: 7, losses: 10 },
  { name: 'Cleveland Browns', wins: 6, losses: 11 },
  { name: 'Jacksonville Jaguars', wins: 4, losses: 13 },
  { name: 'Tennessee Titans', wins: 3, losses: 14 },
  { name: 'New England Patriots', wins: 4, losses: 13 },
  { name: 'Las Vegas Raiders', wins: 4, losses: 13 },
  
  // NFC
  { name: 'Detroit Lions', wins: 15, losses: 2 },
  { name: 'Philadelphia Eagles', wins: 14, losses: 3 },
  { name: 'Minnesota Vikings', wins: 14, losses: 3 },
  { name: 'Green Bay Packers', wins: 11, losses: 6 },
  { name: 'Washington Commanders', wins: 12, losses: 5 },
  { name: 'Los Angeles Rams', wins: 10, losses: 7 },
  { name: 'Tampa Bay Buccaneers', wins: 10, losses: 7 },
  { name: 'Atlanta Falcons', wins: 8, losses: 9 },
  { name: 'Seattle Seahawks', wins: 10, losses: 7 },
  { name: 'Arizona Cardinals', wins: 8, losses: 9 },
  { name: 'San Francisco 49ers', wins: 6, losses: 11 },
  { name: 'Dallas Cowboys', wins: 7, losses: 10 },
  { name: 'New Orleans Saints', wins: 5, losses: 12 },
  { name: 'Chicago Bears', wins: 5, losses: 12 },
  { name: 'Carolina Panthers', wins: 5, losses: 12 },
  { name: 'New York Giants', wins: 3, losses: 14 },
]

// Sample college football records for major teams
const college2024FinalRecords = [
  { name: 'Michigan', wins: 15, losses: 1 }, // National Champion
  { name: 'Georgia', wins: 13, losses: 1 },
  { name: 'Texas', wins: 12, losses: 2 },
  { name: 'Alabama', wins: 12, losses: 2 },
  { name: 'Oregon', wins: 12, losses: 2 },
  { name: 'Florida State', wins: 13, losses: 1 },
  { name: 'Ohio State', wins: 11, losses: 2 },
  { name: 'Penn State', wins: 10, losses: 3 },
  { name: 'Notre Dame', wins: 10, losses: 3 },
  { name: 'LSU', wins: 9, losses: 4 },
  { name: 'USC', wins: 8, losses: 5 },
  { name: 'Tennessee', wins: 9, losses: 4 },
  { name: 'Kentucky', wins: 7, losses: 6 },
  { name: 'Florida', wins: 5, losses: 7 },
  { name: 'Auburn', wins: 6, losses: 7 },
  { name: 'Arkansas', wins: 4, losses: 8 },
  { name: 'Missouri', wins: 6, losses: 7 },
  { name: 'South Carolina', wins: 5, losses: 7 },
  { name: 'Vanderbilt', wins: 2, losses: 10 },
  { name: 'Mississippi State', wins: 4, losses: 8 },
  { name: 'Oklahoma', wins: 6, losses: 7 },
  { name: 'Oklahoma State', wins: 3, losses: 9 },
  { name: 'Baylor', wins: 3, losses: 9 },
  { name: 'TCU', wins: 5, losses: 7 },
  { name: 'Texas Tech', wins: 6, losses: 7 },
  { name: 'Kansas', wins: 9, losses: 4 },
  { name: 'Kansas State', wins: 9, losses: 4 },
  { name: 'Iowa State', wins: 7, losses: 6 },
  { name: 'West Virginia', wins: 9, losses: 4 },
  { name: 'Clemson', wins: 9, losses: 4 },
  { name: 'Miami (FL)', wins: 7, losses: 6 },
  { name: 'NC State', wins: 9, losses: 4 },
  { name: 'Wake Forest', wins: 4, losses: 8 },
  { name: 'Duke', wins: 8, losses: 5 },
  { name: 'Virginia', wins: 3, losses: 9 },
  { name: 'Virginia Tech', wins: 7, losses: 6 },
  { name: 'Louisville', wins: 10, losses: 4 },
  { name: 'Pittsburgh', wins: 3, losses: 9 },
  { name: 'Syracuse', wins: 6, losses: 7 },
  { name: 'Boston College', wins: 7, losses: 6 },
  { name: 'Stanford', wins: 3, losses: 9 },
  { name: 'California', wins: 6, losses: 7 },
  { name: 'UCLA', wins: 8, losses: 5 },
  { name: 'Washington', wins: 14, losses: 1 }, // CFP Finalist
  { name: 'Oregon State', wins: 8, losses: 5 },
  { name: 'Washington State', wins: 5, losses: 7 },
  { name: 'Colorado', wins: 4, losses: 8 },
  { name: 'Utah', wins: 8, losses: 5 },
  { name: 'Arizona', wins: 10, losses: 4 },
  { name: 'Arizona State', wins: 3, losses: 9 },
  { name: 'Wisconsin', wins: 7, losses: 6 },
  { name: 'Iowa', wins: 10, losses: 4 },
  { name: 'Minnesota', wins: 6, losses: 7 },
  { name: 'Illinois', wins: 5, losses: 7 },
  { name: 'Northwestern', wins: 8, losses: 5 },
  { name: 'Indiana', wins: 3, losses: 9 },
  { name: 'Purdue', wins: 4, losses: 8 },
  { name: 'Michigan State', wins: 4, losses: 8 },
  { name: 'Maryland', wins: 8, losses: 5 },
  { name: 'BYU', wins: 5, losses: 7 },
  { name: 'Hawaii', wins: 5, losses: 8 },
  { name: 'SMU', wins: 11, losses: 3 },
  { name: 'Marshall', wins: 6, losses: 7 },
  { name: 'South Florida', wins: 4, losses: 8 },
  { name: 'Florida International', wins: 4, losses: 8 },
  { name: 'Louisiana-Monroe', wins: 3, losses: 9 },
  { name: 'San Diego State', wins: 4, losses: 8 },
  { name: 'Texas A&M', wins: 7, losses: 6 },
  { name: 'Mississippi', wins: 11, losses: 3 },
]

async function update2024Records() {
  console.log('🏈 Updating with 2024 final season records...')

  let updatedCount = 0

  // Update NFL teams
  for (const record of nfl2024FinalRecords) {
    try {
      const result = await prisma.team.updateMany({
        where: { 
          name: record.name,
          league: 'NFL'
        },
        data: {
          wins: record.wins,
          losses: record.losses,
        },
      })
      
      if (result.count > 0) {
        console.log(`✅ NFL: ${record.name} -> ${record.wins}-${record.losses}`)
        updatedCount++
      }
    } catch (error) {
      console.log(`❌ Failed to update ${record.name}: ${error}`)
    }
  }

  // Update College teams
  for (const record of college2024FinalRecords) {
    try {
      const result = await prisma.team.updateMany({
        where: { 
          name: record.name,
          league: 'COLLEGE'
        },
        data: {
          wins: record.wins,
          losses: record.losses,
        },
      })
      
      if (result.count > 0) {
        console.log(`✅ College: ${record.name} -> ${record.wins}-${record.losses}`)
        updatedCount++
      }
    } catch (error) {
      console.log(`❌ Failed to update ${record.name}: ${error}`)
    }
  }

  console.log(`\n🎉 Updated ${updatedCount} teams with 2024 final records!`)
  return updatedCount
}

async function main() {
  try {
    await update2024Records()
  } catch (error) {
    console.error('Failed to update 2024 records:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()