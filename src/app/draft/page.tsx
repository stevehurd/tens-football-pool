'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  abbreviation?: string
  league: string
  conference?: string
  division?: string
  logoUrl?: string
}

interface Participant {
  id: string
  name: string
}

interface Selection {
  participantId: string
  teamId: string
  selectionType: string
  pickNumber: number
}

export default function Draft() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedParticipant, setSelectedParticipant] = useState<string>('')
  const [selections, setSelections] = useState<Selection[]>([])
  const [currentPick, setCurrentPick] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedParticipant) {
      fetchSelections()
    }
  }, [selectedParticipant])

  const fetchData = async () => {
    try {
      const [participantsRes, teamsRes] = await Promise.all([
        fetch('/api/participants'),
        fetch('/api/teams')
      ])
      
      const participantsData = await participantsRes.json()
      const teamsData = await teamsRes.json()
      
      setParticipants(participantsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const fetchSelections = async () => {
    try {
      const res = await fetch(`/api/selections?participantId=${selectedParticipant}`)
      const data = await res.json()
      setSelections(data)
      setCurrentPick(data.length + 1)
    } catch (error) {
      console.error('Error fetching selections:', error)
    }
  }

  const makeSelection = async (teamId: string) => {
    if (!selectedParticipant || currentPick > 10) return

    const team = teams.find(t => t.id === teamId)
    if (!team) return

    const nflSelections = selections.filter(s => s.selectionType === 'NFL').length
    const collegeSelections = selections.filter(s => s.selectionType === 'COLLEGE').length

    if (team.league === 'NFL' && nflSelections >= 2) {
      alert('You can only select 2 NFL teams!')
      return
    }

    if (team.league === 'COLLEGE' && collegeSelections >= 8) {
      alert('You can only select 8 college teams!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/selections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantId: selectedParticipant,
          teamId,
          selectionType: team.league,
          pickNumber: currentPick,
        }),
      })

      if (res.ok) {
        const newSelection = await res.json()
        setSelections([...selections, newSelection])
        setCurrentPick(currentPick + 1)
      } else {
        const error = await res.json()
        alert(error.message || 'Error making selection')
      }
    } catch (error) {
      console.error('Error making selection:', error)
      alert('Error making selection')
    } finally {
      setLoading(false)
    }
  }

  const isTeamSelected = (teamId: string) => {
    return selections.some(s => s.teamId === teamId)
  }

  const nflTeams = teams.filter(t => t.league === 'NFL')
  const collegeTeams = teams.filter(t => t.league === 'COLLEGE')
  const nflSelections = selections.filter(s => s.selectionType === 'NFL').length
  const collegeSelections = selections.filter(s => s.selectionType === 'COLLEGE').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Make Your Picks</h1>
          <p className="text-lg text-gray-900">Select 2 NFL teams and 8 college teams</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Participant</h2>
          <select
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a participant...</option>
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        {selectedParticipant && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Draft Progress</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{currentPick - 1}</div>
                  <div className="text-sm text-gray-900">Total Picks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{nflSelections}</div>
                  <div className="text-sm text-gray-900">NFL Teams (2 max)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{collegeSelections}</div>
                  <div className="text-sm text-gray-900">College Teams (8 max)</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{10 - (currentPick - 1)}</div>
                  <div className="text-sm text-gray-900">Remaining</div>
                </div>
              </div>
              
              {currentPick <= 10 && (
                <div className="mt-4 text-center">
                  <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                    Pick #{currentPick}
                  </div>
                </div>
              )}
            </div>

            {currentPick <= 10 ? (
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-green-600">
                    NFL Teams ({nflSelections}/2)
                  </h3>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {nflTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => makeSelection(team.id)}
                        disabled={loading || isTeamSelected(team.id) || nflSelections >= 2}
                        className={`p-3 text-left rounded-md transition-colors ${
                          isTeamSelected(team.id)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : nflSelections >= 2
                            ? 'bg-gray-100 text-gray-900 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-blue-50 text-gray-900 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {team.logoUrl && (
                            <img 
                              src={team.logoUrl} 
                              alt={`${team.name} logo`}
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-sm text-gray-900">
                              {team.division} • {team.abbreviation}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-purple-600">
                    College Teams ({collegeSelections}/8)
                  </h3>
                  <div className="grid gap-2 max-h-96 overflow-y-auto">
                    {collegeTeams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => makeSelection(team.id)}
                        disabled={loading || isTeamSelected(team.id) || collegeSelections >= 8}
                        className={`p-3 text-left rounded-md transition-colors ${
                          isTeamSelected(team.id)
                            ? 'bg-green-100 text-green-800 cursor-not-allowed'
                            : collegeSelections >= 8
                            ? 'bg-gray-100 text-gray-900 cursor-not-allowed'
                            : 'bg-gray-50 hover:bg-purple-50 text-gray-900 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {team.logoUrl && (
                            <img 
                              src={team.logoUrl} 
                              alt={`${team.name} logo`}
                              className="w-5 h-5 object-contain flex-shrink-0"
                            />
                          )}
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-sm text-gray-900">{team.conference}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <h3 className="text-xl font-semibold text-green-600 mb-2">Draft Complete!</h3>
                <p className="text-gray-900 mb-4">
                  All 10 picks have been made for {participants.find(p => p.id === selectedParticipant)?.name}
                </p>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Leaderboard
                </Link>
              </div>
            )}

            {selections.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Current Selections</h3>
                <div className="grid gap-2">
                  {selections.map((selection, index) => {
                    const team = teams.find(t => t.id === selection.teamId)
                    return (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium">Pick #{selection.pickNumber}</span>
                        <span>{team?.name}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selection.selectionType === 'NFL' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selection.selectionType}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}