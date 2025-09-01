import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Draft data extracted from Google Sheet
const draftData = [
  {
    name: 'Steve',
    picks: ['49ers', 'Penn State', 'LA Rams', 'Ohio', 'North Carolina', 'Texas State', 'NC State', 'Hawaii', 'Arizona', 'UL-Monroe']
  },
  {
    name: 'Daryl', 
    picks: ['Detroit Lions', 'Michigan', 'Seattle Seahawks', 'Auburn', 'Virginia Tech', 'Houston NCAA', 'Florida', 'Baylor', 'Arkansas', 'Old Dominion']
  },
  {
    name: 'Brian',
    picks: ['GB Packers', 'Alabama', 'Jax Jags', 'Oklahoma', 'Ole Miss', 'Oklahoma State', 'Michigan State', 'App State', 'Ball State', 'Northwestern']
  },
  {
    name: 'Reilly',
    picks: ['TB Bucs', 'Louisville', 'Arizona Cardinals', 'SMU', 'Florida International', 'South Florida', 'Virginia', 'South Alabama', 'North Texas', 'SD State']
  },
  {
    name: 'Al',
    picks: ['Cincy Bengals', 'BYU', 'Baltimore Ravens', 'Kansas State', 'Maryland', 'Wake Forest', 'Marshall', 'Illinois', 'Western Michigan', 'MTSU']
  },
  {
    name: 'KOB',
    picks: ['Buffalo Bills', 'Georgia', 'Minnesota Vikings', 'LSU', 'Tennessee', 'South Carolina', 'Mississippi State', 'Vanderbilt', 'Missouri', 'Kentucky']
  },
  {
    name: 'Scotty',
    picks: ['Kansas City Chiefs', 'Notre Dame', 'NY Jets', 'USC', 'UCLA', 'Stanford', 'California', 'Oregon', 'Oregon State', 'Washington']
  },
  {
    name: 'Kenny',
    picks: ['Dallas Cowboys', 'Texas A&M', 'Philadelphia Eagles', 'Clemson', 'Miami (FL)', 'Florida State', 'Duke', 'NC State', 'Virginia Tech', 'Wake Forest']
  },
  {
    name: 'Marty',
    picks: ['New England Patriots', 'Wisconsin', 'Indianapolis Colts', 'Iowa', 'Minnesota', 'Michigan State', 'Indiana', 'Illinois', 'Northwestern', 'Purdue']
  },
  {
    name: 'Goody',
    picks: ['Las Vegas Raiders', 'Colorado', 'Denver Broncos', 'Utah', 'Arizona', 'Arizona State', 'Washington State', 'Oregon State', 'Stanford', 'California']
  },
  {
    name: 'Mario',
    picks: ['Los Angeles Chargers', 'Texas', 'Houston Texans', 'Oklahoma', 'Baylor', 'TCU', 'Texas Tech', 'Iowa State', 'Kansas', 'Kansas State']
  },
  {
    name: 'Petrucci',
    picks: ['Tampa Bay Buccaneers', 'Ohio State', 'Carolina Panthers', 'Michigan', 'Penn State', 'Wisconsin', 'Iowa', 'Minnesota', 'Indiana', 'Purdue']
  },
  {
    name: 'Steamer',
    picks: ['Washington Commanders', 'Alabama', 'New Orleans Saints', 'Auburn', 'Georgia', 'Florida', 'Tennessee', 'Kentucky', 'Vanderbilt', 'Missouri']
  },
  {
    name: 'Knowles',
    picks: ['Chicago Bears', 'Pittsburgh', 'Cleveland Browns', 'Syracuse', 'Boston College', 'Louisville', 'Virginia', 'Duke', 'Wake Forest', 'NC State']
  },
  {
    name: 'Bocklet',
    picks: ['Green Bay Packers', 'West Virginia', 'Pittsburgh Steelers', 'Oklahoma State', 'Baylor', 'TCU', 'Texas Tech', 'Kansas', 'Kansas State', 'Iowa State']
  }
]

