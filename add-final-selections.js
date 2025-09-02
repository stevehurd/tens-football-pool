const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addFinalSelections() {
  console.log('🚀 Adding final 3 missing selections...');
  
  const finalSelections = [
    { participant: 'Daryl', team: 'Houston Cougars', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Daryl', team: 'Arkansas Razorbacks', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'KOB', team: 'Kansas Jayhawks', league: 'COLLEGE', pickNumber: 4 }
  ];
  
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
        await prisma.selection.create({
          data: {
            participantId: participant.id,
            teamId: team.id,
            selectionType: selection.league,
            pickNumber: selection.pickNumber
          }
        });
        console.log(`✅ Added: ${selection.participant} pick ${selection.pickNumber} -> ${selection.team}`);
      } else {
        console.log(`❌ Missing participant or team for ${selection.participant} -> ${selection.team}`);
      }
    } catch (error) {
      console.log(`❌ Failed: ${selection.participant} -> ${selection.team}: ${error.message}`);
    }
  }
  
  await prisma.$disconnect();
  console.log(`🎉 All final selections added!`);
}

addFinalSelections().catch(console.error);