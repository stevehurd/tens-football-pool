import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // NFL Teams
  const nflTeams = [
    // AFC East
    { name: 'Buffalo Bills', abbreviation: 'BUF', league: 'NFL', division: 'AFC East' },
    { name: 'Miami Dolphins', abbreviation: 'MIA', league: 'NFL', division: 'AFC East' },
    { name: 'New England Patriots', abbreviation: 'NE', league: 'NFL', division: 'AFC East' },
    { name: 'New York Jets', abbreviation: 'NYJ', league: 'NFL', division: 'AFC East' },
    
    // AFC North
    { name: 'Baltimore Ravens', abbreviation: 'BAL', league: 'NFL', division: 'AFC North' },
    { name: 'Cincinnati Bengals', abbreviation: 'CIN', league: 'NFL', division: 'AFC North' },
    { name: 'Cleveland Browns', abbreviation: 'CLE', league: 'NFL', division: 'AFC North' },
    { name: 'Pittsburgh Steelers', abbreviation: 'PIT', league: 'NFL', division: 'AFC North' },
    
    // AFC South
    { name: 'Houston Texans', abbreviation: 'HOU', league: 'NFL', division: 'AFC South' },
    { name: 'Indianapolis Colts', abbreviation: 'IND', league: 'NFL', division: 'AFC South' },
    { name: 'Jacksonville Jaguars', abbreviation: 'JAX', league: 'NFL', division: 'AFC South' },
    { name: 'Tennessee Titans', abbreviation: 'TEN', league: 'NFL', division: 'AFC South' },
    
    // AFC West
    { name: 'Denver Broncos', abbreviation: 'DEN', league: 'NFL', division: 'AFC West' },
    { name: 'Kansas City Chiefs', abbreviation: 'KC', league: 'NFL', division: 'AFC West' },
    { name: 'Las Vegas Raiders', abbreviation: 'LV', league: 'NFL', division: 'AFC West' },
    { name: 'Los Angeles Chargers', abbreviation: 'LAC', league: 'NFL', division: 'AFC West' },
    
    // NFC East
    { name: 'Dallas Cowboys', abbreviation: 'DAL', league: 'NFL', division: 'NFC East' },
    { name: 'New York Giants', abbreviation: 'NYG', league: 'NFL', division: 'NFC East' },
    { name: 'Philadelphia Eagles', abbreviation: 'PHI', league: 'NFL', division: 'NFC East' },
    { name: 'Washington Commanders', abbreviation: 'WAS', league: 'NFL', division: 'NFC East' },
    
    // NFC North
    { name: 'Chicago Bears', abbreviation: 'CHI', league: 'NFL', division: 'NFC North' },
    { name: 'Detroit Lions', abbreviation: 'DET', league: 'NFL', division: 'NFC North' },
    { name: 'Green Bay Packers', abbreviation: 'GB', league: 'NFL', division: 'NFC North' },
    { name: 'Minnesota Vikings', abbreviation: 'MIN', league: 'NFL', division: 'NFC North' },
    
    // NFC South
    { name: 'Atlanta Falcons', abbreviation: 'ATL', league: 'NFL', division: 'NFC South' },
    { name: 'Carolina Panthers', abbreviation: 'CAR', league: 'NFL', division: 'NFC South' },
    { name: 'New Orleans Saints', abbreviation: 'NO', league: 'NFL', division: 'NFC South' },
    { name: 'Tampa Bay Buccaneers', abbreviation: 'TB', league: 'NFL', division: 'NFC South' },
    
    // NFC West
    { name: 'Arizona Cardinals', abbreviation: 'ARI', league: 'NFL', division: 'NFC West' },
    { name: 'Los Angeles Rams', abbreviation: 'LAR', league: 'NFL', division: 'NFC West' },
    { name: 'San Francisco 49ers', abbreviation: 'SF', league: 'NFL', division: 'NFC West' },
    { name: 'Seattle Seahawks', abbreviation: 'SEA', league: 'NFL', division: 'NFC West' },
  ]

  // Major College Teams
  const collegeTeams = [
    // SEC
    { name: 'Alabama', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Georgia', league: 'COLLEGE', conference: 'SEC' },
    { name: 'LSU', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Florida', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Auburn', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Tennessee', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Texas A&M', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Arkansas', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Kentucky', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Mississippi', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Mississippi State', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Missouri', league: 'COLLEGE', conference: 'SEC' },
    { name: 'South Carolina', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Vanderbilt', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Texas', league: 'COLLEGE', conference: 'SEC' },
    { name: 'Oklahoma', league: 'COLLEGE', conference: 'SEC' },
    
    // Big Ten
    { name: 'Ohio State', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Michigan', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Penn State', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Wisconsin', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Iowa', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Minnesota', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Michigan State', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Indiana', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Illinois', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Northwestern', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Purdue', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Nebraska', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Maryland', league: 'COLLEGE', conference: 'Big Ten' },
    { name: 'Rutgers', league: 'COLLEGE', conference: 'Big Ten' },
    
    // ACC
    { name: 'Clemson', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Florida State', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Miami (FL)', league: 'COLLEGE', conference: 'ACC' },
    { name: 'North Carolina', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Duke', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Virginia', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Virginia Tech', league: 'COLLEGE', conference: 'ACC' },
    { name: 'NC State', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Wake Forest', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Pittsburgh', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Louisville', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Syracuse', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Boston College', league: 'COLLEGE', conference: 'ACC' },
    { name: 'Georgia Tech', league: 'COLLEGE', conference: 'ACC' },
    
    // Big 12
    { name: 'Baylor', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'Iowa State', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'Kansas', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'Kansas State', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'Oklahoma State', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'TCU', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'Texas Tech', league: 'COLLEGE', conference: 'Big 12' },
    { name: 'West Virginia', league: 'COLLEGE', conference: 'Big 12' },
    
    // Pac-12
    { name: 'USC', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'UCLA', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Oregon', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Oregon State', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Washington', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Washington State', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Stanford', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'California', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Arizona', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Arizona State', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Colorado', league: 'COLLEGE', conference: 'Pac-12' },
    { name: 'Utah', league: 'COLLEGE', conference: 'Pac-12' },
    
    // Independent & Others
    { name: 'Notre Dame', league: 'COLLEGE', conference: 'Independent' },
    { name: 'BYU', league: 'COLLEGE', conference: 'Independent' },
    { name: 'Army', league: 'COLLEGE', conference: 'Independent' },
    { name: 'Navy', league: 'COLLEGE', conference: 'Independent' },
  ]

  // Create NFL teams
  for (const team of nflTeams) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: {},
      create: team,
    })
  }

  // Create college teams
  for (const team of collegeTeams) {
    await prisma.team.upsert({
      where: { name: team.name },
      update: {},
      create: team,
    })
  }

  // Create sample participants
  const participants = [
    'Steve', 'Daryl', 'Brian', 'Reilly', 'Al', 'KOB', 'Scotty', 'Kenny', 
    'Marty', 'Goody', 'Mario', 'Petrucci', 'Steamer', 'Knowles', 'Bocklet'
  ]

  for (const name of participants) {
    await prisma.participant.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }

  // Create current season
  await prisma.season.upsert({
    where: { year: 2024 },
    update: {},
    create: {
      year: 2024,
      isActive: true,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-01-15'),
    },
  })

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })