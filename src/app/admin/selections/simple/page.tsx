'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Team {
  id: string
  name: string
  abbreviation?: string
  league: string
  logoUrl?: string
}

interface Participant {
  id: string
  name: string
  selections: Array<{
    id: string
    pickNumber: number
    team: Team
    selectionType: string
  }>
}

export default function SimpleSelectionManager() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [participantsRes, teamsRes] = await Promise.all([
        fetch('/api/admin/participants-with-selections'),
        fetch('/api/teams')
      ])
      
      const participantsData = await participantsRes.json()
      const teamsData = await teamsRes.json()
      
      console.log('Participants:', participantsData.length)
      console.log('Teams:', teamsData.length)
      
      setParticipants(participantsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Error loading data')
    }
  }

  const clearParticipantSelections = async (participantId: string, participantName: string) => {
    if (!confirm(`Are you sure you want to clear all selections for ${participantName}?`)) {
      return
    }

    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/admin/clear-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(`✅ Cleared selections for ${participantName}`)
        fetchData()
      } else {
        setMessage(`❌ Error: ${data.error || data.message}`)
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const nflTeams = teams.filter(t => t.league === 'NFL').sort((a, b) => a.name.localeCompare(b.name))
  const collegeTeams = teams.filter(t => t.league === 'COLLEGE').sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Simple Selection Manager</h1>
          <p className="text-lg text-gray-900">Clear participant selections</p>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm ${
            message.includes('Error') 
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Debug Info</h2>
          <div className="text-sm text-gray-900">
            <p>Participants loaded: {participants.length}</p>
            <p>Teams loaded: {teams.length}</p>
            <p>NFL teams: {nflTeams.length}</p>
            <p>College teams: {collegeTeams.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">All Participants</h2>
          
          <div className="space-y-4">
            {participants.map((participant) => (
              <div key={participant.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium">{participant.name}</h3>
                    <p className="text-sm text-gray-900">
                      {participant.selections.length}/10 picks
                      {' | '}
                      NFL: {participant.selections.filter(s => s.selectionType === 'NFL').length}/2
                      {' | '}
                      College: {participant.selections.filter(s => s.selectionType === 'COLLEGE').length}/8
                    </p>
                  </div>
                  
                  <button
                    onClick={() => clearParticipantSelections(participant.id, participant.name)}
                    disabled={loading || participant.selections.length === 0}
                    className={`px-6 py-3 rounded-md text-sm font-bold border-2 ${
                      participant.selections.length === 0
                        ? 'bg-gray-200 text-gray-900 border-gray-300 cursor-not-allowed'
                        : loading
                        ? 'bg-yellow-200 text-yellow-800 border-yellow-400 cursor-not-allowed'
                        : 'bg-red-600 text-white border-red-700 hover:bg-red-700 hover:border-red-800 shadow-lg'
                    }`}
                    style={{
                      minWidth: '140px',
                      visibility: 'visible',
                      opacity: participant.selections.length === 0 ? '0.5' : '1'
                    }}
                  >
                    {loading ? 'Clearing...' : `🗑️ Clear All (${participant.selections.length})`}
                  </button>
                </div>

                {participant.selections.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {participant.selections
                      .sort((a, b) => a.pickNumber - b.pickNumber)
                      .map((selection) => (
                      <div key={selection.id} className="flex items-center p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium mr-2">#{selection.pickNumber}</span>
                        <div className="flex items-center gap-2 flex-1">
                          {selection.team.logoUrl && (
                            <img 
                              src={selection.team.logoUrl} 
                              alt={`${selection.team.name} logo`}
                              className="w-5 h-5 object-contain"
                            />
                          )}
                          <span>{selection.team.name}</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selection.selectionType === 'NFL' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {selection.selectionType}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {participant.selections.length === 0 && (
                  <p className="text-gray-900 text-center py-4">No selections</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/admin/selections"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors mr-4"
          >
            Back to Full Manager
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