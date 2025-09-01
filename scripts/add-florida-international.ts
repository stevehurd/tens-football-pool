import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addFloridaInternational() {
  console.log('Adding Florida International team...')

  try {
    await prisma.team.upsert({
      where: { name: 'Florida International' },
      update: {},
      create: {
        name: 'Florida International',
        league: 'COLLEGE',
        conference: 'Conference USA'
      },
    })
    console.log('✅ Added: Florida International')
  } catch (error) {
    console.log(`❌ Failed to add Florida International: ${error}`)
  }

  console.log('Florida International team added!')
}

async function main() {
  try {
    await addFloridaInternational()
  } catch (error) {
    console.error('Failed to add Florida International:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()