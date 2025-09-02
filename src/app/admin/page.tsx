'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Admin() {
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [syncResults, setSyncResults] = useState<string | null>(null)
  const [fixing, setFixing] = useState(false)
  const [fixResults, setFixResults] = useState<string | null>(null)

  const handleSyncTeams = async () => {
    setSyncing(true)
    setSyncResults(null)

    try {
      const response = await fetch('/api/admin/sync-teams', {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setLastSync(new Date().toLocaleString())
        setSyncResults(`✅ Sync successful: ${data.updated} teams updated`)
      } else {
        setSyncResults(`❌ Sync failed: ${data.error}`)
      }
    } catch (error) {
      setSyncResults(`❌ Sync failed: ${error}`)
    } finally {
      setSyncing(false)
    }
  }

  const handleFixData = async () => {
    setFixing(true)
    setFixResults(null)

    try {
      // First fix logos
      const logoResponse = await fetch('/api/admin/fix-logos', {
        method: 'POST',
      })
      const logoData = await logoResponse.json()
      
      // Then fix college selections
      const collegeResponse = await fetch('/api/admin/fix-college-selections', {
        method: 'POST',
      })
      const collegeData = await collegeResponse.json()
      
      if (logoResponse.ok && collegeResponse.ok) {
        setFixResults(`✅ Fixed ${logoData.fixed} logos and ${collegeData.migrated} college selections`)
      } else {
        setFixResults(`❌ Fix failed: ${logoData.error || collegeData.error}`)
      }
    } catch (error) {
      setFixResults(`❌ Fix failed: ${error}`)
    } finally {
      setFixing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-lg text-gray-900">Manage The 10's Football Pool</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Team Data Management</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-900 mb-2">
                  Sync team records from ESPN API to get the latest win/loss data for accurate leaderboard calculations.
                </p>
                
                <button
                  onClick={handleSyncTeams}
                  disabled={syncing}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    syncing
                      ? 'bg-gray-300 text-gray-900 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {syncing ? '🔄 Syncing Team Data...' : '📊 Sync Team Records'}
                </button>
                
                <button
                  onClick={handleFixData}
                  disabled={fixing}
                  className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                    fixing
                      ? 'bg-gray-300 text-gray-900 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {fixing ? '🔧 Fixing Data...' : '🔧 Fix Logos & College Teams'}
                </button>
              </div>

              {lastSync && (
                <div className="text-sm text-gray-900">
                  Last sync: {lastSync}
                </div>
              )}

              {syncResults && (
                <div className={`p-3 rounded-md text-sm ${
                  syncResults.includes('✅') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {syncResults}
                </div>
              )}
              
              {fixResults && (
                <div className={`p-3 rounded-md text-sm ${
                  fixResults.includes('✅') 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {fixResults}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                href="/leaderboard"
                className="block w-full text-white text-center py-3 px-6 rounded-md transition-colors font-bold border-2"
                style={{
                  backgroundColor: '#16A34A !important',
                  borderColor: '#15803D !important',
                  color: 'white !important',
                  display: 'block !important',
                  visibility: 'visible' as const,
                  opacity: '1 !important',
                  minHeight: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                📊 View Leaderboard
              </Link>
              
              <Link
                href="/teams"
                className="block w-full text-white text-center py-3 px-6 rounded-md transition-colors font-bold border-2"
                style={{
                  backgroundColor: '#4B5563 !important',
                  borderColor: '#374151 !important',
                  color: 'white !important',
                  display: 'block !important',
                  visibility: 'visible' as const,
                  opacity: '1 !important',
                  minHeight: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                🏆 Manage Teams
              </Link>

              <Link
                href="/draft"
                className="block w-full text-white text-center py-3 px-6 rounded-md transition-colors font-bold border-2"
                style={{
                  backgroundColor: '#7C3AED !important',
                  borderColor: '#5B21B6 !important',
                  color: 'white !important',
                  display: 'block !important',
                  visibility: 'visible' as const,
                  opacity: '1 !important',
                  minHeight: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                🏈 Draft Interface
              </Link>

              <Link
                href="/admin/selections"
                className="block w-full text-white text-center py-3 px-6 rounded-md transition-colors font-bold border-2"
                style={{
                  backgroundColor: '#EA580C !important',
                  borderColor: '#C2410C !important',
                  color: 'white !important',
                  display: 'block !important',
                  visibility: 'visible' as const,
                  opacity: '1 !important',
                  minHeight: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                ⚙️ Manage Selections
              </Link>

              <Link
                href="/admin/selections/simple"
                className="block w-full text-white text-center py-3 px-6 rounded-md transition-colors font-bold border-2"
                style={{
                  backgroundColor: '#DC2626 !important',
                  borderColor: '#991B1B !important',
                  color: 'white !important',
                  display: 'block !important',
                  visibility: 'visible' as const,
                  opacity: '1 !important',
                  minHeight: '48px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                🗑️ Clear Selections (Simple)
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Data Sources</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Integration</h3>
              <p className="text-sm text-gray-900">
                📡 <strong>ESPN API</strong> - Free tier providing team records and basic stats
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Recommended for Production</h3>
              <ul className="text-sm text-gray-900 space-y-1">
                <li>🏆 ESPN Developer API ($200-500/month)</li>
                <li>📊 SportsData.io ($50-300/month)</li>
                <li>🎲 The Odds API ($100-500/month)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}