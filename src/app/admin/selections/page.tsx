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
  selections: Selection[]
}

interface Selection {
  id: string
  participantId: string
  teamId: string
  selectionType: string
  pickNumber: number
  team: Team
}

export default function AdminSelections() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedParticipant, setSelectedParticipant] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [draggedTeam, setDraggedTeam] = useState<Team | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLeague, setSelectedLeague] = useState<'ALL' | 'NFL' | 'COLLEGE'>('ALL')

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
      
      setParticipants(participantsData)
      setTeams(teamsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      setMessage('Error loading data')
    }
  }

  const clearParticipantSelections = async (participantId: string) => {
    if (!confirm('Are you sure you want to clear all selections for this participant?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/clear-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId }),
      })

      if (res.ok) {
        setMessage('✅ Selections cleared successfully')
        fetchData()
      } else {
        const error = await res.json()
        setMessage(`❌ Error: ${error.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const addSelection = async (participantId: string, teamId: string, pickNumber: number, selectionType: string) => {
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/admin/add-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId, teamId, pickNumber, selectionType }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Selection added successfully')
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

  const removeSelection = async (selectionId: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/remove-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectionId }),
      })

      if (res.ok) {
        setMessage('✅ Selection removed successfully')
        fetchData()
      } else {
        const error = await res.json()
        setMessage(`❌ Error: ${error.message}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, team: Team) => {
    setDraggedTeam(team)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, pickNumber: number) => {
    e.preventDefault()
    
    if (!draggedTeam || !selectedParticipant) return

    const participant = participants.find(p => p.id === selectedParticipant)
    if (!participant) return

    // Check if this pick slot is already occupied
    const existingSelection = participant.selections.find(s => s.pickNumber === pickNumber)
    if (existingSelection) {
      // Remove existing selection first
      await removeSelection(existingSelection.id)
    }

    // Determine selection type based on team league
    const selectionType = draggedTeam.league === 'NFL' ? 'NFL' : 'COLLEGE'
    
    // Check limits
    const currentNFL = participant.selections.filter(s => s.selectionType === 'NFL').length
    const currentCollege = participant.selections.filter(s => s.selectionType === 'COLLEGE').length
    
    if (selectionType === 'NFL' && currentNFL >= 2 && !existingSelection) {
      setMessage('❌ Maximum 2 NFL teams allowed')
      return
    }
    if (selectionType === 'COLLEGE' && currentCollege >= 8 && !existingSelection) {
      setMessage('❌ Maximum 8 college teams allowed')
      return
    }

    // Check if team is already selected
    const teamAlreadySelected = participant.selections.some(s => s.teamId === draggedTeam.id)
    if (teamAlreadySelected) {
      setMessage('❌ Team already selected')
      return
    }

    // Add the selection
    await addSelection(selectedParticipant, draggedTeam.id, pickNumber, selectionType)
    setDraggedTeam(null)
  }

  const handlePickDragStart = (e: React.DragEvent, selection: Selection) => {
    setDraggedTeam(selection.team)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleRemoveFromPick = async (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedTeam) {
      const participant = participants.find(p => p.id === selectedParticipant)
      const selection = participant?.selections.find(s => s.team.id === draggedTeam.id)
      if (selection) {
        await removeSelection(selection.id)
      }
      setDraggedTeam(null)
    }
  }

  const selectedParticipantData = participants.find(p => p.id === selectedParticipant)
  
  // Filter and categorize teams
  const allFilteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLeague = selectedLeague === 'ALL' || team.league === selectedLeague
    return matchesSearch && matchesLeague
  }).sort((a, b) => a.name.localeCompare(b.name))

  // Separate available and unavailable teams
  const { availableTeams, unavailableTeams } = allFilteredTeams.reduce(
    (acc, team) => {
      const selectedBy = participants.find(participant => 
        participant.selections.some(selection => selection.teamId === team.id)
      )
      
      if (selectedBy) {
        acc.unavailableTeams.push({ ...team, selectedBy })
      } else {
        acc.availableTeams.push(team)
      }
      return acc
    },
    { availableTeams: [] as Team[], unavailableTeams: [] as (Team & { selectedBy: Participant })[] }
  )

  // For backward compatibility with existing code
  const filteredTeams = availableTeams

  // Create array for the 10 picks
  const pickSlots = Array.from({ length: 10 }, (_, i) => {
    const pickNumber = i + 1
    const selection = selectedParticipantData?.selections.find(s => s.pickNumber === pickNumber)
    return { pickNumber, selection }
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Drag & Drop Team Selection Manager</h1>
          <p className="text-lg text-gray-900">Drag teams from the right panel to participant picks on the left</p>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-md text-sm ${
            message.includes('Error') || message.includes('❌')
              ? 'bg-red-100 text-red-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {message}
          </div>
        )}

        {/* Participant Selection */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Select Participant</h2>
          
          <div className="flex gap-4 items-center">
            <select
              value={selectedParticipant}
              onChange={(e) => setSelectedParticipant(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose a participant...</option>
              {participants.map((participant) => (
                <option key={participant.id} value={participant.id}>
                  {participant.name} ({participant.selections.length}/10 picks)
                </option>
              ))}
            </select>

            {selectedParticipantData && (
              <button
                onClick={() => clearParticipantSelections(selectedParticipant)}
                disabled={loading}
                className={`px-6 py-3 rounded-md text-sm font-bold border-2 ${
                  loading
                    ? 'bg-yellow-200 text-yellow-800 border-yellow-400 cursor-not-allowed'
                    : 'bg-red-600 text-white border-red-700 hover:bg-red-700 hover:border-red-800 shadow-lg'
                }`}
                style={{
                  minWidth: '120px',
                  visibility: 'visible',
                  opacity: loading ? '0.7' : '1'
                }}
              >
                {loading ? 'Clearing...' : '🗑️ Clear All'}
              </button>
            )}
          </div>
        </div>

        {selectedParticipantData && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Pick Slots */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{selectedParticipantData.name}'s Draft Board</h2>
                <div className="flex gap-4 text-sm">
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    NFL: {selectedParticipantData.selections.filter(s => s.selectionType === 'NFL').length}/2
                  </div>
                  <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                    College: {selectedParticipantData.selections.filter(s => s.selectionType === 'COLLEGE').length}/8
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                {pickSlots.map(({ pickNumber, selection }) => (
                  <div
                    key={pickNumber}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, pickNumber)}
                    className={`p-4 border-2 border-dashed rounded-lg min-h-[60px] flex items-center justify-between transition-colors ${
                      selection 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900 min-w-[60px]">
                        Pick #{pickNumber}
                      </span>
                      
                      {selection ? (
                        <div
                          draggable
                          onDragStart={(e) => handlePickDragStart(e, selection)}
                          className="flex items-center gap-3 cursor-move hover:bg-white p-2 rounded transition-colors"
                        >
                          <span className="font-medium">{selection.team.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            selection.selectionType === 'NFL' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {selection.selectionType}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-900 italic">
                          Drop a team here or drag from another pick
                        </span>
                      )}
                    </div>

                    {selection && (
                      <button
                        onClick={() => removeSelection(selection.id)}
                        disabled={loading}
                        className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                        title="Remove selection"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Available Teams */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Available Teams</h2>
                <div className="text-sm text-gray-900">
                  {filteredTeams.length} teams available
                </div>
              </div>
              
              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search teams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Drag to Remove Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleRemoveFromPick}
                className="mb-4 p-2 border-2 border-dashed border-red-300 bg-red-50 rounded-lg text-center text-red-600 text-sm"
              >
                🗑️ Drag picks here to remove them
              </div>

              <div className="space-y-6 max-h-[600px] overflow-y-auto">
                {/* NFL Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white py-2 border-b">
                    <h3 className="font-semibold text-green-700">NFL Teams</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                      {availableTeams.filter(t => t.league === 'NFL').length} available
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {unavailableTeams.filter(t => t.league === 'NFL').length} taken
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {/* Available NFL Teams */}
                    {availableTeams
                      .filter(team => team.league === 'NFL')
                      .sort((a, b) => {
                        const confCompare = (a.conference || '').localeCompare(b.conference || '')
                        if (confCompare !== 0) return confCompare
                        const divCompare = (a.division || '').localeCompare(b.division || '')
                        if (divCompare !== 0) return divCompare
                        return a.name.localeCompare(b.name)
                      })
                      .map((team) => (
                        <div
                          key={team.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, team)}
                          className="p-2 rounded cursor-move transition-colors border bg-green-50 border-green-200 hover:bg-green-100"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm text-gray-900">{team.name}</span>
                            <span className="px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              NFL
                            </span>
                          </div>
                          <div className="text-xs text-gray-900 mt-1">
                            {team.conference} {team.division}
                          </div>
                        </div>
                      ))}
                    
                    {/* Unavailable NFL Teams */}
                    {unavailableTeams
                      .filter(team => team.league === 'NFL')
                      .sort((a, b) => {
                        const confCompare = (a.conference || '').localeCompare(b.conference || '')
                        if (confCompare !== 0) return confCompare
                        const divCompare = (a.division || '').localeCompare(b.division || '')
                        if (divCompare !== 0) return divCompare
                        return a.name.localeCompare(b.name)
                      })
                      .map((team) => (
                        <div
                          key={team.id}
                          className="p-2 rounded transition-colors border bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-sm text-gray-600">{team.name}</span>
                            <span className="px-1 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                              TAKEN
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {team.conference} {team.division} • by {team.selectedBy.name}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* College Section */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white py-2 border-b">
                    <h3 className="font-semibold text-purple-700">College Teams</h3>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                      {availableTeams.filter(t => t.league === 'COLLEGE').length} available
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {unavailableTeams.filter(t => t.league === 'COLLEGE').length} taken
                    </span>
                  </div>
                  
                  {/* Group Available Teams by Conference */}
                  {Object.entries(
                    availableTeams
                      .filter(team => team.league === 'COLLEGE')
                      .reduce((groups, team) => {
                        const conference = team.conference || 'Other'
                        if (!groups[conference]) groups[conference] = []
                        groups[conference].push(team)
                        return groups
                      }, {} as Record<string, Team[]>)
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([conference, teams]) => (
                      <div key={`available-${conference}`} className="mb-4">
                        <div className="text-xs font-medium text-gray-900 mb-2 px-2">
                          {conference} ({teams.length} available)
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 pl-2">
                          {teams
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((team) => (
                              <div
                                key={team.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, team)}
                                className="p-2 rounded cursor-move transition-colors border bg-purple-50 border-purple-200 hover:bg-purple-100"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm text-gray-900">{team.name}</span>
                                  <span className="px-1 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    {team.conference}
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}

                  {/* Group Unavailable Teams by Conference */}
                  {Object.entries(
                    unavailableTeams
                      .filter(team => team.league === 'COLLEGE')
                      .reduce((groups, team) => {
                        const conference = team.conference || 'Other'
                        if (!groups[conference]) groups[conference] = []
                        groups[conference].push(team)
                        return groups
                      }, {} as Record<string, (Team & { selectedBy: Participant })[]>)
                  )
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([conference, teams]) => (
                      <div key={`taken-${conference}`} className="mb-4">
                        <div className="text-xs font-medium text-gray-600 mb-2 px-2">
                          {conference} ({teams.length} taken)
                        </div>
                        <div className="grid grid-cols-1 gap-1.5 pl-2">
                          {teams
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((team) => (
                              <div
                                key={team.id}
                                className="p-2 rounded transition-colors border bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-sm text-gray-600">{team.name}</span>
                                  <span className="px-1 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                                    TAKEN
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  by {team.selectedBy.name}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/admin/selections/simple"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors mr-4"
          >
            Simple Clear Interface
          </Link>
          <Link
            href="/leaderboard"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </div>
    </div>
  )
}