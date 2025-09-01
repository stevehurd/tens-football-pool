import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Major conference mappings for college football
const conferenceMapping: Record<string, string> = {
  // SEC
  'Alabama Crimson Tide': 'SEC',
  'Arkansas Razorbacks': 'SEC',
  'Auburn Tigers': 'SEC',
  'Florida Gators': 'SEC',
  'Georgia Bulldogs': 'SEC',
  'Kentucky Wildcats': 'SEC',
  'LSU Tigers': 'SEC',
  'Ole Miss Rebels': 'SEC',
  'Mississippi State Bulldogs': 'SEC',
  'Missouri Tigers': 'SEC',
  'South Carolina Gamecocks': 'SEC',
  'Tennessee Volunteers': 'SEC',
  'Texas A&M Aggies': 'SEC',
  'Vanderbilt Commodores': 'SEC',
  'Texas Longhorns': 'SEC',
  'Oklahoma Sooners': 'SEC',

  // Big Ten
  'Illinois Fighting Illini': 'Big Ten',
  'Indiana Hoosiers': 'Big Ten',
  'Iowa Hawkeyes': 'Big Ten',
  'Maryland Terrapins': 'Big Ten',
  'Michigan Wolverines': 'Big Ten',
  'Michigan State Spartans': 'Big Ten',
  'Minnesota Golden Gophers': 'Big Ten',
  'Nebraska Cornhuskers': 'Big Ten',
  'Northwestern Wildcats': 'Big Ten',
  'Ohio State Buckeyes': 'Big Ten',
  'Penn State Nittany Lions': 'Big Ten',
  'Purdue Boilermakers': 'Big Ten',
  'Rutgers Scarlet Knights': 'Big Ten',
  'Wisconsin Badgers': 'Big Ten',
  'Oregon Ducks': 'Big Ten',
  'UCLA Bruins': 'Big Ten',
  'USC Trojans': 'Big Ten',
  'Washington Huskies': 'Big Ten',

  // ACC
  'Boston College Eagles': 'ACC',
  'Clemson Tigers': 'ACC',
  'Duke Blue Devils': 'ACC',
  'Florida State Seminoles': 'ACC',
  'Georgia Tech Yellow Jackets': 'ACC',
  'Louisville Cardinals': 'ACC',
  'Miami Hurricanes': 'ACC',
  'NC State Wolfpack': 'ACC',
  'North Carolina Tar Heels': 'ACC',
  'Pittsburgh Panthers': 'ACC',
  'Syracuse Orange': 'ACC',
  'Virginia Cavaliers': 'ACC',
  'Virginia Tech Hokies': 'ACC',
  'Wake Forest Demon Deacons': 'ACC',
  'Notre Dame Fighting Irish': 'ACC',
  'SMU Mustangs': 'ACC',
  'Cal Golden Bears': 'ACC',
  'Stanford Cardinal': 'ACC',

  // Big 12
  'Baylor Bears': 'Big 12',
  'BYU Cougars': 'Big 12',
  'Cincinnati Bearcats': 'Big 12',
  'Houston Cougars': 'Big 12',
  'Iowa State Cyclones': 'Big 12',
  'Kansas Jayhawks': 'Big 12',
  'Kansas State Wildcats': 'Big 12',
  'Oklahoma State Cowboys': 'Big 12',
  'TCU Horned Frogs': 'Big 12',
  'Texas Tech Red Raiders': 'Big 12',
  'UCF Knights': 'Big 12',
  'West Virginia Mountaineers': 'Big 12',
  'Arizona Wildcats': 'Big 12',
  'Arizona State Sun Devils': 'Big 12',
  'Colorado Buffaloes': 'Big 12',
  'Utah Utes': 'Big 12',

  // Pac-12 (remaining)
  'California Golden Bears': 'Pac-12',
  'Oregon State Beavers': 'Pac-12',
  'Washington State Cougars': 'Pac-12',

  // American Athletic Conference
  'East Carolina Pirates': 'American',
  'Memphis Tigers': 'American',
  'Navy Midshipmen': 'American',
  'South Florida Bulls': 'American',
  'Temple Owls': 'American',
  'Tulane Green Wave': 'American',
  'Tulsa Golden Hurricane': 'American',
  'UAB Blazers': 'American',
  'UTSA Roadrunners': 'American',
  'Wichita State Shockers': 'American',
  'Charlotte 49ers': 'American',
  'Florida Atlantic Owls': 'American',
  'North Texas Mean Green': 'American',
  'Rice Owls': 'American',

  // Mountain West
  'Air Force Falcons': 'Mountain West',
  'Boise State Broncos': 'Mountain West',
  'Colorado State Rams': 'Mountain West',
  'Fresno State Bulldogs': 'Mountain West',
  'Hawai\'i Rainbow Warriors': 'Mountain West',
  'Nevada Wolf Pack': 'Mountain West',
  'New Mexico Lobos': 'Mountain West',
  'San Diego State Aztecs': 'Mountain West',
  'San José State Spartans': 'Mountain West',
  'UNLV Rebels': 'Mountain West',
  'Utah State Aggies': 'Mountain West',
  'Wyoming Cowboys': 'Mountain West',

  // Conference USA
  'Florida International Panthers': 'C-USA',
  'Louisiana Tech Bulldogs': 'C-USA',
  'Marshall Thundering Herd': 'C-USA',
  'Middle Tennessee Blue Raiders': 'C-USA',
  'New Mexico State Aggies': 'C-USA',
  'Old Dominion Monarchs': 'C-USA',
  'Sam Houston Bearkats': 'C-USA',
  'UTEP Miners': 'C-USA',
  'Western Kentucky Hilltoppers': 'C-USA',

  // Sun Belt
  'Appalachian State Mountaineers': 'Sun Belt',
  'Arkansas State Red Wolves': 'Sun Belt',
  'Coastal Carolina Chanticleers': 'Sun Belt',
  'Georgia Southern Eagles': 'Sun Belt',
  'Georgia State Panthers': 'Sun Belt',
  'James Madison Dukes': 'Sun Belt',
  'Louisiana Ragin\' Cajuns': 'Sun Belt',
  'Louisiana Monroe Warhawks': 'Sun Belt',
  'Marshall Thundering Herd': 'Sun Belt',
  'Old Dominion Monarchs': 'Sun Belt',
  'South Alabama Jaguars': 'Sun Belt',
  'Southern Miss Golden Eagles': 'Sun Belt',
  'Texas State Bobcats': 'Sun Belt',
  'Troy Trojans': 'Sun Belt',

  // MAC
  'Akron Zips': 'MAC',
  'Ball State Cardinals': 'MAC',
  'Bowling Green Falcons': 'MAC',
  'Buffalo Bulls': 'MAC',
  'Central Michigan Chippewas': 'MAC',
  'Eastern Michigan Eagles': 'MAC',
  'Kent State Golden Flashes': 'MAC',
  'Miami (OH) RedHawks': 'MAC',
  'Northern Illinois Huskies': 'MAC',
  'Ohio Bobcats': 'MAC',
  'Toledo Rockets': 'MAC',
  'Western Michigan Broncos': 'MAC',

  // Independent
  'Army Black Knights': 'Independent',
  'Connecticut Huskies': 'Independent',
  'Massachusetts Minutemen': 'Independent',
  'Notre Dame Fighting Irish': 'Independent',
  'New Mexico State Aggies': 'Independent',
  'UConn Huskies': 'Independent',

  // Ivy League
  'Brown Bears': 'Ivy League',
  'Columbia Lions': 'Ivy League',
  'Cornell Big Red': 'Ivy League',
  'Dartmouth Big Green': 'Ivy League',
  'Harvard Crimson': 'Ivy League',
  'Pennsylvania Quakers': 'Ivy League',
  'Princeton Tigers': 'Ivy League',
  'Yale Bulldogs': 'Ivy League',

  // MEAC
  'Florida A&M Rattlers': 'MEAC',
  'Howard Bison': 'MEAC',

  // Big Sky
  'Idaho State Bengals': 'Big Sky',
  'Montana Grizzlies': 'Big Sky',
  'Montana State Bobcats': 'Big Sky',

  // CAA
  'Delaware Blue Hens': 'CAA',
  'New Hampshire Wildcats': 'CAA',
  'Rhode Island Rams': 'CAA',
  'Villanova Wildcats': 'CAA',

  // Southern Conference
  'Chattanooga Mocs': 'Southern Conference',
  'Furman Paladins': 'Southern Conference',

  // Missouri Valley
  'Illinois State Redbirds': 'Missouri Valley',
  'Indiana State Sycamores': 'Missouri Valley',
  'Murray State Racers': 'Missouri Valley',
  'Southern Illinois Salukis': 'Missouri Valley',

  // Patriot League
  'Georgetown Hoyas': 'Patriot League',
  'Holy Cross Crusaders': 'Patriot League',

  // Pioneer Football League
  'San Diego Toreros': 'Pioneer Football League',

  // Division II/III - General categories
  'Sacramento State Hornets': 'Big Sky',
  'Cal Poly Mustangs': 'Big Sky',
  'UC Davis Aggies': 'Big Sky'
}