// Team name mappings to handle variations
const teamMappings: { [key: string]: string } = {
  // NFL team mappings
  '49ers': 'San Francisco 49ers',
  'LA Rams': 'Los Angeles Rams', 
  'Detroit Lions': 'Detroit Lions',
  'Seattle Seahawks': 'Seattle Seahawks',
  'GB Packers': 'Green Bay Packers',
  'Jax Jags': 'Jacksonville Jaguars',
  'TB Bucs': 'Tampa Bay Buccaneers',
  'Arizona Cardinals': 'Arizona Cardinals',
  'Cincy Bengals': 'Cincinnati Bengals',
  'Baltimore Ravens': 'Baltimore Ravens',
  'Buffalo Bills': 'Buffalo Bills',
  'Minnesota Vikings': 'Minnesota Vikings',
  'Kansas City Chiefs': 'Kansas City Chiefs',
  'NY Jets': 'New York Jets',
  'Dallas Cowboys': 'Dallas Cowboys',
  'Philadelphia Eagles': 'Philadelphia Eagles',
  'New England Patriots': 'New England Patriots',
  'Indianapolis Colts': 'Indianapolis Colts',
  'Las Vegas Raiders': 'Las Vegas Raiders',
  'Denver Broncos': 'Denver Broncos',
  'Los Angeles Chargers': 'Los Angeles Chargers',
  'Houston Texans': 'Houston Texans',
  'Tampa Bay Buccaneers': 'Tampa Bay Buccaneers',
  'Carolina Panthers': 'Carolina Panthers',
  'Washington Commanders': 'Washington Commanders',
  'New Orleans Saints': 'New Orleans Saints',
  'Chicago Bears': 'Chicago Bears',
  'Cleveland Browns': 'Cleveland Browns',
  'Green Bay Packers': 'Green Bay Packers',
  'Pittsburgh Steelers': 'Pittsburgh Steelers',

  // College team mappings
  'Penn State': 'Penn State',
  'Ohio': 'Ohio State', // Assuming this meant Ohio State
  'North Carolina': 'North Carolina',
  'Texas State': 'Texas State',
  'NC State': 'NC State',
  'Hawaii': 'Hawaii',
  'Arizona': 'Arizona',
  'UL-Monroe': 'Louisiana-Monroe',
  'Michigan': 'Michigan',
  'Auburn': 'Auburn',
  'Virginia Tech': 'Virginia Tech',
  'Houston NCAA': 'Houston',
  'Florida': 'Florida',
  'Baylor': 'Baylor',
  'Arkansas': 'Arkansas',
  'Old Dominion': 'Old Dominion',
  'Alabama': 'Alabama',
  'Oklahoma': 'Oklahoma',
  'Ole Miss': 'Mississippi',
  'Oklahoma State': 'Oklahoma State',
  'Michigan State': 'Michigan State',
  'App State': 'Appalachian State',
  'Ball State': 'Ball State',
  'Northwestern': 'Northwestern',
  'Louisville': 'Louisville',
  'SMU': 'SMU',
  'Florida International': 'Florida International',
  'South Florida': 'South Florida',
  'Virginia': 'Virginia',
  'South Alabama': 'South Alabama',
  'North Texas': 'North Texas',
  'SD State': 'San Diego State',
  'BYU': 'BYU',
  'Kansas State': 'Kansas State',
  'Maryland': 'Maryland',
  'Wake Forest': 'Wake Forest',
  'Marshall': 'Marshall',
  'Illinois': 'Illinois',
  'Western Michigan': 'Western Michigan',
  'MTSU': 'Middle Tennessee',
  'Georgia': 'Georgia',
  'LSU': 'LSU',
  'Tennessee': 'Tennessee',
  'South Carolina': 'South Carolina',
  'Mississippi State': 'Mississippi State',
  'Vanderbilt': 'Vanderbilt',
  'Missouri': 'Missouri',
  'Kentucky': 'Kentucky',
  'Notre Dame': 'Notre Dame',
  'USC': 'USC',
  'UCLA': 'UCLA',
  'Stanford': 'Stanford',
  'California': 'California',
  'Oregon': 'Oregon',
  'Oregon State': 'Oregon State',
  'Washington': 'Washington',
  'Texas A&M': 'Texas A&M',
  'Clemson': 'Clemson',
  'Miami (FL)': 'Miami (FL)',
  'Florida State': 'Florida State',
  'Duke': 'Duke',
  'Wisconsin': 'Wisconsin',
  'Iowa': 'Iowa',
  'Minnesota': 'Minnesota',
  'Indiana': 'Indiana',
  'Purdue': 'Purdue',
  'Colorado': 'Colorado',
  'Utah': 'Utah',
  'Arizona State': 'Arizona State',
  'Washington State': 'Washington State',
  'Texas': 'Texas',
  'TCU': 'TCU',
  'Texas Tech': 'Texas Tech',
  'Iowa State': 'Iowa State',
  'Kansas': 'Kansas',
  'Ohio State': 'Ohio State',
  'Pittsburgh': 'Pittsburgh',
  'Syracuse': 'Syracuse',
  'Boston College': 'Boston College',
  'West Virginia': 'West Virginia'
}

