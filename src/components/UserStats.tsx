import React from 'react'

interface StatCardProps {
  label: string
  value: string
  icon: React.ReactNode
  delay?: number
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, delay = 0 }) => {
  return (
    <div
      className="stat-card"
      ref={(el) => {
        if (el) {
          el.style.setProperty('--animation-delay', `${delay}ms`)
        }
      }}
    >
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-icon">{icon}</div>
    </div>
  )
}

const UserStats: React.FC = () => {
  return (
    <section className="user-stats">
      <StatCard
        label="Current Rank"
        value="#42"
        delay={0}
        icon={
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4L28 16H40L30 24L34 36L24 28L14 36L18 24L8 16H20L24 4Z"
              fill="url(#trophyGradient)"
            />
            <defs>
              <linearGradient
                id="trophyGradient"
                x1="24"
                y1="4"
                x2="24"
                y2="36"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>
        }
      />
      <StatCard
        label="Games Won"
        value="85"
        delay={100}
        icon={
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="24" cy="24" r="20" stroke="url(#targetGradient)" strokeWidth="3" />
            <circle cx="24" cy="24" r="12" stroke="url(#targetGradient)" strokeWidth="3" />
            <circle cx="24" cy="24" r="4" fill="url(#targetGradient)" />
            <defs>
              <linearGradient
                id="targetGradient"
                x1="24"
                y1="4"
                x2="24"
                y2="44"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#60a5fa" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        }
      />
      <StatCard
        label="Win Rate"
        value="78%"
        delay={200}
        icon={
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 32L16 24L24 28L32 16L40 20"
              stroke="url(#chartGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 32L16 24L24 28L32 16L40 20"
              stroke="url(#chartGradient)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 2"
            />
            <defs>
              <linearGradient
                id="chartGradient"
                x1="8"
                y1="16"
                x2="40"
                y2="32"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        }
      />
    </section>
  )
}

export default UserStats
