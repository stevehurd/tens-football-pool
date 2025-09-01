'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TestClear() {
  const [message, setMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testClearSteve = async () => {
    setLoading(true)
    setMessage('Clearing Al\'s selections...')
    
    try {
      const res = await fetch('/api/admin/clear-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantId: 'cmezuqdku002w7ns7lwsk0y4n' }), // Al's ID from the data
      })

      const data = await res.json()
      console.log('Response:', data)

      if (res.ok) {
        setMessage('✅ SUCCESS: Al\'s selections cleared!')
      } else {
        setMessage(`❌ ERROR: ${data.error || data.message}`)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage(`❌ NETWORK ERROR: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 block">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Clear API</h1>
          <p className="text-lg text-gray-900">Test if the clear function works</p>
        </header>

        {message && (
          <div className={`mb-6 p-4 rounded-md text-lg font-medium ${
            message.includes('SUCCESS') 
              ? 'bg-green-100 text-green-800' 
              : message.includes('ERROR')
              ? 'bg-red-100 text-red-800'
              : 'bg-blue-100 text-blue-800'
          }`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-6">Test Clear Selections</h2>
          
          <button
            onClick={testClearSteve}
            disabled={loading}
            className={`px-8 py-4 rounded-md text-lg font-medium ${
              loading
                ? 'bg-gray-300 text-gray-900 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
            }`}
          >
            {loading ? 'Clearing...' : 'Clear Al\'s Selections (TEST)'}
          </button>

          <p className="text-sm text-gray-900 mt-4">
            This will clear all selections for Al as a test.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Check Leaderboard After Test
          </Link>
        </div>
      </div>
    </div>
  )
}