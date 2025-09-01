import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addSouthFlorida() {
  console.log('Adding South Florida team...')

  try {
    await prisma.team.upsert({
      where: { name: 'South Florida' },
      update: {},
      create: {
        name: 'South Florida',
        league: 'COLLEGE',
        conference: 'American Athletic'
      },
    })
    console.log('✅ Added: South Florida')
  } catch (error) {
    console.log(`❌ Failed to add South Florida: ${error}`)
  }

  console.log('South Florida team added!')
}

async function main() {
  try {
    await addSouthFlorida()
  } catch (error) {
    console.error('Failed to add South Florida:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()