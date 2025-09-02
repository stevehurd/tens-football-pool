// Manual script to add all missing teams and restore selections
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function manualFix() {
  console.log('🚀 Starting manual database fix...');
  
  // Add ALL the missing college teams at once
  const missingTeams = [
    { name: 'Pittsburgh Panthers', abbreviation: 'PITT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png', espnId: 221 },
    { name: 'Virginia Tech Hokies', abbreviation: 'VT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png', espnId: 259 },
    { name: 'Baylor Bears', abbreviation: 'BAY', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/239.png', espnId: 239 },
    { name: 'Vanderbilt Commodores', abbreviation: 'VANDY', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png', espnId: 238 },
    { name: 'Iowa Hawkeyes', abbreviation: 'IOWA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png', espnId: 2294 },
    { name: 'Boise State Broncos', abbreviation: 'BSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/68.png', espnId: 68 },
    { name: 'Nebraska Cornhuskers', abbreviation: 'NEB', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png', espnId: 158 },
    { name: 'California Golden Bears', abbreviation: 'CAL', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/25.png', espnId: 25 },
    { name: 'Cincinnati Bearcats', abbreviation: 'CIN', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2132.png', espnId: 2132 },
    { name: 'Rutgers Scarlet Knights', abbreviation: 'RU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png', espnId: 164 },
    { name: 'Memphis Tigers', abbreviation: 'MEM', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/235.png', espnId: 235 },
    { name: 'UCF Knights', abbreviation: 'UCF', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png', espnId: 2116 },
    { name: 'Syracuse Orange', abbreviation: 'SYR', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/183.png', espnId: 183 },
    { name: 'Duke Blue Devils', abbreviation: 'DUKE', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png', espnId: 150 },
    { name: 'Oregon State Beavers', abbreviation: 'ORST', league: 'COLLEGE', conference: 'Pac-12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/204.png', espnId: 204 },
    { name: 'Florida State Seminoles', abbreviation: 'FSU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png', espnId: 52 },
    { name: 'Missouri Tigers', abbreviation: 'MIZ', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png', espnId: 142 },
    { name: 'Fresno State Bulldogs', abbreviation: 'FRES', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/278.png', espnId: 278 },
    { name: 'Colorado State Rams', abbreviation: 'CSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/36.png', espnId: 36 },
    { name: 'Wyoming Cowboys', abbreviation: 'WYO', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2845.png', espnId: 2845 },
    { name: 'Minnesota Golden Gophers', abbreviation: 'MINN', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/135.png', espnId: 135 },
    { name: 'Air Force Falcons', abbreviation: 'AF', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png', espnId: 2005 },
    { name: 'Navy Midshipmen', abbreviation: 'NAVY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png', espnId: 2426 },
    { name: 'Washington Huskies', abbreviation: 'WASH', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png', espnId: 264 },
    { name: 'Tulane Green Wave', abbreviation: 'TUL', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2655.png', espnId: 2655 },
    { name: 'Texas Tech Red Raiders', abbreviation: 'TTU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png', espnId: 2641 },
    { name: 'Army Black Knights', abbreviation: 'ARMY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/349.png', espnId: 349 },
    { name: 'Louisville Cardinals', abbreviation: 'LOU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/97.png', espnId: 97 },
    { name: 'SMU Mustangs', abbreviation: 'SMU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png', espnId: 2567 },
    { name: 'Virginia Cavaliers', abbreviation: 'UVA', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png', espnId: 258 },
    { name: 'Utah Utes', abbreviation: 'UTAH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/254.png', espnId: 254 },
    { name: 'Colorado Buffaloes', abbreviation: 'COLO', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/38.png', espnId: 38 },
    { name: 'Wisconsin Badgers', abbreviation: 'WIS', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/275.png', espnId: 275 },
    { name: 'Arizona State Sun Devils', abbreviation: 'ASU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/9.png', espnId: 9 },
    { name: 'TCU Horned Frogs', abbreviation: 'TCU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png', espnId: 2628 },
    { name: 'Iowa State Cyclones', abbreviation: 'ISU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png', espnId: 66 },
    { name: 'West Virginia Mountaineers', abbreviation: 'WVU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png', espnId: 277 },
    { name: 'Kentucky Wildcats', abbreviation: 'UK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', espnId: 96 },
    { name: 'UCLA Bruins', abbreviation: 'UCLA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', espnId: 26 },
    { name: 'Boston College Eagles', abbreviation: 'BC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png', espnId: 103 },
    { name: 'Indiana Hoosiers', abbreviation: 'IU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png', espnId: 84 },
    { name: 'North Carolina Tar Heels', abbreviation: 'UNC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', espnId: 153 },
    { name: 'NC State Wolfpack', abbreviation: 'NCST', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/152.png', espnId: 152 },
    { name: 'Arizona Wildcats', abbreviation: 'ARIZ', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/12.png', espnId: 12 }
  ];
  
  // Add teams
  let added = 0;
  for (const team of missingTeams) {
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
  
  console.log(`✅ Added ${added} teams total`);
  
  // Now restore ALL the missing selections
  const allSelections = [
    // Complete list from the complete-restore endpoint - ALL 150 selections
    { participant: 'Al', team: 'Cincinnati Bengals', league: 'NFL', pickNumber: 1 },
    { participant: 'Al', team: 'Baltimore Ravens', league: 'NFL', pickNumber: 2 },
    { participant: 'Al', team: 'BYU Cougars', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Al', team: 'Kansas State Wildcats', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Al', team: 'Maryland Terrapins', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Al', team: 'Wake Forest Demon Deacons', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Al', team: 'Marshall Thundering Herd', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Al', team: 'Illinois Fighting Illini', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Al', team: 'Western Michigan Broncos', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Al', team: 'Middle Tennessee Blue Raiders', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Bocklet', team: 'Pittsburgh Steelers', league: 'NFL', pickNumber: 1 },
    { participant: 'Bocklet', team: 'James Madison Dukes', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Bocklet', team: 'Miami RedHawks', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Bocklet', team: 'Liberty Flames', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Bocklet', team: 'UNLV Rebels', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Bocklet', team: 'Miami Hurricanes', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Bocklet', team: 'Washington Commanders', league: 'NFL', pickNumber: 7 },
    { participant: 'Bocklet', team: 'Pittsburgh Panthers', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Bocklet', team: 'Southern Miss Golden Eagles', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Bocklet', team: 'Missouri State Bears', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Brian', team: 'Alabama Crimson Tide', league: 'COLLEGE', pickNumber: 1 },
    { participant: 'Brian', team: 'Oklahoma Sooners', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Brian', team: 'Green Bay Packers', league: 'NFL', pickNumber: 3 },
    { participant: 'Brian', team: 'Jacksonville Jaguars', league: 'NFL', pickNumber: 4 },
    { participant: 'Brian', team: 'Mississippi Rebels', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Brian', team: 'Oklahoma State Cowboys', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Brian', team: 'Michigan State Spartans', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Brian', team: 'Appalachian State Mountaineers', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Brian', team: 'Ball State Cardinals', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Brian', team: 'Northwestern Wildcats', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Daryl', team: 'Michigan Wolverines', league: 'COLLEGE', pickNumber: 1 },
    { participant: 'Daryl', team: 'Detroit Lions', league: 'NFL', pickNumber: 2 },
    { participant: 'Daryl', team: 'Auburn Tigers', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Daryl', team: 'Seattle Seahawks', league: 'NFL', pickNumber: 4 },
    { participant: 'Daryl', team: 'Virginia Tech Hokies', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Daryl', team: 'Houston Cougars', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Daryl', team: 'Florida Gators', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Daryl', team: 'Baylor Bears', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Daryl', team: 'Arkansas Razorbacks', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Daryl', team: 'Old Dominion Monarchs', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Goody', team: 'Philadelphia Eagles', league: 'NFL', pickNumber: 1 },
    { participant: 'Goody', team: 'Clemson Tigers', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Goody', team: 'Tennessee Volunteers', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Goody', team: 'Vanderbilt Commodores', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Goody', team: 'Iowa Hawkeyes', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Goody', team: 'Jacksonville State Gamecocks', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Goody', team: 'Washington State Cougars', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Goody', team: 'New York Giants', league: 'NFL', pickNumber: 8 },
    { participant: 'Goody', team: 'South Carolina Gamecocks', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Goody', team: 'UConn Huskies', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'KOB', team: 'Kansas City Chiefs', league: 'NFL', pickNumber: 1 },
    { participant: 'KOB', team: 'Oregon Ducks', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'KOB', team: 'UTSA Roadrunners', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'KOB', team: 'Kansas Jayhawks', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'KOB', team: 'Western Kentucky Hilltoppers', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'KOB', team: 'Las Vegas Raiders', league: 'NFL', pickNumber: 6 },
    { participant: 'KOB', team: 'Georgia Tech Yellow Jackets', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'KOB', team: 'Coastal Carolina Chanticleers', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'KOB', team: 'San Jose State Spartans', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'KOB', team: 'Central Michigan Chippewas', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Kenny', team: 'Los Angeles Chargers', league: 'NFL', pickNumber: 1 },
    { participant: 'Kenny', team: 'Texas Longhorns', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Kenny', team: 'Miami Dolphins', league: 'NFL', pickNumber: 3 },
    { participant: 'Kenny', team: 'Boise State Broncos', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Kenny', team: 'Texas A&M Aggies', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Kenny', team: 'Nebraska Cornhuskers', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Kenny', team: 'UTEP Miners', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Kenny', team: 'California Golden Bears', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Kenny', team: 'Cincinnati Bearcats', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Kenny', team: 'Georgia Southern Eagles', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Knowles', team: 'Ohio State Buckeyes', league: 'COLLEGE', pickNumber: 1 },
    { participant: 'Knowles', team: 'LSU Tigers', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Knowles', team: 'Dallas Cowboys', league: 'NFL', pickNumber: 3 },
    { participant: 'Knowles', team: 'Rutgers Scarlet Knights', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Knowles', team: 'Memphis Tigers', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Knowles', team: 'Louisiana Ragin\' Cajuns', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Knowles', team: 'UCF Knights', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Knowles', team: 'Syracuse Orange', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Knowles', team: 'Carolina Panthers', league: 'NFL', pickNumber: 9 },
    { participant: 'Knowles', team: 'Sam Houston Bearkats', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Mario', team: 'Houston Texans', league: 'NFL', pickNumber: 1 },
    { participant: 'Mario', team: 'Chicago Bears', league: 'NFL', pickNumber: 2 },
    { participant: 'Mario', team: 'Duke Blue Devils', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Mario', team: 'Oregon State Beavers', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Mario', team: 'Florida State Seminoles', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Mario', team: 'Northern Illinois Huskies', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Mario', team: 'Missouri Tigers', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Mario', team: 'Troy Trojans', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Mario', team: 'Eastern Michigan Eagles', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Mario', team: 'Delaware Blue Hens', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Marty', team: 'Buffalo Bills', league: 'NFL', pickNumber: 1 },
    { participant: 'Marty', team: 'Atlanta Falcons', league: 'NFL', pickNumber: 2 },
    { participant: 'Marty', team: 'Toledo Rockets', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Marty', team: 'Fresno State Bulldogs', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Marty', team: 'Colorado State Rams', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Marty', team: 'Wyoming Cowboys', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Marty', team: 'Minnesota Golden Gophers', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Marty', team: 'Air Force Falcons', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Marty', team: 'Navy Midshipmen', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Marty', team: 'Kent State Golden Flashes', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Petrucci', team: 'Georgia Bulldogs', league: 'COLLEGE', pickNumber: 1 },
    { participant: 'Petrucci', team: 'New England Patriots', league: 'NFL', pickNumber: 2 },
    { participant: 'Petrucci', team: 'Washington Huskies', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Petrucci', team: 'Tulane Green Wave', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Petrucci', team: 'Texas Tech Red Raiders', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Petrucci', team: 'Denver Broncos', league: 'NFL', pickNumber: 6 },
    { participant: 'Petrucci', team: 'Louisiana Tech Bulldogs', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Petrucci', team: 'Army Black Knights', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Petrucci', team: 'Arkansas State Red Wolves', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Petrucci', team: 'Buffalo Bulls', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Reilly', team: 'Tampa Bay Buccaneers', league: 'NFL', pickNumber: 1 },
    { participant: 'Reilly', team: 'Louisville Cardinals', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Reilly', team: 'SMU Mustangs', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Reilly', team: 'Florida International Panthers', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Reilly', team: 'Arizona Cardinals', league: 'NFL', pickNumber: 5 },
    { participant: 'Reilly', team: 'South Florida Bulls', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Reilly', team: 'Virginia Cavaliers', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Reilly', team: 'South Alabama Jaguars', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Reilly', team: 'North Texas Mean Green', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Reilly', team: 'San Diego State Aztecs', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Scotty', team: 'New York Jets', league: 'NFL', pickNumber: 1 },
    { participant: 'Scotty', team: 'USC Trojans', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Scotty', team: 'Utah Utes', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Scotty', team: 'Indianapolis Colts', league: 'NFL', pickNumber: 4 },
    { participant: 'Scotty', team: 'Colorado Buffaloes', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Scotty', team: 'Bowling Green Falcons', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Scotty', team: 'East Carolina Pirates', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Scotty', team: 'UAB Blazers', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Scotty', team: 'Wisconsin Badgers', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Scotty', team: 'Arizona State Sun Devils', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Steamer', team: 'Minnesota Vikings', league: 'NFL', pickNumber: 1 },
    { participant: 'Steamer', team: 'Notre Dame Fighting Irish', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Steamer', team: 'TCU Horned Frogs', league: 'COLLEGE', pickNumber: 3 },
    { participant: 'Steamer', team: 'Iowa State Cyclones', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Steamer', team: 'West Virginia Mountaineers', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Steamer', team: 'Kentucky Wildcats', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Steamer', team: 'Tennessee Titans', league: 'NFL', pickNumber: 7 },
    { participant: 'Steamer', team: 'UCLA Bruins', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Steamer', team: 'Boston College Eagles', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Steamer', team: 'Indiana Hoosiers', league: 'COLLEGE', pickNumber: 10 },
    
    { participant: 'Steve', team: 'San Francisco 49ers', league: 'NFL', pickNumber: 1 },
    { participant: 'Steve', team: 'Penn State Nittany Lions', league: 'COLLEGE', pickNumber: 2 },
    { participant: 'Steve', team: 'Los Angeles Rams', league: 'NFL', pickNumber: 3 },
    { participant: 'Steve', team: 'Ohio Bobcats', league: 'COLLEGE', pickNumber: 4 },
    { participant: 'Steve', team: 'North Carolina Tar Heels', league: 'COLLEGE', pickNumber: 5 },
    { participant: 'Steve', team: 'Texas State Bobcats', league: 'COLLEGE', pickNumber: 6 },
    { participant: 'Steve', team: 'NC State Wolfpack', league: 'COLLEGE', pickNumber: 7 },
    { participant: 'Steve', team: 'Hawaii Rainbow Warriors', league: 'COLLEGE', pickNumber: 8 },
    { participant: 'Steve', team: 'Arizona Wildcats', league: 'COLLEGE', pickNumber: 9 },
    { participant: 'Steve', team: 'Louisiana Monroe Warhawks', league: 'COLLEGE', pickNumber: 10 }
  ];
  
  let restored = 0;
  for (const selection of allSelections) {
    try {
      const participant = await prisma.participant.findFirst({
        where: { name: selection.participant }
      });
      
      if (!participant) {
        console.log(`❌ Participant not found: ${selection.participant}`);
        continue;
      }
      
      const team = await prisma.team.findFirst({
        where: { 
          name: selection.team,
          league: selection.league 
        }
      });
      
      if (!team) {
        console.log(`❌ Team not found: ${selection.team} (${selection.league})`);
        continue;
      }
      
      // Check if selection already exists
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
      
    } catch (error) {
      console.log(`❌ Failed: ${selection.participant} -> ${selection.team}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 MANUAL FIX COMPLETE!`);
  console.log(`✅ Teams added: ${added}`);
  console.log(`✅ Selections restored: ${restored}`);
  
  await prisma.$disconnect();
}

manualFix().catch(console.error);