import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Define which teams to keep (the complete names with mascots)
const duplicateMapping = [
  { keep: 'BYU Cougars', remove: 'BYU' },
  { keep: 'Boston College Eagles', remove: 'Boston College' },
  { keep: 'Arizona State Sun Devils', remove: 'Arizona State' },
  { keep: 'Georgia Tech Yellow Jackets', remove: 'Georgia Tech' },
  { keep: 'Miami Hurricanes', remove: 'Miami' },
  { keep: 'Virginia Tech Hokies', remove: 'Virginia Tech' },
  { keep: 'Wake Forest Demon Deacons', remove: 'Wake Forest' },
  { keep: 'North Carolina State Wolfpack', remove: 'NC State' },
  { keep: 'Florida State Seminoles', remove: 'Florida State' },
  { keep: 'Kansas State Wildcats', remove: 'Kansas State' },
  { keep: 'Iowa State Cyclones', remove: 'Iowa State' },
  { keep: 'Texas Christian Horned Frogs', remove: 'TCU' },
  { keep: 'Oklahoma State Cowboys', remove: 'Oklahoma State' },
  { keep: 'West Virginia Mountaineers', remove: 'West Virginia' },
  { keep: 'Michigan State Spartans', remove: 'Michigan State' },
  { keep: 'Ohio State Buckeyes', remove: 'Ohio State' },
  { keep: 'Penn State Nittany Lions', remove: 'Penn State' },
  { keep: 'Oregon State Beavers', remove: 'Oregon State' },
  { keep: 'Washington State Cougars', remove: 'Washington State' },
  { keep: 'Colorado State Rams', remove: 'Colorado State' },
  { keep: 'Fresno State Bulldogs', remove: 'Fresno State' },
  { keep: 'San Diego State Aztecs', remove: 'San Diego State' },
  { keep: 'San Jose State Spartans', remove: 'San Jose State' },
  { keep: 'Utah State Aggies', remove: 'Utah State' },
  { keep: 'Boise State Broncos', remove: 'Boise State' },
  { keep: 'Appalachian State Mountaineers', remove: 'Appalachian State' },
  { keep: 'Arkansas State Red Wolves', remove: 'Arkansas State' },
  { keep: 'Georgia State Panthers', remove: 'Georgia State' },
  { keep: 'Louisiana Monroe Warhawks', remove: 'Louisiana Monroe' },
  { keep: 'New Mexico State Aggies', remove: 'New Mexico State' },
  { keep: 'Texas State Bobcats', remove: 'Texas State' },
  
  // Additional duplicates found
  { keep: 'Mississippi State Bulldogs', remove: 'Mississippi State' },
  { keep: 'North Carolina State Wolfpack', remove: 'NC State Wolfpack' },
  { keep: 'LSU Tigers', remove: 'Louisiana State' },
  { keep: 'Georgia Bulldogs', remove: 'Georgia' },
  { keep: 'Auburn Tigers', remove: 'Auburn' },
  { keep: 'Clemson Tigers', remove: 'Clemson' },
  { keep: 'Missouri Tigers', remove: 'Missouri' },
  { keep: 'Alabama Crimson Tide', remove: 'Alabama' },
  { keep: 'Tennessee Volunteers', remove: 'Tennessee' },
  { keep: 'Kentucky Wildcats', remove: 'Kentucky' },
  { keep: 'Florida Gators', remove: 'Florida' },
  { keep: 'South Carolina Gamecocks', remove: 'South Carolina' },
  { keep: 'Vanderbilt Commodores', remove: 'Vanderbilt' },
  { keep: 'Arkansas Razorbacks', remove: 'Arkansas' },
  { keep: 'Texas A&M Aggies', remove: 'Texas A&M' },
  { keep: 'Ole Miss Rebels', remove: 'Mississippi' },
  { keep: 'California Golden Bears', remove: 'California' },
  { keep: 'Stanford Cardinal', remove: 'Stanford' },
  { keep: 'Oregon Ducks', remove: 'Oregon' },
  { keep: 'Washington Huskies', remove: 'Washington' },
  { keep: 'UCLA Bruins', remove: 'UCLA' },
  { keep: 'USC Trojans', remove: 'USC' },
  { keep: 'Arizona Wildcats', remove: 'Arizona' },
  { keep: 'Colorado Buffaloes', remove: 'Colorado' },
  { keep: 'Utah Utes', remove: 'Utah' }
]

async function cleanDuplicateTeams() {
  console.log('🧹 Starting duplicate team cleanup...')

  let removedCount = 0
  let updatedCount = 0

  for (const mapping of duplicateMapping) {
    // Find both teams
    const keepTeam = await prisma.team.findFirst({
      where: { name: mapping.keep, league: 'COLLEGE' }
    })
    
    const removeTeam = await prisma.team.findFirst({
      where: { name: mapping.remove, league: 'COLLEGE' }
    })

    if (keepTeam && removeTeam) {
      // Move any selections from the team to be removed to the team to keep
      const selectionsMoved = await prisma.selection.updateMany({
        where: { teamId: removeTeam.id },
        data: { teamId: keepTeam.id }
      })

      // Delete the duplicate team
      await prisma.team.delete({
        where: { id: removeTeam.id }
      })

      console.log(`✅ Removed "${mapping.remove}", kept "${mapping.keep}"${selectionsMoved.count > 0 ? ` (moved ${selectionsMoved.count} selections)` : ''}`)
      removedCount++
      
      if (selectionsMoved.count > 0) {
        updatedCount += selectionsMoved.count
      }
    } else if (removeTeam && !keepTeam) {
      // If we only have the "remove" version, rename it to the "keep" version
      await prisma.team.update({
        where: { id: removeTeam.id },
        data: { name: mapping.keep }
      })
      console.log(`🔄 Renamed "${mapping.remove}" to "${mapping.keep}"`)
    } else if (!removeTeam && !keepTeam) {
      console.log(`⚠️  Neither "${mapping.keep}" nor "${mapping.remove}" found`)
    } else {
      console.log(`ℹ️  Only "${mapping.keep}" exists (no duplicate to remove)`)
    }
  }

  console.log(`✅ Duplicate cleanup complete`)
  console.log(`🗑️  Removed: ${removedCount} duplicate teams`)
  console.log(`🔄 Updated selections: ${updatedCount}`)

  // Show final college team count
  const finalCount = await prisma.team.count({
    where: { league: 'COLLEGE' }
  })
  console.log(`📊 Final college team count: ${finalCount}`)
}

async function main() {
  try {
    await cleanDuplicateTeams()
  } catch (error) {
    console.error('❌ Error cleaning duplicate teams:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main