async function importGoogleSheetData() {
  console.log('Starting Google Sheet import...')

  // Get all teams and participants from database
  const teams = await prisma.team.findMany()
  const participants = await prisma.participant.findMany()

  // Create lookup maps
  const teamLookup = new Map()
  teams.forEach(team => {
    teamLookup.set(team.name.toLowerCase(), team)
    if (team.abbreviation) {
      teamLookup.set(team.abbreviation.toLowerCase(), team)
    }
  })

  const participantLookup = new Map()
  participants.forEach(participant => {
    participantLookup.set(participant.name.toLowerCase(), participant)
  })

  let importCount = 0
  let errorCount = 0

  for (const draft of draftData) {
    const participant = participantLookup.get(draft.name.toLowerCase())
    if (!participant) {
      console.log(`❌ Participant not found: ${draft.name}`)
      errorCount++
      continue
    }

    console.log(`\n📝 Processing ${draft.name}...`)

    // Clear existing selections for this participant
    await prisma.selection.deleteMany({
      where: { participantId: participant.id }
    })

    let nflCount = 0
    let collegeCount = 0

    for (let i = 0; i < draft.picks.length; i++) {
      const pickName = draft.picks[i]
      const mappedName = teamMappings[pickName] || pickName
      
      // Try to find the team
      let team = teamLookup.get(mappedName.toLowerCase())
      
      if (!team) {
        // Try partial matching for team names
        for (const [dbTeamName, dbTeam] of teamLookup) {
          if (dbTeamName.includes(mappedName.toLowerCase()) || 
              mappedName.toLowerCase().includes(dbTeamName)) {
            team = dbTeam
            break
          }
        }
      }

      if (!team) {
        console.log(`  ❌ Team not found: ${pickName} (mapped to: ${mappedName})`)
        errorCount++
        continue
      }

      // Determine selection type and validate limits
      let selectionType = team.league
      if (selectionType === 'NFL' && nflCount >= 2) {
        selectionType = 'COLLEGE' // Force to college if NFL limit reached
      } else if (selectionType === 'COLLEGE' && collegeCount >= 8) {
        selectionType = 'NFL' // Force to NFL if college limit reached
      }

      if (selectionType === 'NFL') nflCount++
      else collegeCount++

      try {
        await prisma.selection.create({
          data: {
            participantId: participant.id,
            teamId: team.id,
            selectionType,
            pickNumber: i + 1
          }
        })

        console.log(`  ✅ Pick ${i + 1}: ${team.name} (${selectionType})`)
        importCount++
      } catch (error) {
        console.log(`  ❌ Failed to create selection for ${team.name}: ${error}`)
        errorCount++
      }
    }

    console.log(`  📊 ${draft.name}: ${nflCount} NFL, ${collegeCount} college teams`)
  }

  console.log(`\n🎉 Import complete!`)
  console.log(`✅ Successfully imported: ${importCount} selections`)
  console.log(`❌ Errors: ${errorCount}`)
}

async function main() {
  try {
    await importGoogleSheetData()
  } catch (error) {
    console.error('Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()