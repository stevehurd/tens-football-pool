import { prisma } from '@/lib/prisma'
import LeaderboardView from './components/LeaderboardView'

export default async function Home() {
  const participants = await prisma.participant.findMany({
    include: {
      selections: {
        include: {
          team: true,
        },
        orderBy: { pickNumber: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  const calculateScore = (selections: Array<{team: {wins: number | null}}>) => {
    return selections.reduce((total, selection) => {
      return total + (selection.team.wins || 0)
    }, 0)
  }

  const leaderboardData = participants.map(participant => ({
    ...participant,
    totalWins: calculateScore(participant.selections),
    nflTeams: participant.selections.filter(s => s.selectionType === 'NFL'),
    collegeTeams: participant.selections.filter(s => s.selectionType === 'COLLEGE'),
  })).sort((a, b) => b.totalWins - a.totalWins)

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ width: '100%', padding: '32px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>The 10&apos;s</h1>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Football Pool Leaderboard</p>
        </div>

        <LeaderboardView participants={leaderboardData} />
      </div>
    </div>
  )
}
