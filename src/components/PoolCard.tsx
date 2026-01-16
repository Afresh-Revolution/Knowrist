import React, { useState, useEffect } from 'react'

interface Pool {
  id: string
  title: string
  type: 'Daily' | 'Paid'
  entryFee: string
  currency: string
  activePlayers: number
  currentPot: string
  status: 'active' | 'pending' | 'ended'
  timeUntilStart?: number // seconds until game starts (for pending)
  timeUntilEnd?: number // seconds until game ends (for active)
}

interface PoolCardProps {
  pool: Pool
  onEdit: () => void
  onStop: () => void
}

const PoolCard: React.FC<PoolCardProps> = ({ pool, onEdit, onStop }) => {
  const [timeUntilStart, setTimeUntilStart] = useState(pool.timeUntilStart || 0)
  const [timeUntilEnd, setTimeUntilEnd] = useState(pool.timeUntilEnd || 0)

  // Countdown timer effect
  useEffect(() => {
    if (pool.status === 'pending' && timeUntilStart > 0) {
      const interval = setInterval(() => {
        setTimeUntilStart((prev) => {
          if (prev <= 1) return 0
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    } else if (pool.status === 'active' && timeUntilEnd > 0) {
      const interval = setInterval(() => {
        setTimeUntilEnd((prev) => {
          if (prev <= 1) return 0
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [pool.status, timeUntilStart, timeUntilEnd])

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return '0m'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getStatusLabel = () => {
    switch (pool.status) {
      case 'active':
        return 'Active'
      case 'pending':
        return 'Pending'
      case 'ended':
        return 'Ended'
      default:
        return 'Unknown'
    }
  }

  return (
    <div className="admin-pool-card">
      <div className="admin-pool-card-header">
        <div>
          <h3 className="admin-pool-card-title">{pool.title}</h3>
          <p className="admin-pool-card-subtitle">
            {pool.type} • {pool.entryFee}
          </p>
        </div>
        <div className="admin-pool-header-badges">
          <span className={`admin-pool-status-badge ${pool.status}`}>
            {getStatusLabel()}
          </span>
          {(pool.status === 'pending' && timeUntilStart > 0) || (pool.status === 'active' && timeUntilEnd > 0) ? (
            <div className="admin-pool-timer-badge">
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 13.5C5.515 13.5 3.5 11.485 3.5 9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9C12.5 11.485 10.485 13.5 8 13.5ZM8.5 5.5V9C8.5 9.276 8.276 9.5 8 9.5H5.5C5.224 9.5 5 9.276 5 9C5 8.724 5.224 8.5 5.5 8.5H7.5V5.5C7.5 5.224 7.724 5 8 5C8.276 5 8.5 5.224 8.5 5.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>
                {pool.status === 'pending'
                  ? `Starts in: ${formatTime(timeUntilStart)}`
                  : `Ends in: ${formatTime(timeUntilEnd)}`}
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <div className="admin-pool-card-metrics">
        <div className="admin-pool-metric">
          <div className="admin-pool-metric-label">Active Players</div>
          <div className="admin-pool-metric-value">{pool.activePlayers.toLocaleString()}</div>
        </div>
        <div className="admin-pool-metric">
          <div className="admin-pool-metric-label">Pools</div>
          <div className="admin-pool-metric-value pot">{pool.currentPot}</div>
        </div>
      </div>
      <div className="admin-pool-card-actions">
        <button className="admin-pool-action-button edit" onClick={onEdit}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.3333 2.00001C11.5084 1.82489 11.7163 1.68698 11.9441 1.59531C12.1719 1.50364 12.4151 1.46021 12.66 1.46801C12.9049 1.47581 13.1461 1.53468 13.3681 1.64089C13.5901 1.7471 13.7882 1.89833 13.9513 2.08601C14.1144 2.27369 14.2391 2.49391 14.318 2.73334C14.3969 2.97277 14.4284 3.2264 14.4107 3.47868C14.3929 3.73096 14.3262 3.97711 14.2147 4.20268C14.1032 4.42825 13.9493 4.62867 13.7627 4.79334L13.3333 5.33334L10.6667 2.66668L11.1067 2.22668C11.2898 2.04357 11.5126 1.90497 11.7578 1.82134C12.003 1.73771 12.2641 1.71133 12.5213 1.74401C12.7786 1.77669 13.0257 1.86756 13.2433 2.01001L11.3333 2.00001Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.33333 4.00001L12 6.66668M2 14.6667L2.93333 11.3333L5.6 8.66668L8.26667 11.3333L5.6 14L2 14.6667Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Edit</span>
        </button>
        <button className="admin-pool-action-button stop" onClick={onStop}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 2.66667V8M11.3333 4C12.4379 5.10457 13 6.4379 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8C3 6.4379 3.5621 5.10457 4.66667 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Stop</span>
        </button>
      </div>
    </div>
  )
}

export default PoolCard
