const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function finalFix() {
  console.log('🚀 Adding final missing teams...');
  
  // Add the missing teams from the error log
  const finalMissingTeams = [
    { name: 'Houston Cougars', abbreviation: 'UH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/248.png', espnId: 248 },
    { name: 'Arkansas Razorbacks', abbreviation: 'ARK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png', espnId: 8 },
    { name: 'Kansas Jayhawks', abbreviation: 'KU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png', espnId: 2305 }
  ];
  
  let added = 0;
  for (const team of finalMissingTeams) {
    try {
      await prisma.team.create({
        data: {
          name: team.name,
          abbreviation: team.abbreviation,
          league: team.league,
          conference: team.conference,
          logoUrl: team.logoUrl,
          espnId: team.espnId,
          wins: 0,
          losses: 0,
          ties: 0
        }
      });
      console.log(`✅ Added: ${team.name}`);
      added++;
    } catch (error) {
      console.log(`❌ Failed: ${team.name} - ${error.message}`);
    }
  }
  
  console.log(`✅ Added ${added} final teams`);
  
  // Now restore the few remaining selections
  const finalSelections = [
    { participant: 'Daryl', team: 'Houston Cougars', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Daryl', team: 'Arkansas Razorbacks', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'KOB', team: 'Kansas Jayhawks', league: 'COLLEGE', pickNumber: 4 }
  ];
  
  let restored = 0;
  for (const selection of finalSelections) {
    try {
      const participant = await prisma.participant.findFirst({
        where: { name: selection.participant }
      });
      
      const team = await prisma.team.findFirst({
        where: { 
          name: selection.team,
          league: selection.league 
        }
      });
      
      if (participant && team) {
        const existing = await prisma.selection.findFirst({
          where: {
            participantId: participant.id,
            pickNumber: selection.pickNumber
          }
        });
        
        if (!existing) {
          await prisma.selection.create({
            data: {
              participantId: participant.id,
              teamId: team.id,
              selectionType: selection.league,
              pickNumber: selection.pickNumber
            }
          });
          console.log(`✅ Restored: ${selection.participant} -> ${selection.team}`);
          restored++;
        }
      }
    } catch (error) {
      console.log(`❌ Failed: ${selection.participant} -> ${selection.team}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 FINAL FIX COMPLETE!`);
  console.log(`✅ Teams added: ${added}`);
  console.log(`✅ Selections restored: ${restored}`);
  
  await prisma.$disconnect();
}

finalFix().catch(console.error);