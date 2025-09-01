import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const fbsTeams = [
  // ACC
  { name: 'Boston College Eagles', espnId: 103, conference: 'ACC', division: 'Atlantic' },
  { name: 'Clemson Tigers', espnId: 228, conference: 'ACC', division: 'Atlantic' },
  { name: 'Duke Blue Devils', espnId: 150, conference: 'ACC', division: 'Coastal' },
  { name: 'Florida State Seminoles', espnId: 52, conference: 'ACC', division: 'Atlantic' },
  { name: 'Georgia Tech Yellow Jackets', espnId: 59, conference: 'ACC', division: 'Coastal' },
  { name: 'Louisville Cardinals', espnId: 97, conference: 'ACC', division: 'Atlantic' },
  { name: 'Miami Hurricanes', espnId: 2390, conference: 'ACC', division: 'Coastal' },
  { name: 'North Carolina Tar Heels', espnId: 153, conference: 'ACC', division: 'Coastal' },
  { name: 'NC State Wolfpack', espnId: 152, conference: 'ACC', division: 'Atlantic' },
  { name: 'Pittsburgh Panthers', espnId: 221, conference: 'ACC', division: 'Coastal' },
  { name: 'Syracuse Orange', espnId: 183, conference: 'ACC', division: 'Atlantic' },
  { name: 'Virginia Cavaliers', espnId: 258, conference: 'ACC', division: 'Coastal' },
  { name: 'Virginia Tech Hokies', espnId: 259, conference: 'ACC', division: 'Coastal' },
  { name: 'Wake Forest Demon Deacons', espnId: 154, conference: 'ACC', division: 'Atlantic' },

  // Big 12
  { name: 'Baylor Bears', espnId: 239, conference: 'Big 12', division: '' },
  { name: 'Iowa State Cyclones', espnId: 66, conference: 'Big 12', division: '' },
  { name: 'Kansas Jayhawks', espnId: 2305, conference: 'Big 12', division: '' },
  { name: 'Kansas State Wildcats', espnId: 2306, conference: 'Big 12', division: '' },
  { name: 'Oklahoma Sooners', espnId: 201, conference: 'Big 12', division: '' },
  { name: 'Oklahoma State Cowboys', espnId: 197, conference: 'Big 12', division: '' },
  { name: 'TCU Horned Frogs', espnId: 2628, conference: 'Big 12', division: '' },
  { name: 'Texas Longhorns', espnId: 251, conference: 'Big 12', division: '' },
  { name: 'Texas Tech Red Raiders', espnId: 2641, conference: 'Big 12', division: '' },
  { name: 'West Virginia Mountaineers', espnId: 277, conference: 'Big 12', division: '' },

  // Big Ten
  { name: 'Illinois Fighting Illini', espnId: 356, conference: 'Big Ten', division: 'West' },
  { name: 'Indiana Hoosiers', espnId: 84, conference: 'Big Ten', division: 'East' },
  { name: 'Iowa Hawkeyes', espnId: 2294, conference: 'Big Ten', division: 'West' },
  { name: 'Maryland Terrapins', espnId: 120, conference: 'Big Ten', division: 'East' },
  { name: 'Michigan Wolverines', espnId: 130, conference: 'Big Ten', division: 'East' },
  { name: 'Michigan State Spartans', espnId: 127, conference: 'Big Ten', division: 'East' },
  { name: 'Minnesota Golden Gophers', espnId: 135, conference: 'Big Ten', division: 'West' },
  { name: 'Nebraska Cornhuskers', espnId: 158, conference: 'Big Ten', division: 'West' },
  { name: 'Northwestern Wildcats', espnId: 77, conference: 'Big Ten', division: 'West' },
  { name: 'Ohio State Buckeyes', espnId: 194, conference: 'Big Ten', division: 'East' },
  { name: 'Penn State Nittany Lions', espnId: 213, conference: 'Big Ten', division: 'East' },
  { name: 'Purdue Boilermakers', espnId: 2509, conference: 'Big Ten', division: 'West' },
  { name: 'Rutgers Scarlet Knights', espnId: 164, conference: 'Big Ten', division: 'East' },
  { name: 'Wisconsin Badgers', espnId: 275, conference: 'Big Ten', division: 'West' },

  // Pac-12
  { name: 'Arizona Wildcats', espnId: 12, conference: 'Pac-12', division: 'South' },
  { name: 'Arizona State Sun Devils', espnId: 9, conference: 'Pac-12', division: 'South' },
  { name: 'California Golden Bears', espnId: 25, conference: 'Pac-12', division: 'North' },
  { name: 'Colorado Buffaloes', espnId: 38, conference: 'Pac-12', division: 'South' },
  { name: 'Oregon Ducks', espnId: 2483, conference: 'Pac-12', division: 'North' },
  { name: 'Oregon State Beavers', espnId: 204, conference: 'Pac-12', division: 'North' },
  { name: 'Stanford Cardinal', espnId: 24, conference: 'Pac-12', division: 'North' },
  { name: 'UCLA Bruins', espnId: 26, conference: 'Pac-12', division: 'South' },
  { name: 'USC Trojans', espnId: 30, conference: 'Pac-12', division: 'South' },
  { name: 'Utah Utes', espnId: 254, conference: 'Pac-12', division: 'South' },
  { name: 'Washington Huskies', espnId: 264, conference: 'Pac-12', division: 'North' },
  { name: 'Washington State Cougars', espnId: 265, conference: 'Pac-12', division: 'North' },

  // SEC
  { name: 'Alabama Crimson Tide', espnId: 333, conference: 'SEC', division: 'West' },
  { name: 'Arkansas Razorbacks', espnId: 8, conference: 'SEC', division: 'West' },
  { name: 'Auburn Tigers', espnId: 2, conference: 'SEC', division: 'West' },
  { name: 'Florida Gators', espnId: 57, conference: 'SEC', division: 'East' },
  { name: 'Georgia Bulldogs', espnId: 61, conference: 'SEC', division: 'East' },
  { name: 'Kentucky Wildcats', espnId: 96, conference: 'SEC', division: 'East' },
  { name: 'LSU Tigers', espnId: 99, conference: 'SEC', division: 'West' },
  { name: 'Mississippi State Bulldogs', espnId: 344, conference: 'SEC', division: 'West' },
  { name: 'Missouri Tigers', espnId: 142, conference: 'SEC', division: 'East' },
  { name: 'Ole Miss Rebels', espnId: 145, conference: 'SEC', division: 'West' },
  { name: 'South Carolina Gamecocks', espnId: 2579, conference: 'SEC', division: 'East' },
  { name: 'Tennessee Volunteers', espnId: 2633, conference: 'SEC', division: 'East' },
  { name: 'Texas A&M Aggies', espnId: 245, conference: 'SEC', division: 'West' },
  { name: 'Vanderbilt Commodores', espnId: 238, conference: 'SEC', division: 'East' },

  // American Athletic Conference
  { name: 'Cincinnati Bearcats', espnId: 2132, conference: 'American', division: 'East' },
  { name: 'Connecticut Huskies', espnId: 41, conference: 'American', division: 'East' },
  { name: 'East Carolina Pirates', espnId: 151, conference: 'American', division: 'East' },
  { name: 'Houston Cougars', espnId: 248, conference: 'American', division: 'West' },
  { name: 'Memphis Tigers', espnId: 235, conference: 'American', division: 'West' },
  { name: 'Navy Midshipmen', espnId: 2426, conference: 'American', division: 'West' },
  { name: 'SMU Mustangs', espnId: 2567, conference: 'American', division: 'West' },
  { name: 'South Florida Bulls', espnId: 58, conference: 'American', division: 'East' },
  { name: 'Temple Owls', espnId: 218, conference: 'American', division: 'East' },
  { name: 'Tulane Green Wave', espnId: 2655, conference: 'American', division: 'West' },
  { name: 'Tulsa Golden Hurricane', espnId: 202, conference: 'American', division: 'West' },
  { name: 'UCF Knights', espnId: 2116, conference: 'American', division: 'East' },

  // Conference USA
  { name: 'Charlotte 49ers', espnId: 2429, conference: 'C-USA', division: 'East' },
  { name: 'FIU Panthers', espnId: 2229, conference: 'C-USA', division: 'East' },
  { name: 'Florida Atlantic Owls', espnId: 2226, conference: 'C-USA', division: 'East' },
  { name: 'Louisiana Tech Bulldogs', espnId: 2348, conference: 'C-USA', division: 'West' },
  { name: 'Marshall Thundering Herd', espnId: 276, conference: 'C-USA', division: 'East' },
  { name: 'Middle Tennessee Blue Raiders', espnId: 2393, conference: 'C-USA', division: 'East' },
  { name: 'North Texas Mean Green', espnId: 249, conference: 'C-USA', division: 'West' },
  { name: 'Old Dominion Monarchs', espnId: 295, conference: 'C-USA', division: 'East' },
  { name: 'Rice Owls', espnId: 242, conference: 'C-USA', division: 'West' },
  { name: 'Southern Miss Golden Eagles', espnId: 2572, conference: 'C-USA', division: 'West' },
  { name: 'UAB Blazers', espnId: 5, conference: 'C-USA', division: 'West' },
  { name: 'UTEP Miners', espnId: 2638, conference: 'C-USA', division: 'West' },
  { name: 'UTSA Roadrunners', espnId: 2636, conference: 'C-USA', division: 'West' },
  { name: 'Western Kentucky Hilltoppers', espnId: 98, conference: 'C-USA', division: 'East' },

  // Mid-American Conference
  { name: 'Akron Zips', espnId: 2006, conference: 'MAC', division: 'East' },
  { name: 'Ball State Cardinals', espnId: 2050, conference: 'MAC', division: 'West' },
  { name: 'Bowling Green Falcons', espnId: 189, conference: 'MAC', division: 'East' },
  { name: 'Buffalo Bulls', espnId: 2084, conference: 'MAC', division: 'East' },
  { name: 'Central Michigan Chippewas', espnId: 2117, conference: 'MAC', division: 'West' },
  { name: 'Eastern Michigan Eagles', espnId: 2199, conference: 'MAC', division: 'West' },
  { name: 'Kent State Golden Flashes', espnId: 2309, conference: 'MAC', division: 'East' },
  { name: 'Miami RedHawks', espnId: 193, conference: 'MAC', division: 'East' },
  { name: 'Northern Illinois Huskies', espnId: 2459, conference: 'MAC', division: 'West' },
  { name: 'Ohio Bobcats', espnId: 195, conference: 'MAC', division: 'East' },
  { name: 'Toledo Rockets', espnId: 2649, conference: 'MAC', division: 'West' },
  { name: 'Western Michigan Broncos', espnId: 2711, conference: 'MAC', division: 'West' },

  // Mountain West
  { name: 'Air Force Falcons', espnId: 2005, conference: 'Mountain West', division: 'Mountain' },
  { name: 'Boise State Broncos', espnId: 68, conference: 'Mountain West', division: 'Mountain' },
  { name: 'Colorado State Rams', espnId: 36, conference: 'Mountain West', division: 'Mountain' },
  { name: 'Fresno State Bulldogs', espnId: 278, conference: 'Mountain West', division: 'West' },
  { name: 'Hawaii Rainbow Warriors', espnId: 62, conference: 'Mountain West', division: 'West' },
  { name: 'Nevada Wolf Pack', espnId: 2440, conference: 'Mountain West', division: 'West' },
  { name: 'New Mexico Lobos', espnId: 167, conference: 'Mountain West', division: 'Mountain' },
  { name: 'San Diego State Aztecs', espnId: 21, conference: 'Mountain West', division: 'West' },
  { name: 'San Jose State Spartans', espnId: 23, conference: 'Mountain West', division: 'West' },
  { name: 'UNLV Rebels', espnId: 2439, conference: 'Mountain West', division: 'West' },
  { name: 'Utah State Aggies', espnId: 328, conference: 'Mountain West', division: 'Mountain' },
  { name: 'Wyoming Cowboys', espnId: 2751, conference: 'Mountain West', division: 'Mountain' },

  // Sun Belt
  { name: 'Appalachian State Mountaineers', espnId: 2026, conference: 'Sun Belt', division: 'East' },
  { name: 'Arkansas State Red Wolves', espnId: 2032, conference: 'Sun Belt', division: 'West' },
  { name: 'Coastal Carolina Chanticleers', espnId: 324, conference: 'Sun Belt', division: 'East' },
  { name: 'Georgia Southern Eagles', espnId: 290, conference: 'Sun Belt', division: 'East' },
  { name: 'Georgia State Panthers', espnId: 2247, conference: 'Sun Belt', division: 'East' },
  { name: 'Louisiana Ragin Cajuns', espnId: 309, conference: 'Sun Belt', division: 'West' },
  { name: 'Louisiana Monroe Warhawks', espnId: 2433, conference: 'Sun Belt', division: 'West' },
  { name: 'South Alabama Jaguars', espnId: 6, conference: 'Sun Belt', division: 'West' },
  { name: 'Texas State Bobcats', espnId: 326, conference: 'Sun Belt', division: 'West' },
  { name: 'Troy Trojans', espnId: 2653, conference: 'Sun Belt', division: 'East' },

  // Independents
  { name: 'Army Black Knights', espnId: 349, conference: 'Independent', division: '' },
  { name: 'BYU Cougars', espnId: 252, conference: 'Independent', division: '' },
  { name: 'Liberty Flames', espnId: 2335, conference: 'Independent', division: '' },
  { name: 'New Mexico State Aggies', espnId: 166, conference: 'Independent', division: '' },
  { name: 'Notre Dame Fighting Irish', espnId: 87, conference: 'Independent', division: '' },
  { name: 'UMass Minutemen', espnId: 113, conference: 'Independent', division: '' }
]

