import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addMissouriStateManual() {
  console.log('🐻 Adding Missouri State Bears manually...')
  
  try {
    // First check if they already exist
    const existing = await prisma.team.findFirst({
      where: {
        OR: [
          { name: 'Missouri State Bears' },
          { espnId: 2623 }
        ]
      }
    })
    
    if (existing) {
      console.log(`⚠️  Missouri State Bears already exists: ${existing.name} (ESPN ID: ${existing.espnId})`)
      return
    }
    
    // Get their logo from ESPN
    console.log('📡 Fetching logo from ESPN...')
    let logoUrl = ''
    
    try {
      const logoResponse = await fetch('https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png')
      if (logoResponse.ok) {
        logoUrl = 'https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png'
        console.log(`✅ Logo found: ${logoUrl}`)
      } else {
        console.log('⚠️  Logo not found, will add without logo')
      }
    } catch (error) {
      console.log('⚠️  Error fetching logo, will add without logo')
    }
    
    // Add Missouri State Bears to database
    console.log('📝 Adding to database...')
    
    const newTeam = await prisma.team.create({
      data: {
        name: 'Missouri State Bears',
        abbreviation: 'MOST', // Common abbreviation for Missouri State
        league: 'COLLEGE',
        conference: 'Conference USA', // They're joining Conference USA in 2025
        espnId: 2623, // From ESPN search
        logoUrl: logoUrl,
        wins: 0,
        losses: 0
      }
    })
    
    console.log(`✅ Successfully added Missouri State Bears`)
    console.log(`   ID: ${newTeam.id}`)
    console.log(`   ESPN ID: ${newTeam.espnId}`)
    console.log(`   Conference: ${newTeam.conference}`)
    console.log(`   Logo: ${newTeam.logoUrl}`)
    
    // Final count check
    console.log('\n📊 Final team counts:')
    const totalTeams = await prisma.team.count()
    const nflTeams = await prisma.team.count({ where: { league: 'NFL' } })
    const collegeTeams = await prisma.team.count({ where: { league: 'COLLEGE' } })
    const cusaTeams = await prisma.team.count({ where: { conference: 'Conference USA' } })
    
    console.log(`Total teams: ${totalTeams}`)
    console.log(`NFL teams: ${nflTeams}`)
    console.log(`College teams: ${collegeTeams}`)
    console.log(`Conference USA teams: ${cusaTeams}`)
    
    if (collegeTeams === 134) {
      console.log('🎉 Perfect! We now have exactly 134 FBS teams')
    } else if (collegeTeams === 135) {
      console.log('⚠️  We have 135 college teams - need to remove 1 duplicate')
    } else {
      console.log(`⚠️  Expected 134 college teams, but have ${collegeTeams}`)
    }
    
    // List Conference USA teams
    console.log('\n📋 Conference USA teams:')
    const cusaTeamsList = await prisma.team.findMany({
      where: { conference: 'Conference USA' },
      select: { name: true, espnId: true }
    })
    
    cusaTeamsList.forEach(team => {
      console.log(`  - ${team.name} (ESPN ID: ${team.espnId})`)
    })
    
  } catch (error) {
    console.error('❌ Error adding Missouri State Bears:', error)
  }
}

addMissouriStateManual()
  .catch(console.error)
  .finally(() => prisma.$disconnect())