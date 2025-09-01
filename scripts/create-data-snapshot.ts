import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const prisma = new PrismaClient()

async function createDataSnapshot() {
  console.log('📸 Creating comprehensive data snapshot...')
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const snapshotDir = `snapshots/snapshot-${timestamp}`
  
  try {
    // Create snapshot directory
    const { mkdirSync } = await import('fs')
    mkdirSync(`snapshots`, { recursive: true })
    mkdirSync(snapshotDir, { recursive: true })
    
    console.log(`📁 Created snapshot directory: ${snapshotDir}`)
    
    // 1. Export all teams
    console.log('\n📊 Exporting teams...')
    const teams = await prisma.team.findMany({
      orderBy: [
        { league: 'asc' },
        { conference: 'asc' },
        { name: 'asc' }
      ]
    })
    
    writeFileSync(`${snapshotDir}/teams.json`, JSON.stringify(teams, null, 2))
    console.log(`✅ Exported ${teams.length} teams`)
    
    // 2. Export all participants
    console.log('\n👥 Exporting participants...')
    const participants = await prisma.participant.findMany({
      orderBy: { name: 'asc' }
    })
    
    writeFileSync(`${snapshotDir}/participants.json`, JSON.stringify(participants, null, 2))
    console.log(`✅ Exported ${participants.length} participants`)
    
    // 3. Export all selections with relationships
    console.log('\n🎯 Exporting selections...')
    const selections = await prisma.selection.findMany({
      include: {
        participant: {
          select: { name: true }
        },
        team: {
          select: { name: true, league: true, conference: true }
        }
      },
      orderBy: [
        { participant: { name: 'asc' } },
        { pickNumber: 'asc' }
      ]
    })
    
    writeFileSync(`${snapshotDir}/selections.json`, JSON.stringify(selections, null, 2))
    console.log(`✅ Exported ${selections.length} selections`)
    
    // 4. Create summary statistics
    console.log('\n📈 Creating summary statistics...')
    
    const summary = {
      timestamp: new Date().toISOString(),
      counts: {
        totalTeams: teams.length,
        nflTeams: teams.filter(t => t.league === 'NFL').length,
        collegeTeams: teams.filter(t => t.league === 'COLLEGE').length,
        participants: participants.length,
        totalSelections: selections.length
      },
      conferences: {} as { [key: string]: number },
      participantProgress: {} as { [key: string]: { total: number, nfl: number, college: number } }
    }
    
    // Conference breakdown
    teams.forEach(team => {
      if (team.league === 'COLLEGE') {
        const conf = team.conference || 'No Conference'
        summary.conferences[conf] = (summary.conferences[conf] || 0) + 1
      }
    })
    
    // Participant progress
    selections.forEach(selection => {
      const participantName = selection.participant.name
      if (!summary.participantProgress[participantName]) {
        summary.participantProgress[participantName] = { total: 0, nfl: 0, college: 0 }
      }
      
      summary.participantProgress[participantName].total++
      if (selection.selectionType === 'NFL') {
        summary.participantProgress[participantName].nfl++
      } else {
        summary.participantProgress[participantName].college++
      }
    })
    
    writeFileSync(`${snapshotDir}/summary.json`, JSON.stringify(summary, null, 2))
    console.log(`✅ Created summary statistics`)
    
    // 5. Create human-readable reports
    console.log('\n📋 Creating human-readable reports...')
    
    // Teams by conference report
    let teamsReport = `# Teams Report - ${new Date().toLocaleString()}\n\n`
    teamsReport += `## Summary\n`
    teamsReport += `- Total Teams: ${teams.length}\n`
    teamsReport += `- NFL Teams: ${summary.counts.nflTeams}\n`
    teamsReport += `- College Teams: ${summary.counts.collegeTeams}\n\n`
    
    teamsReport += `## College Teams by Conference\n`
    Object.entries(summary.conferences)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([conference, count]) => {
        teamsReport += `\n### ${conference} (${count} teams)\n`
        
        const conferenceTeams = teams.filter(t => 
          t.league === 'COLLEGE' && (t.conference || 'No Conference') === conference
        )
        
        conferenceTeams.forEach(team => {
          teamsReport += `- ${team.name} (ESPN ID: ${team.espnId || 'None'})\n`
        })
      })
    
    teamsReport += `\n## NFL Teams\n`
    const nflTeams = teams.filter(t => t.league === 'NFL')
    nflTeams.forEach(team => {
      teamsReport += `- ${team.name} - ${team.division} (ESPN ID: ${team.espnId || 'None'})\n`
    })
    
    writeFileSync(`${snapshotDir}/teams-report.md`, teamsReport)
    
    // Participants report
    let participantsReport = `# Participants Report - ${new Date().toLocaleString()}\n\n`
    participantsReport += `## Summary\n`
    participantsReport += `- Total Participants: ${participants.length}\n`
    participantsReport += `- Total Selections Made: ${selections.length}\n\n`
    
    participantsReport += `## Participant Progress\n`
    Object.entries(summary.participantProgress)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([name, progress]) => {
        participantsReport += `\n### ${name}\n`
        participantsReport += `- Total Picks: ${progress.total}/10\n`
        participantsReport += `- NFL Picks: ${progress.nfl}/2\n`
        participantsReport += `- College Picks: ${progress.college}/8\n`
        
        // Show actual picks
        const participantSelections = selections.filter(s => s.participant.name === name)
        if (participantSelections.length > 0) {
          participantsReport += `- Picks:\n`
          participantSelections
            .sort((a, b) => a.pickNumber - b.pickNumber)
            .forEach(selection => {
              participantsReport += `  ${selection.pickNumber}. ${selection.team.name} (${selection.selectionType})\n`
            })
        }
      })
    
    writeFileSync(`${snapshotDir}/participants-report.md`, participantsReport)
    
    console.log(`✅ Created human-readable reports`)
    
    // 6. Create README for the snapshot
    const readmeContent = `# Data Snapshot - ${new Date().toLocaleString()}

This snapshot contains a complete backup of the football pool data.

## Files:

- **teams.json** - Complete team data (${teams.length} teams)
- **participants.json** - Participant data (${participants.length} participants)
- **selections.json** - All draft selections with relationships (${selections.length} selections)
- **summary.json** - Summary statistics and counts
- **teams-report.md** - Human-readable teams report by conference
- **participants-report.md** - Human-readable participants and draft progress report

## Key Statistics:

- NFL Teams: ${summary.counts.nflTeams}
- College Teams: ${summary.counts.collegeTeams} (FBS)
- Total Participants: ${summary.counts.participants}
- Total Selections Made: ${summary.counts.totalSelections}

## Conference Breakdown:

${Object.entries(summary.conferences)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([conf, count]) => `- ${conf}: ${count} teams`)
  .join('\n')}

## Recently Added Teams:

- Delaware Blue Hens (Conference USA) - ESPN ID: 48
- Missouri State Bears (Conference USA) - ESPN ID: 2623

This snapshot can be used to restore data or reference the exact state of the database at this point in time.
`
    
    writeFileSync(`${snapshotDir}/README.md`, readmeContent)
    
    console.log('\n🎉 Snapshot created successfully!')
    console.log(`📁 Location: ${snapshotDir}/`)
    console.log('\n📋 Files created:')
    console.log('  - teams.json')
    console.log('  - participants.json')
    console.log('  - selections.json')
    console.log('  - summary.json')
    console.log('  - teams-report.md')
    console.log('  - participants-report.md')
    console.log('  - README.md')
    
    console.log('\n📊 Summary:')
    console.log(`  - ${summary.counts.totalTeams} teams (${summary.counts.nflTeams} NFL, ${summary.counts.collegeTeams} college)`)
    console.log(`  - ${summary.counts.participants} participants`)
    console.log(`  - ${summary.counts.totalSelections} selections made`)
    
    console.log('\n✅ Data snapshot complete! You can reference this backup anytime.')
    
  } catch (error) {
    console.error('❌ Error creating snapshot:', error)
  }
}

createDataSnapshot()
  .catch(console.error)
  .finally(() => prisma.$disconnect())