async function setMajorConferences() {
  console.log('🎓 Setting major college football conferences...')
  
  const collegeTeams = await prisma.team.findMany({
    where: { league: 'COLLEGE' }
  })
  
  let updatedCount = 0
  let notFoundCount = 0
  
  for (const team of collegeTeams) {
    const conference = conferenceMapping[team.name]
    
    if (conference) {
      try {
        await prisma.team.update({
          where: { id: team.id },
          data: { conference }
        })
        console.log(`✅ ${team.name} → ${conference}`)
        updatedCount++
      } catch (error) {
        console.log(`❌ Failed to update ${team.name}: ${error}`)
        notFoundCount++
      }
    } else {
      // Set smaller schools to "Other" or based on common patterns
      let inferredConference = 'Other'
      
      // Try to infer conference from team name patterns
      const name = team.name.toLowerCase()
      if (name.includes('state') && !['ohio state', 'penn state', 'michigan state', 'iowa state', 'kansas state', 'oklahoma state', 'arizona state', 'montana state', 'florida state', 'nc state'].some(s => name.includes(s))) {
        inferredConference = 'Division II'
      } else if (name.includes('college') || name.includes('university')) {
        inferredConference = 'Division III'
      }
      
      try {
        await prisma.team.update({
          where: { id: team.id },
          data: { conference: inferredConference }
        })
        console.log(`⚠️ ${team.name} → ${inferredConference} (inferred)`)
        updatedCount++
      } catch (error) {
        console.log(`❌ Failed to update ${team.name}: ${error}`)
        notFoundCount++
      }
    }
  }
  
  console.log(`\n📊 Conference assignment complete:`)
  console.log(`✅ Updated: ${updatedCount} teams`)
  console.log(`❌ Errors: ${notFoundCount} teams`)
  console.log(`📈 Success rate: ${((updatedCount / collegeTeams.length) * 100).toFixed(1)}%`)
}

async function main() {
  try {
    await setMajorConferences()
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