'use client'

import React, { useState } from 'react'

const Leaderboards = () => {
  const [activeTab, setActiveTab] = useState('winners')

  // Mock data - replace with your actual data

  const mockDrawMasters = [
    { id: 1, username: 'DrawKing', draws: 45, avatar: '🤝' },
    { id: 2, username: 'StalematePro', draws: 38, avatar: '⚖️' },
    { id: 3, username: 'DefensiveWall', draws: 32, avatar: '🛡️' },
    { id: 4, username: 'EndgameExpert', draws: 28, avatar: '♟️' },
    { id: 5, username: 'PatientPlayer', draws: 24, avatar: '⏰' },
  ]


  const tabs = [
    { id: 'winners', label: 'Stockfish Conquerors', icon: '👑' },
    { id: 'draws', label: 'Draw Masters', icon: '🤝' },
  ]

  const renderWinnersTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
        <p className="text-orange-800 font-medium">
          These legendary players have achieved the impossible - defeating Stockfish!
        </p>
      </div>
      
    </div>
  )

  const renderDrawsTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
        <p className="text-orange-800 font-medium">
          Masters of endgame strategy who consistently force draws against Stockfish
        </p>
      </div>
      {mockDrawMasters.map((player, index) => (
        <div
          key={player.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 font-bold">
              #{index + 1}
            </div>
            <span className="text-2xl">{player.avatar}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{player.username}</h3>
              <p className="text-sm text-gray-500">Draw Specialist</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{player.draws}</div>
            <div className="text-sm text-gray-500">Draws</div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderPerformersTab = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg border-l-4 border-orange-500">
        <p className="text-orange-800 font-medium">
          Overall performance ranking: Wins (3pts) • Draws (1pt) • Defeats (0.1pts)
        </p>
      </div>
      
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'winners':
        return renderWinnersTab()
      case 'draws':
        return renderDrawsTab()
      case 'performers':
        return renderPerformersTab()
      default:
        return renderWinnersTab()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🏆 Chess Leaderboards
          </h1>
          <p className="text-gray-600 text-lg">
            Celebrating the greatest minds that challenge Stockfish
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {renderTabContent()}
        </div>

        {/* Footer Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 ">
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-orange-600">{0}</div>
            <div className="text-sm text-gray-500">Stockfish Defeaters</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border text-center">
            <div className="text-2xl font-bold text-orange-600">
              {mockDrawMasters.reduce((acc, player) => acc + player.draws, 0)}
            </div>
            <div className="text-sm text-gray-500">Total Draws</div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Leaderboards