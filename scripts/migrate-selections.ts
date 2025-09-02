import { PrismaClient } from '@prisma/client'

// Create two Prisma clients - one for SQLite, one for PostgreSQL
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
})

const postgresClient = new PrismaClient() // Uses current DATABASE_URL

async function migrateSelections() {
  console.log('🔄 Migrating selections from SQLite to PostgreSQL...')
  
  try {
    // Get all participants from SQLite
    const sqliteParticipants = await sqliteClient.participant.findMany({
      include: {
        selections: {
          include: {
            team: true
          }
        }
      }
    })
    
    console.log(`Found ${sqliteParticipants.length} participants in SQLite`)
    
    let totalSelections = 0
    
    for (const participant of sqliteParticipants) {
      console.log(`\n👤 Processing ${participant.name} (${participant.selections.length} selections)`)
      
      // First, make sure participant exists in PostgreSQL
      const existingParticipant = await postgresClient.participant.upsert({
        where: { name: participant.name },
        create: {
          name: participant.name
        },
        update: {}
      })
      
      // Now migrate their selections
      for (const selection of participant.selections) {
        console.log(`  📝 Migrating selection: ${selection.team.name}`)
        
        // Find the team in PostgreSQL by name (since IDs will be different)
        const postgresTeam = await postgresClient.team.findFirst({
          where: { 
            name: selection.team.name,
            league: selection.team.league 
          }
        })
        
        if (postgresTeam) {
          try {
            await postgresClient.selection.create({
              data: {
                participantId: existingParticipant.id,
                teamId: postgresTeam.id,
                selectionType: selection.selectionType,
                pickNumber: selection.pickNumber
              }
            })
            totalSelections++
            console.log(`    ✅ Migrated: ${selection.team.name}`)
          } catch (error) {
            console.log(`    ❌ Failed to migrate ${selection.team.name}:`, error)
          }
        } else {
          console.log(`    ⚠️  Team not found in PostgreSQL: ${selection.team.name}`)
        }
      }
    }
    
    console.log(`\n✅ Migration complete! Migrated ${totalSelections} selections`)
    
    // Verify the migration
    const postgresParticipants = await postgresClient.participant.findMany({
      include: {
        selections: {
          include: {
            team: true
          }
        }
      }
    })
    
    console.log('\n📊 Verification:')
    for (const participant of postgresParticipants) {
      console.log(`  ${participant.name}: ${participant.selections.length} selections`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await sqliteClient.$disconnect()
    await postgresClient.$disconnect()
  }
}

if (require.main === module) {
  migrateSelections()
}

export default migrateSelections