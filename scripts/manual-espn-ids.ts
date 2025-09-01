import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Manual ESPN ID mapping for teams that didn't match automatically
// These are verified ESPN IDs for major FBS teams
const manualESPNIds: Record<string, { espnId: number, abbreviation?: string }> = {
  'South Carolina Gamecocks': { espnId: 2579, abbreviation: 'SC' },
  'Tennessee Volunteers': { espnId: 2633, abbreviation: 'TENN' },
  'Purdue Boilermakers': { espnId: 2509, abbreviation: 'PUR' },
  'SMU Mustangs': { espnId: 2567, abbreviation: 'SMU' },
  'TCU Horned Frogs': { espnId: 2628, abbreviation: 'TCU' },
  'Texas Tech Red Raiders': { espnId: 2641, abbreviation: 'TTU' },
  'Tulane Green Wave': { espnId: 2655, abbreviation: 'TULN' },
  'UTSA Roadrunners': { espnId: 2636, abbreviation: 'UTSA' },
  'Wyoming Cowboys': { espnId: 2751, abbreviation: 'WYO' },
  'Southern Miss Golden Eagles': { espnId: 2572, abbreviation: 'USM' },
  'Troy Trojans': { espnId: 2653, abbreviation: 'TROY' },
  'Toledo Rockets': { espnId: 2649, abbreviation: 'TOL' },
  'Western Michigan Broncos': { espnId: 2711, abbreviation: 'WMU' },
  'Sam Houston Bearkats': { espnId: 2534, abbreviation: 'SHSU' },
  'UTEP Miners': { espnId: 2638, abbreviation: 'UTEP' }
}

async function updateManualESPNIds() {
  console.log('🔧 Updating manual ESPN IDs for major FBS teams...')
  
  let updatedCount = 0
  
  // First, fix the incorrect Tennessee match
  console.log('🔄 Fixing incorrect Tennessee match...')
  await prisma.team.update({
    where: {
      name: 'Tennessee Volunteers'
    },
    data: {
      espnId: 2633,
      abbreviation: 'TENN',
      wins: 0,
      losses: 0,
      ties: 0
    }
  })
  console.log('✅ Fixed Tennessee Volunteers')
  
  for (const [teamName, { espnId, abbreviation }] of Object.entries(manualESPNIds)) {
    try {
      const result = await prisma.team.updateMany({
        where: {
          name: teamName,
          league: 'COLLEGE'
        },
        data: {
          espnId: espnId,
          abbreviation: abbreviation
        }
      })
      
      if (result.count > 0) {
        console.log(`✅ ${teamName} -> ESPN ID: ${espnId}`)
        updatedCount++
      } else {
        console.log(`⚠️ Team not found: ${teamName}`)
      }
    } catch (error) {
      console.log(`❌ Error updating ${teamName}: ${error}`)
    }
  }
  
  console.log(`\n✅ Updated ${updatedCount} teams with manual ESPN IDs`)
  
  // Final verification
  const remainingWithoutESPN = await prisma.team.count({
    where: {
      league: 'COLLEGE',
      espnId: null
    }
  })
  
  console.log(`📊 Teams still without ESPN IDs: ${remainingWithoutESPN}`)
  
  if (remainingWithoutESPN === 0) {
    console.log('🎉 SUCCESS: All FBS teams now have ESPN IDs for live stat updates!')
  } else {
    // List remaining teams
    const remaining = await prisma.team.findMany({
      where: {
        league: 'COLLEGE',
        espnId: null
      },
      select: { name: true, conference: true }
    })
    
    console.log('\n⚠️ Teams still missing ESPN IDs:')
    remaining.forEach(team => {
      console.log(`  - ${team.name} (${team.conference})`)
    })
  }
}

async function main() {
  try {
    await updateManualESPNIds()
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