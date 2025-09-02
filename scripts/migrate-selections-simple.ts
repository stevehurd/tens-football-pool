import { PrismaClient } from '@prisma/client'
import Database from 'better-sqlite3'

// PostgreSQL client (current setup)
const postgresClient = new PrismaClient()

async function migrateSelections() {
  console.log('🔄 Migrating selections from SQLite to PostgreSQL...')
  
  try {
    // Open SQLite database directly
    const sqlite = new Database('./prisma/dev.db', { readonly: true })
    
    // Get all participants with their selections
    const participants = sqlite.prepare(`
      SELECT 
        p.id as participant_id,
        p.name as participant_name,
        s.id as selection_id,
        s.selectionType,
        s.pickNumber,
        t.name as team_name,
        t.league as team_league
      FROM Participant p
      LEFT JOIN Selection s ON p.id = s.participantId  
      LEFT JOIN Team t ON s.teamId = t.id
      ORDER BY p.name, s.pickNumber
    `).all()
    
    console.log(`Found ${participants.length} participant-selection records`)
    
    // Group by participant
    const participantMap = new Map()
    
    for (const row of participants) {
      if (!participantMap.has(row.participant_name)) {
        participantMap.set(row.participant_name, [])
      }
      
      if (row.selection_id) { // Only add if there's actually a selection
        participantMap.get(row.participant_name).push({
          selectionType: row.selectionType,
          pickNumber: row.pickNumber,
          teamName: row.team_name,
          teamLeague: row.team_league
        })
      }
    }
    
    console.log(`Processing ${participantMap.size} participants`)
    
    let totalSelections = 0
    
    // Migrate each participant
    for (const [participantName, selections] of participantMap) {
      console.log(`\n👤 Processing ${participantName} (${selections.length} selections)`)
      
      // Ensure participant exists in PostgreSQL
      const participant = await postgresClient.participant.upsert({
        where: { name: participantName },
        create: { name: participantName },
        update: {}
      })
      
      // Migrate selections
      for (const selection of selections) {
        console.log(`  📝 Migrating: ${selection.teamName}`)
        
        // Find team in PostgreSQL
        const team = await postgresClient.team.findFirst({
          where: {
            name: selection.teamName,
            league: selection.teamLeague
          }
        })
        
        if (team) {
          try {
            await postgresClient.selection.create({
              data: {
                participantId: participant.id,
                teamId: team.id,
                selectionType: selection.selectionType,
                pickNumber: selection.pickNumber
              }
            })
            totalSelections++
            console.log(`    ✅ Migrated: ${selection.teamName}`)
          } catch (error) {
            console.log(`    ❌ Failed: ${error.message}`)
          }
        } else {
          console.log(`    ⚠️  Team not found: ${selection.teamName}`)
        }
      }
    }
    
    sqlite.close()
    
    console.log(`\n🎉 Migration complete! Migrated ${totalSelections} selections`)
    
    // Verify
    const result = await postgresClient.participant.findMany({
      include: { selections: true }
    })
    
    console.log('\n📊 Verification:')
    for (const p of result) {
      console.log(`  ${p.name}: ${p.selections.length} selections`)
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await postgresClient.$disconnect()
  }
}

if (require.main === module) {
  migrateSelections()
}

export default migrateSelections