async function seedFBSTeams() {
  console.log('🏈 Starting FBS teams seed...')

  let created = 0
  let updated = 0

  // Insert or update FBS teams
  for (const team of fbsTeams) {
    const existingTeam = await prisma.team.findFirst({
      where: {
        OR: [
          { name: team.name },
          { espnId: team.espnId }
        ]
      }
    })

    if (existingTeam) {
      // Update existing team
      await prisma.team.update({
        where: { id: existingTeam.id },
        data: {
          name: team.name,
          league: 'COLLEGE',
          espnId: team.espnId,
          conference: team.conference,
          division: team.division
          // Keep existing wins, losses, ties
        }
      })
      updated++
    } else {
      // Create new team
      await prisma.team.create({
        data: {
          name: team.name,
          league: 'COLLEGE',
          espnId: team.espnId,
          conference: team.conference,
          division: team.division,
          wins: 0,
          losses: 0,
          ties: 0
        }
      })
      created++
    }
  }

  console.log(`✅ FBS teams processing complete`)
  console.log(`📊 Created: ${created} teams`)
  console.log(`🔄 Updated: ${updated} teams`)

  console.log(`✅ Seeded ${fbsTeams.length} FBS teams`)
  console.log('📊 Summary:')
  console.log(`  - ACC: 14 teams`)
  console.log(`  - Big 12: 10 teams`) 
  console.log(`  - Big Ten: 14 teams`)
  console.log(`  - Pac-12: 12 teams`)
  console.log(`  - SEC: 14 teams`)
  console.log(`  - American: 12 teams`)
  console.log(`  - C-USA: 14 teams`)
  console.log(`  - MAC: 12 teams`)
  console.log(`  - Mountain West: 12 teams`)
  console.log(`  - Sun Belt: 10 teams`)
  console.log(`  - Independent: 6 teams`)
  console.log(`  - Total: ${fbsTeams.length} FBS teams`)
}

async function main() {
  try {
    await seedFBSTeams()
  } catch (error) {
    console.error('❌ Error seeding FBS teams:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main()
}

export default main