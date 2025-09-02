import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    console.log('🔥 NUCLEAR OPTION: Complete database rebuild...')
    
    // Step 1: Clear everything
    await prisma.selection.deleteMany({})
    await prisma.team.deleteMany({})
    console.log('Cleared all selections and teams')
    
    // Step 2: Rebuild teams from seed (this has ESPN IDs)
    const teams = [
      // NFL Teams with ESPN IDs (from your working seed)
      { name: 'Arizona Cardinals', abbreviation: 'ARI', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ari.png', espnId: 22 },
      { name: 'Atlanta Falcons', abbreviation: 'ATL', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/atl.png', espnId: 1 },
      { name: 'Baltimore Ravens', abbreviation: 'BAL', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/bal.png', espnId: 33 },
      { name: 'Buffalo Bills', abbreviation: 'BUF', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/buf.png', espnId: 2 },
      { name: 'Carolina Panthers', abbreviation: 'CAR', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/car.png', espnId: 29 },
      { name: 'Chicago Bears', abbreviation: 'CHI', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/chi.png', espnId: 3 },
      { name: 'Cincinnati Bengals', abbreviation: 'CIN', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/cin.png', espnId: 4 },
      { name: 'Cleveland Browns', abbreviation: 'CLE', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/cle.png', espnId: 5 },
      { name: 'Dallas Cowboys', abbreviation: 'DAL', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/dal.png', espnId: 6 },
      { name: 'Denver Broncos', abbreviation: 'DEN', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/den.png', espnId: 7 },
      { name: 'Detroit Lions', abbreviation: 'DET', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/det.png', espnId: 8 },
      { name: 'Green Bay Packers', abbreviation: 'GB', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/gb.png', espnId: 9 },
      { name: 'Houston Texans', abbreviation: 'HOU', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/hou.png', espnId: 34 },
      { name: 'Indianapolis Colts', abbreviation: 'IND', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ind.png', espnId: 11 },
      { name: 'Jacksonville Jaguars', abbreviation: 'JAX', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/jax.png', espnId: 30 },
      { name: 'Kansas City Chiefs', abbreviation: 'KC', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/kc.png', espnId: 12 },
      { name: 'Las Vegas Raiders', abbreviation: 'LV', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lv.png', espnId: 13 },
      { name: 'Los Angeles Chargers', abbreviation: 'LAC', league: 'NFL', division: 'AFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lac.png', espnId: 24 },
      { name: 'Los Angeles Rams', abbreviation: 'LAR', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/lar.png', espnId: 14 },
      { name: 'Miami Dolphins', abbreviation: 'MIA', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/mia.png', espnId: 15 },
      { name: 'Minnesota Vikings', abbreviation: 'MIN', league: 'NFL', division: 'NFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/min.png', espnId: 16 },
      { name: 'New England Patriots', abbreviation: 'NE', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ne.png', espnId: 17 },
      { name: 'New Orleans Saints', abbreviation: 'NO', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/no.png', espnId: 18 },
      { name: 'New York Giants', abbreviation: 'NYG', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyg.png', espnId: 19 },
      { name: 'New York Jets', abbreviation: 'NYJ', league: 'NFL', division: 'AFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/nyj.png', espnId: 20 },
      { name: 'Philadelphia Eagles', abbreviation: 'PHI', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/phi.png', espnId: 21 },
      { name: 'Pittsburgh Steelers', abbreviation: 'PIT', league: 'NFL', division: 'AFC North', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/pit.png', espnId: 23 },
      { name: 'San Francisco 49ers', abbreviation: 'SF', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/sf.png', espnId: 25 },
      { name: 'Seattle Seahawks', abbreviation: 'SEA', league: 'NFL', division: 'NFC West', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', espnId: 26 },
      { name: 'Tampa Bay Buccaneers', abbreviation: 'TB', league: 'NFL', division: 'NFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/tb.png', espnId: 27 },
      { name: 'Tennessee Titans', abbreviation: 'TEN', league: 'NFL', division: 'AFC South', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/ten.png', espnId: 10 },
      { name: 'Washington Commanders', abbreviation: 'WAS', league: 'NFL', division: 'NFC East', logoUrl: 'https://a.espncdn.com/i/teamlogos/nfl/500/was.png', espnId: 28 },
      
      // All college teams with ESPN IDs - comprehensive list
      // Major programs first
      { name: 'Alabama Crimson Tide', abbreviation: 'ALA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/333.png', espnId: 333 },
      { name: 'Auburn Tigers', abbreviation: 'AUB', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png', espnId: 2 },
      { name: 'BYU Cougars', abbreviation: 'BYU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/252.png', espnId: 252 },
      { name: 'Clemson Tigers', abbreviation: 'CLEM', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png', espnId: 228 },
      { name: 'Florida Gators', abbreviation: 'FLA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png', espnId: 57 },
      { name: 'Georgia Bulldogs', abbreviation: 'UGA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png', espnId: 61 },
      { name: 'LSU Tigers', abbreviation: 'LSU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/99.png', espnId: 99 },
      { name: 'Michigan Wolverines', abbreviation: 'MICH', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/130.png', espnId: 130 },
      { name: 'Ohio State Buckeyes', abbreviation: 'OSU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/194.png', espnId: 194 },
      { name: 'Oklahoma Sooners', abbreviation: 'OU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/201.png', espnId: 201 },
      { name: 'Oregon Ducks', abbreviation: 'ORE', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2483.png', espnId: 2483 },
      { name: 'Penn State Nittany Lions', abbreviation: 'PSU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/213.png', espnId: 213 },
      { name: 'Tennessee Volunteers', abbreviation: 'TENN', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png', espnId: 2633 },
      { name: 'Texas Longhorns', abbreviation: 'TEX', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/251.png', espnId: 251 },
      { name: 'USC Trojans', abbreviation: 'USC', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/30.png', espnId: 30 },
      { name: 'Notre Dame Fighting Irish', abbreviation: 'ND', league: 'COLLEGE', conference: 'Independent', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/87.png', espnId: 87 },
      { name: 'Miami Hurricanes', abbreviation: 'MIA', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2390.png', espnId: 2390 },
      { name: 'Texas A&M Aggies', abbreviation: 'TAMU', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/245.png', espnId: 245 },
      { name: 'Kansas State Wildcats', abbreviation: 'KSU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2306.png', espnId: 2306 },
      { name: 'Oklahoma State Cowboys', abbreviation: 'OKST', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/197.png', espnId: 197 },
      { name: 'Mississippi Rebels', abbreviation: 'MISS', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/145.png', espnId: 145 },
      { name: 'Michigan State Spartans', abbreviation: 'MSU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/127.png', espnId: 127 },
      { name: 'Auburn Tigers', abbreviation: 'AUB', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2.png', espnId: 2 },
      { name: 'Georgia Bulldogs', abbreviation: 'UGA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/61.png', espnId: 61 },
      { name: 'Clemson Tigers', abbreviation: 'CLEM', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/228.png', espnId: 228 },
      { name: 'Tennessee Volunteers', abbreviation: 'TENN', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2633.png', espnId: 2633 },
      { name: 'Virginia Tech Hokies', abbreviation: 'VT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/259.png', espnId: 259 },
      { name: 'Houston Cougars', abbreviation: 'UH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/248.png', espnId: 248 },
      { name: 'Florida Gators', abbreviation: 'FLA', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/57.png', espnId: 57 },
      { name: 'Baylor Bears', abbreviation: 'BAY', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/239.png', espnId: 239 },
      { name: 'Arkansas Razorbacks', abbreviation: 'ARK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/8.png', espnId: 8 },
      { name: 'Vanderbilt Commodores', abbreviation: 'VANDY', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/238.png', espnId: 238 },
      { name: 'Iowa Hawkeyes', abbreviation: 'IOWA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2294.png', espnId: 2294 },
      { name: 'Boise State Broncos', abbreviation: 'BSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/68.png', espnId: 68 },
      { name: 'Nebraska Cornhuskers', abbreviation: 'NEB', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/158.png', espnId: 158 },
      { name: 'TCU Horned Frogs', abbreviation: 'TCU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2628.png', espnId: 2628 },
      { name: 'Iowa State Cyclones', abbreviation: 'ISU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/66.png', espnId: 66 },
      { name: 'West Virginia Mountaineers', abbreviation: 'WVU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/277.png', espnId: 277 },
      { name: 'Kentucky Wildcats', abbreviation: 'UK', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/96.png', espnId: 96 },
      { name: 'UCLA Bruins', abbreviation: 'UCLA', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/26.png', espnId: 26 },
      { name: 'Boston College Eagles', abbreviation: 'BC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/103.png', espnId: 103 },
      { name: 'Indiana Hoosiers', abbreviation: 'IU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/84.png', espnId: 84 },
      { name: 'North Carolina Tar Heels', abbreviation: 'UNC', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/153.png', espnId: 153 },
      { name: 'NC State Wolfpack', abbreviation: 'NCST', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/152.png', espnId: 152 },
      { name: 'Arizona Wildcats', abbreviation: 'ARIZ', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/12.png', espnId: 12 },
      { name: 'Utah Utes', abbreviation: 'UTAH', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/254.png', espnId: 254 },
      { name: 'Colorado Buffaloes', abbreviation: 'COLO', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/38.png', espnId: 38 },
      { name: 'Wisconsin Badgers', abbreviation: 'WIS', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/275.png', espnId: 275 },
      { name: 'Arizona State Sun Devils', abbreviation: 'ASU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/9.png', espnId: 9 },
      { name: 'Louisville Cardinals', abbreviation: 'LOU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/97.png', espnId: 97 },
      { name: 'SMU Mustangs', abbreviation: 'SMU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2567.png', espnId: 2567 },
      { name: 'Virginia Cavaliers', abbreviation: 'UVA', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/258.png', espnId: 258 },
      { name: 'Washington Huskies', abbreviation: 'WASH', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/264.png', espnId: 264 },
      { name: 'Tulane Green Wave', abbreviation: 'TUL', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2655.png', espnId: 2655 },
      { name: 'Texas Tech Red Raiders', abbreviation: 'TTU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2641.png', espnId: 2641 },
      { name: 'Duke Blue Devils', abbreviation: 'DUKE', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/150.png', espnId: 150 },
      { name: 'Oregon State Beavers', abbreviation: 'ORST', league: 'COLLEGE', conference: 'Pac-12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/204.png', espnId: 204 },
      { name: 'Florida State Seminoles', abbreviation: 'FSU', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/52.png', espnId: 52 },
      { name: 'Missouri Tigers', abbreviation: 'MIZ', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/142.png', espnId: 142 },
      { name: 'California Golden Bears', abbreviation: 'CAL', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/25.png', espnId: 25 },
      { name: 'Cincinnati Bearcats', abbreviation: 'CIN', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2132.png', espnId: 2132 },
      { name: 'Rutgers Scarlet Knights', abbreviation: 'RU', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/164.png', espnId: 164 },
      { name: 'Memphis Tigers', abbreviation: 'MEM', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/235.png', espnId: 235 },
      { name: 'UCF Knights', abbreviation: 'UCF', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2116.png', espnId: 2116 },
      { name: 'Syracuse Orange', abbreviation: 'SYR', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/183.png', espnId: 183 },
      { name: 'Pittsburgh Panthers', abbreviation: 'PITT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/221.png', espnId: 221 },
      { name: 'Northwestern Wildcats', abbreviation: 'NW', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/77.png', espnId: 77 },
      { name: 'Minnesota Golden Gophers', abbreviation: 'MINN', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/135.png', espnId: 135 },
      { name: 'Kansas Jayhawks', abbreviation: 'KU', league: 'COLLEGE', conference: 'Big 12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2305.png', espnId: 2305 },
      { name: 'Fresno State Bulldogs', abbreviation: 'FRES', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/278.png', espnId: 278 },
      { name: 'Colorado State Rams', abbreviation: 'CSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/36.png', espnId: 36 },
      { name: 'Wyoming Cowboys', abbreviation: 'WYO', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2845.png', espnId: 2845 },
      { name: 'Air Force Falcons', abbreviation: 'AF', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2005.png', espnId: 2005 },
      { name: 'Navy Midshipmen', abbreviation: 'NAVY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2426.png', espnId: 2426 },
      { name: 'Army Black Knights', abbreviation: 'ARMY', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/349.png', espnId: 349 },
      
      // Remaining teams needed for complete restore
      { name: 'Maryland Terrapins', abbreviation: 'MD', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/120.png', espnId: 120 },
      { name: 'Wake Forest Demon Deacons', abbreviation: 'WAKE', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/154.png', espnId: 154 },
      { name: 'Marshall Thundering Herd', abbreviation: 'MARSHALL', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/276.png', espnId: 276 },
      { name: 'Illinois Fighting Illini', abbreviation: 'ILL', league: 'COLLEGE', conference: 'Big Ten', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/356.png', espnId: 356 },
      { name: 'Western Michigan Broncos', abbreviation: 'WMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2711.png', espnId: 2711 },
      { name: 'Middle Tennessee Blue Raiders', abbreviation: 'MTSU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2393.png', espnId: 2393 },
      { name: 'James Madison Dukes', abbreviation: 'JMU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/256.png', espnId: 256 },
      { name: 'Miami RedHawks', abbreviation: 'MIAMI', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/193.png', espnId: 193 },
      { name: 'Liberty Flames', abbreviation: 'LIB', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2335.png', espnId: 2335 },
      { name: 'UNLV Rebels', abbreviation: 'UNLV', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2439.png', espnId: 2439 },
      { name: 'Southern Miss Golden Eagles', abbreviation: 'USM', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2624.png', espnId: 2624 },
      { name: 'Missouri State Bears', abbreviation: 'MOST', league: 'COLLEGE', conference: 'Missouri Valley', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2623.png', espnId: 2623 },
      { name: 'Appalachian State Mountaineers', abbreviation: 'APP', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2026.png', espnId: 2026 },
      { name: 'Ball State Cardinals', abbreviation: 'BALL', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2050.png', espnId: 2050 },
      { name: 'Old Dominion Monarchs', abbreviation: 'ODU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/295.png', espnId: 295 },
      { name: 'Jacksonville State Gamecocks', abbreviation: 'JVST', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/55.png', espnId: 55 },
      { name: 'Washington State Cougars', abbreviation: 'WSU', league: 'COLLEGE', conference: 'Pac-12', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/265.png', espnId: 265 },
      { name: 'South Carolina Gamecocks', abbreviation: 'SC', league: 'COLLEGE', conference: 'SEC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2579.png', espnId: 2579 },
      { name: 'UConn Huskies', abbreviation: 'CONN', league: 'COLLEGE', conference: 'Independent', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/41.png', espnId: 41 },
      { name: 'UTSA Roadrunners', abbreviation: 'UTSA', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2636.png', espnId: 2636 },
      { name: 'Western Kentucky Hilltoppers', abbreviation: 'WKU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/98.png', espnId: 98 },
      { name: 'Georgia Tech Yellow Jackets', abbreviation: 'GT', league: 'COLLEGE', conference: 'ACC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/59.png', espnId: 59 },
      { name: 'Coastal Carolina Chanticleers', abbreviation: 'CCU', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/324.png', espnId: 324 },
      { name: 'San Jose State Spartans', abbreviation: 'SJSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/23.png', espnId: 23 },
      { name: 'Central Michigan Chippewas', abbreviation: 'CMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2117.png', espnId: 2117 },
      { name: 'UTEP Miners', abbreviation: 'UTEP', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2638.png', espnId: 2638 },
      { name: 'Georgia Southern Eagles', abbreviation: 'GASO', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/290.png', espnId: 290 },
      { name: 'Louisiana Ragin\' Cajuns', abbreviation: 'ULL', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/309.png', espnId: 309 },
      { name: 'Sam Houston Bearkats', abbreviation: 'SHSU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2534.png', espnId: 2534 },
      { name: 'Northern Illinois Huskies', abbreviation: 'NIU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2459.png', espnId: 2459 },
      { name: 'Troy Trojans', abbreviation: 'TROY', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2653.png', espnId: 2653 },
      { name: 'Eastern Michigan Eagles', abbreviation: 'EMU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2199.png', espnId: 2199 },
      { name: 'Delaware Blue Hens', abbreviation: 'DEL', league: 'COLLEGE', conference: 'CAA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/48.png', espnId: 48 },
      { name: 'Toledo Rockets', abbreviation: 'TOL', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2649.png', espnId: 2649 },
      { name: 'Kent State Golden Flashes', abbreviation: 'KENT', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2309.png', espnId: 2309 },
      { name: 'Louisiana Tech Bulldogs', abbreviation: 'LT', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2348.png', espnId: 2348 },
      { name: 'Arkansas State Red Wolves', abbreviation: 'ARST', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2032.png', espnId: 2032 },
      { name: 'Buffalo Bulls', abbreviation: 'BUFF', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2084.png', espnId: 2084 },
      { name: 'Florida International Panthers', abbreviation: 'FIU', league: 'COLLEGE', conference: 'C-USA', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2229.png', espnId: 2229 },
      { name: 'South Florida Bulls', abbreviation: 'USF', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/58.png', espnId: 58 },
      { name: 'South Alabama Jaguars', abbreviation: 'USA', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/6.png', espnId: 6 },
      { name: 'North Texas Mean Green', abbreviation: 'UNT', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/249.png', espnId: 249 },
      { name: 'San Diego State Aztecs', abbreviation: 'SDSU', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/21.png', espnId: 21 },
      { name: 'Bowling Green Falcons', abbreviation: 'BGSU', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2073.png', espnId: 2073 },
      { name: 'East Carolina Pirates', abbreviation: 'ECU', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/151.png', espnId: 151 },
      { name: 'UAB Blazers', abbreviation: 'UAB', league: 'COLLEGE', conference: 'American', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/5.png', espnId: 5 },
      { name: 'Ohio Bobcats', abbreviation: 'OHIO', league: 'COLLEGE', conference: 'MAC', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/195.png', espnId: 195 },
      { name: 'Texas State Bobcats', abbreviation: 'TXST', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/326.png', espnId: 326 },
      { name: 'Hawaii Rainbow Warriors', abbreviation: 'HAW', league: 'COLLEGE', conference: 'Mountain West', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/62.png', espnId: 62 },
      { name: 'Louisiana Monroe Warhawks', abbreviation: 'ULM', league: 'COLLEGE', conference: 'Sun Belt', logoUrl: 'https://a.espncdn.com/i/teamlogos/ncaa/500/2433.png', espnId: 2433 }
    ]
    
    console.log('Creating teams...')
    for (const teamData of teams) {
      await prisma.team.create({
        data: {
          name: teamData.name,
          abbreviation: teamData.abbreviation,
          league: teamData.league,
          conference: teamData.conference || null,
          division: teamData.division || null,
          logoUrl: teamData.logoUrl,
          espnId: teamData.espnId,
          wins: 0,
          losses: 0,
          ties: 0
        }
      })
    }
    
    console.log(`Created ${teams.length} teams`)
    
    // Step 3: Restore key selections (at least the ones we know work)
    const keySelections = [
      // Steve's picks
      { participant: 'Steve', team: 'San Francisco 49ers', league: 'NFL', pickNumber: 1 },
      { participant: 'Steve', team: 'Penn State Nittany Lions', league: 'COLLEGE', pickNumber: 2 },
      { participant: 'Steve', team: 'Los Angeles Rams', league: 'NFL', pickNumber: 3 },
      
      // Al's picks
      { participant: 'Al', team: 'Cincinnati Bengals', league: 'NFL', pickNumber: 1 },
      { participant: 'Al', team: 'Baltimore Ravens', league: 'NFL', pickNumber: 2 },
      { participant: 'Al', team: 'BYU Cougars', league: 'COLLEGE', pickNumber: 3 },
      
      // Add more as we verify they work...
    ]
    
    let restored = 0
    for (const selection of keySelections) {
      const participant = await prisma.participant.findFirst({
        where: { name: selection.participant }
      })
      
      const team = await prisma.team.findFirst({
        where: { 
          name: selection.team,
          league: selection.league 
        }
      })
      
      if (participant && team) {
        await prisma.selection.create({
          data: {
            participantId: participant.id,
            teamId: team.id,
            selectionType: selection.league,
            pickNumber: selection.pickNumber
          }
        })
        restored++
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Nuclear option complete',
      teamsCreated: teams.length,
      selectionsRestored: restored,
      note: 'Database completely rebuilt with proper ESPN IDs and logos'
    })
    
  } catch (error) {
    console.error('Nuclear option failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}