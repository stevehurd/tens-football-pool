import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Teams() {
  const teams = await prisma.team.findMany({
    include: {
      selections: {
        include: {
          participant: true,
        },
      },
    },
    orderBy: [
      { league: 'asc' },
      { name: 'asc' }
    ],
  })

  const nflTeams = teams.filter(t => t.league === 'NFL')
  const collegeTeams = teams.filter(t => t.league === 'COLLEGE')

  const getTeamStatus = (team: any) => {
    if (team.selections.length === 0) return 'available'
    return 'selected'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Teams</h1>
          <p className="text-lg text-gray-900">NFL and College Football Teams</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-green-600">NFL Teams ({nflTeams.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {nflTeams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-md border ${
                    getTeamStatus(team) === 'selected'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex items-start gap-3">
                      {team.logoUrl && (
                        <img 
                          src={team.logoUrl} 
                          alt={`${team.name} logo`}
                          className="w-10 h-10 object-contain mt-1"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-900">
                          {team.division} • {team.abbreviation}
                        </p>
                        <p className="text-sm text-gray-900 mt-1">
                          Record: {team.wins}-{team.losses}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {team.selections.length > 0 ? (
                        <div>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Selected
                          </span>
                          <div className="text-xs text-gray-900 mt-1">
                            by {team.selections[0].participant.name}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-900 text-xs px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-purple-600">College Teams ({collegeTeams.length})</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {collegeTeams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-md border ${
                    getTeamStatus(team) === 'selected'
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 flex items-start gap-3">
                      {team.logoUrl && (
                        <img 
                          src={team.logoUrl} 
                          alt={`${team.name} logo`}
                          className="w-10 h-10 object-contain mt-1"
                        />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{team.name}</h3>
                        <p className="text-sm text-gray-900">{team.conference}</p>
                        <p className="text-sm text-gray-900 mt-1">
                          Record: {team.wins}-{team.losses}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {team.selections.length > 0 ? (
                        <div>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Selected
                          </span>
                          <div className="text-xs text-gray-900 mt-1">
                            by {team.selections[0].participant.name}
                          </div>
                        </div>
                      ) : (
                        <span className="inline-block bg-gray-100 text-gray-900 text-xs px-2 py-1 rounded-full">
                          Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Team Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {nflTeams.filter(t => t.selections.length > 0).length}
              </div>
              <div className="text-sm text-gray-900">NFL Teams Selected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {nflTeams.filter(t => t.selections.length === 0).length}
              </div>
              <div className="text-sm text-gray-900">NFL Teams Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {collegeTeams.filter(t => t.selections.length > 0).length}
              </div>
              <div className="text-sm text-gray-900">College Teams Selected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {collegeTeams.filter(t => t.selections.length === 0).length}
              </div>
              <div className="text-sm text-gray-900">College Teams Available</div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/draft"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mr-4"
          >
            Make Picks
          </Link>
          <Link
            href="/"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}