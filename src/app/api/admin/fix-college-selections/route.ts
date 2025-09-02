import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🎓 Fixing college team selections with better name mapping...')
    
    // Enhanced name mapping based on the migration results
    const collegeSelections = [
      // Al's college picks
      { participant: 'Al', oldName: 'BYU Cougars', newName: 'BYU Cougars', pickNumber: 3 },
      { participant: 'Al', oldName: 'Kansas State Wildcats', newName: 'Kansas State Wildcats', pickNumber: 4 },
      { participant: 'Al', oldName: 'Maryland Terrapins', newName: 'Maryland Terrapins', pickNumber: 5 },
      { participant: 'Al', oldName: 'Wake Forest Demon Deacons', newName: 'Wake Forest Demon Deacons', pickNumber: 6 },
      { participant: 'Al', oldName: 'Marshall Thundering Herd', newName: 'Marshall Thundering Herd', pickNumber: 7 },
      { participant: 'Al', oldName: 'Illinois Fighting Illini', newName: 'Illinois Fighting Illini', pickNumber: 8 },
      { participant: 'Al', oldName: 'Western Michigan Broncos', newName: 'Western Michigan Broncos', pickNumber: 9 },
      { participant: 'Al', oldName: 'Middle Tennessee Blue Raiders', newName: 'Middle Tennessee Blue Raiders', pickNumber: 10 },
      
      // Bocklet's college picks
      { participant: 'Bocklet', oldName: 'James Madison Dukes', newName: 'James Madison Dukes', pickNumber: 2 },
      { participant: 'Bocklet', oldName: 'Miami (OH) RedHawks', newName: 'Miami RedHawks', pickNumber: 3 },
      { participant: 'Bocklet', oldName: 'Liberty Flames', newName: 'Liberty Flames', pickNumber: 4 },
      { participant: 'Bocklet', oldName: 'UNLV Rebels', newName: 'UNLV Rebels', pickNumber: 5 },
      { participant: 'Bocklet', oldName: 'Miami Hurricanes', newName: 'Miami Hurricanes', pickNumber: 6 },
      { participant: 'Bocklet', oldName: 'Pittsburgh Panthers', newName: 'Pittsburgh Panthers', pickNumber: 8 },
      { participant: 'Bocklet', oldName: 'Southern Miss Golden Eagles', newName: 'Southern Miss Golden Eagles', pickNumber: 9 },
      { participant: 'Bocklet', oldName: 'Missouri State Bears', newName: 'Missouri State Bears', pickNumber: 10 },
      
      // Brian's college picks
      { participant: 'Brian', oldName: 'Alabama Crimson Tide', newName: 'Alabama Crimson Tide', pickNumber: 1 },
      { participant: 'Brian', oldName: 'Oklahoma Sooners', newName: 'Oklahoma Sooners', pickNumber: 2 },
      { participant: 'Brian', oldName: 'Ole Miss Rebels', newName: 'Mississippi Rebels', pickNumber: 5 },
      { participant: 'Brian', oldName: 'Oklahoma State Cowboys', newName: 'Oklahoma State Cowboys', pickNumber: 6 },
      { participant: 'Brian', oldName: 'Michigan State Spartans', newName: 'Michigan State Spartans', pickNumber: 7 },
      { participant: 'Brian', oldName: 'Appalachian State Mountaineers', newName: 'Appalachian State Mountaineers', pickNumber: 8 },
      { participant: 'Brian', oldName: 'Ball State Cardinals', newName: 'Ball State Cardinals', pickNumber: 9 },
      { participant: 'Brian', oldName: 'Northwestern Wildcats', newName: 'Northwestern Wildcats', pickNumber: 10 },
      
      // Steve's college picks  
      { participant: 'Steve', oldName: 'Penn State Nittany Lions', newName: 'Penn State Nittany Lions', pickNumber: 2 },
      { participant: 'Steve', oldName: 'Ohio Bobcats', newName: 'Ohio Bobcats', pickNumber: 4 },
      { participant: 'Steve', oldName: 'North Carolina Tar Heels', newName: 'North Carolina Tar Heels', pickNumber: 5 },
      { participant: 'Steve', oldName: 'Texas State Bobcats', newName: 'Texas State Bobcats', pickNumber: 6 },
      { participant: 'Steve', oldName: 'NC State Wolfpack', newName: 'NC State Wolfpack', pickNumber: 7 },
      { participant: 'Steve', oldName: 'Hawaii Rainbow Warriors', newName: 'Hawaii Rainbow Warriors', pickNumber: 8 },
      { participant: 'Steve', oldName: 'Arizona Wildcats', newName: 'Arizona Wildcats', pickNumber: 9 },
      { participant: 'Steve', oldName: 'Louisiana Monroe Warhawks', newName: 'Louisiana Monroe Warhawks', pickNumber: 10 },
      
      // Add more participants...
      { participant: 'Kenny', oldName: 'Texas Longhorns', newName: 'Texas Longhorns', pickNumber: 2 },
      { participant: 'Kenny', oldName: 'Boise State Broncos', newName: 'Boise State Broncos', pickNumber: 4 },
      { participant: 'Kenny', oldName: 'Texas A&M Aggies', newName: 'Texas A&M Aggies', pickNumber: 5 },
      { participant: 'Kenny', oldName: 'Nebraska Cornhuskers', newName: 'Nebraska Cornhuskers', pickNumber: 6 },
      { participant: 'Kenny', oldName: 'UTEP Miners', newName: 'UTEP Miners', pickNumber: 7 },
      { participant: 'Kenny', oldName: 'California Golden Bears', newName: 'California Golden Bears', pickNumber: 8 },
      { participant: 'Kenny', oldName: 'Cincinnati Bearcats', newName: 'Cincinnati Bearcats', pickNumber: 9 },
      { participant: 'Kenny', oldName: 'Georgia Southern Eagles', newName: 'Georgia Southern Eagles', pickNumber: 10 },
    ]
    
    let migratedCount = 0
    
    for (const selection of collegeSelections) {
      // Find participant
      const participant = await prisma.participant.findFirst({
        where: { name: selection.participant }
      })
      
      if (!participant) {
        console.log(`Participant not found: ${selection.participant}`)
        continue
      }
      
      // Try multiple name variations for the team
      const nameVariations = [
        selection.newName,
        selection.oldName,
        selection.newName.replace(' Rebels', ' Rebels'),
        selection.newName.replace(' RedHawks', ' Red Hawks'),
        selection.newName.replace('Miami RedHawks', 'Miami (OH) RedHawks')
      ]
      
      let team = null
      for (const variation of nameVariations) {
        team = await prisma.team.findFirst({
          where: { 
            name: {
              contains: variation.split(' ')[0], // Try matching first word
              mode: 'insensitive'
            },
            league: 'COLLEGE' 
          }
        })
        if (team && team.name.toLowerCase().includes(variation.toLowerCase().split(' ')[0])) {
          break
        }
        team = null
      }
      
      if (team) {
        try {
          // Check if selection already exists
          const existingSelection = await prisma.selection.findFirst({
            where: {
              participantId: participant.id,
              pickNumber: selection.pickNumber
            }
          })
          
          if (!existingSelection) {
            await prisma.selection.create({
              data: {
                participantId: participant.id,
                teamId: team.id,
                selectionType: 'COLLEGE',
                pickNumber: selection.pickNumber
              }
            })
            migratedCount++
            console.log(`✅ Migrated: ${selection.participant} -> ${team.name}`)
          }
        } catch (error) {
          console.log(`❌ Failed: ${selection.participant} -> ${selection.newName}`, error)
        }
      } else {
        console.log(`❌ Team not found: ${selection.newName} for ${selection.participant}`)
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${migratedCount} college selections`,
      migrated: migratedCount,
      total: collegeSelections.length
    })
    
  } catch (error) {
    console.error('College migration failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return POST()
}