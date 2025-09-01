'use client'

import { useState, useEffect } from 'react'

interface Team {
  id: string
  name: string
  abbreviation: string | null
  wins: number
  losses: number
  logoUrl: string | null
}

interface Selection {
  id: string
  team: Team
  selectionType: string
}

interface Participant {
  id: string
  name: string
  selections: Selection[]
  totalWins: number
  nflTeams: Selection[]
  collegeTeams: Selection[]
}

interface LeaderboardViewProps {
  participants: Participant[]
}

export default function LeaderboardView({ participants }: LeaderboardViewProps) {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setScreenSize('mobile')
      } else if (width < 1024) {
        setScreenSize('tablet')
      } else {
        setScreenSize('desktop')
      }
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Determine grid columns based on screen size
  const getGridColumns = () => {
    switch (screenSize) {
      case 'mobile': return '1fr 1fr'
      case 'tablet': return '1fr 1fr 1fr'
      case 'desktop': return '1fr 1fr 1fr 1fr 1fr'
      default: return '1fr 1fr 1fr 1fr 1fr'
    }
  }

  // Card-based layout for all screen sizes
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {participants.map((participant, index) => (
        <div key={participant.id} style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          padding: screenSize === 'mobile' ? '20px' : '24px',
          border: index === 0 ? '2px solid #eab308' : index === 1 ? '2px solid #6b7280' : index === 2 ? '2px solid #ea580c' : '1px solid #e5e7eb'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: screenSize === 'mobile' ? 'space-between' : 'flex-start',
            marginBottom: '16px',
            flexWrap: 'nowrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: screenSize === 'mobile' ? '40px' : '48px',
                height: screenSize === 'mobile' ? '40px' : '48px',
                marginRight: '12px'
              }}>
                {index < 3 ? (
                  <span style={{ 
                    fontSize: screenSize === 'mobile' ? '32px' : '40px'
                  }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                ) : (
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    fontSize: screenSize === 'mobile' ? '16px' : '18px',
                    fontWeight: 'bold',
                    backgroundColor: '#d1d5db',
                    color: '#6b7280'
                  }}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div style={{ 
                fontSize: screenSize === 'mobile' ? '20px' : '24px', 
                fontWeight: 'bold', 
                color: '#111827',
                marginRight: screenSize !== 'mobile' ? '16px' : '0'
              }}>
                {participant.name}
              </div>
              {screenSize !== 'mobile' && (
                <div style={{ 
                  fontSize: '40px', 
                  fontWeight: 'bold', 
                  color: '#059669' 
                }}>
                  {participant.totalWins}
                </div>
              )}
            </div>
            {screenSize === 'mobile' && (
              <div style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#059669' 
              }}>
                {participant.totalWins}
              </div>
            )}
          </div>
          
          <div>
            {participant.selections.length > 0 ? (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: getGridColumns(), 
                gap: '8px' 
              }}>
                {[...participant.nflTeams, ...participant.collegeTeams].map((selection: Selection) => (
                  <div key={selection.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    padding: screenSize === 'mobile' ? '10px 12px' : '12px 14px',
                    borderRadius: '8px',
                    fontSize: screenSize === 'mobile' ? '13px' : '14px'
                  }}>
                    {selection.team.logoUrl && (
                      <img 
                        src={selection.team.logoUrl} 
                        alt=""
                        style={{
                          width: screenSize === 'mobile' ? '22px' : '24px',
                          height: screenSize === 'mobile' ? '22px' : '24px',
                          objectFit: 'contain',
                          marginRight: '10px',
                          flexShrink: 0
                        }}
                      />
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        fontSize: screenSize === 'mobile' ? '12px' : '13px' 
                      }}>
                        {selection.team.abbreviation || selection.team.name}
                      </div>
                      <div style={{ 
                        color: '#6b7280', 
                        fontWeight: 'bold', 
                        fontSize: screenSize === 'mobile' ? '11px' : '12px' 
                      }}>
                        ({selection.team.wins}-{selection.team.losses})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No picks yet</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}