/**
 * Main App Component
 * 
 * This is the root component that manages:
 * - Authentication state (shows login/signup form if not authenticated)
 * - Page navigation (Dashboard/Leaderboard)
 * - Profile modal visibility
 * - Main layout structure
 */

import React, { useState } from 'react'
import Header from './components/Header'
import WelcomeSection from './components/WelcomeSection'
import UserStats from './components/UserStats'
import AvailablePools from './components/AvailablePools'
import RecentHistory from './components/RecentHistory'
import FriendsActivity from './components/FriendsActivity'
import ChatBubble from './components/ChatBubble'
import ProfileScreen from './components/ProfileScreen'
import Leaderboard from './components/Leaderboard'
import AuthForm from './components/AuthForm'

// Type definition for available pages
type Page = 'dashboard' | 'leaderboard'

const App: React.FC = () => {
  // State management
  const [showProfile, setShowProfile] = useState(false) // Controls profile modal visibility
  const [currentPage, setCurrentPage] = useState<Page>('dashboard') // Current active page
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Authentication status

  // Show authentication form if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app">
        <AuthForm onClose={() => setIsAuthenticated(true)} />
      </div>
    )
  }

  // Main application layout (shown after authentication)
  return (
    <div className="app">
      {/* Navigation header with logo, menu, notifications, and profile */}
      <Header 
        onProfileClick={() => setShowProfile(!showProfile)} 
        isProfileOpen={showProfile}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      
      {/* Main content area */}
      <main className="main-content">
        {currentPage === 'dashboard' ? (
          <>
            {/* Welcome message section */}
            <WelcomeSection />
            
            {/* User statistics cards */}
            <UserStats />
            
            {/* Pools and activity section */}
            <div className="pools-section">
              {/* Available game pools */}
              <AvailablePools />
              
              {/* Sidebar with recent history and friends activity */}
              <div className="activity-sidebar">
                <RecentHistory />
                <FriendsActivity />
              </div>
            </div>
          </>
        ) : (
          // Leaderboard page
          <Leaderboard />
        )}
      </main>
      
      {/* Floating chat bubble */}
      <ChatBubble />
      
      {/* Profile modal overlay */}
      {showProfile && (
        <div className="profile-overlay" onClick={() => setShowProfile(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <ProfileScreen onClose={() => setShowProfile(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
