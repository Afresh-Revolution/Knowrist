import React from 'react'
import { useUser } from '../contexts/UserContext'

const WelcomeSection: React.FC = () => {
  const { user } = useUser()
  const displayName = user?.name || user?.username || 'Genius'

  return (
    <section className="welcome-section">
      <h1 className="welcome-title">Welcome back, {displayName}.</h1>
      <p className="welcome-subtitle">Ready to challenge your mind today?</p>
    </section>
  )
}

export default WelcomeSection
