import React from 'react'

interface HistoryItem {
  game: string
  time: string
  result: 'victory' | 'defeat'
  points: number
}

const RecentHistory: React.FC = () => {
  const historyItems: HistoryItem[] = [
    {
      game: 'Speed Syntax',
      time: '2 mins ago',
      result: 'victory',
      points: 120,
    },
    {
      game: 'Memory Core',
      time: '1 hour ago',
      result: 'defeat',
      points: -20,
    },
    {
      game: 'Quantum Leap',
      time: 'Yesterday',
      result: 'victory',
      points: 450,
    },
  ]

  return (
    <div className="recent-history-card">
      <h3 className="recent-history-title">Recent History</h3>
      <div className="recent-history-list">
        {historyItems.map((item, index) => (
          <div key={index} className="recent-history-item">
            <div className="history-item-main">
              <span className="history-game-name">{item.game}</span>
              <span className="history-time">{item.time}</span>
            </div>
            <div className="history-item-result">
              <span
                className={`history-result history-result--${item.result}`}
              >
                {item.result === 'victory' ? 'Victory' : 'Defeat'}
              </span>
              <span
                className={`history-points history-points--${item.result}`}
              >
                {item.points > 0 ? '+' : ''}{item.points}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentHistory
