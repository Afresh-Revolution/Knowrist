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
import DailyChallenge, { type DailyDifficulty } from './components/DailyChallenge'
import ActivationCode from './components/ActivationCode'
import ConfirmEntry from './components/ConfirmEntry'
import PaymentSuccess from './components/PaymentSuccess'
import WordInput from './components/WordInput'
import SubmissionComplete from './components/SubmissionComplete'
import { useWallet } from './contexts/WalletContext'
import { usePools } from './contexts/PoolContext'
import { useNotifications } from './contexts/NotificationContext'
import { playChime } from './utils/sound'

// Type definition for available pages
type Page = 'dashboard' | 'leaderboard'

const App: React.FC = () => {
  // Check if authentication is enabled via environment variable
  const isAuthEnabled = import.meta.env.VITE_AUTH_ENABLED === 'true'
  
  // Contexts
  const { balance, deductBalance } = useWallet()
  const { pools, joinPool, getPool } = usePools()
  const { addNotification } = useNotifications()
  
  // State management
  const [showProfile, setShowProfile] = useState(false) // Controls profile modal visibility
  const [isProfileClosing, setIsProfileClosing] = useState(false) // Profile closing animation state
  const [currentPage, setCurrentPage] = useState<Page>('dashboard') // Current active page
  const [isAuthenticated, setIsAuthenticated] = useState(!isAuthEnabled) // Authentication status (skip auth if disabled)
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false) // Daily Challenge overlay visibility
  const [isActivationCodeOpen, setIsActivationCodeOpen] = useState(false) // Activation code screen visibility
  const [selectedDifficulty, setSelectedDifficulty] = useState<DailyDifficulty | null>(null) // Selected difficulty for activation code
  const [isConfirmEntryOpen, setIsConfirmEntryOpen] = useState(false) // Confirm entry modal visibility
  const [selectedPool, setSelectedPool] = useState<{ title: string; entryAmount: string; poolId?: string; category?: 'Logic' | 'Word'; difficulty?: 'easy' | 'medium' | 'hard' } | null>(null) // Selected pool for confirmation
  const [isPaymentSuccessOpen, setIsPaymentSuccessOpen] = useState(false) // Payment success modal visibility
  const [paymentResult, setPaymentResult] = useState<{ success: boolean; activationCode?: string } | null>(null) // Payment result
  const [isWordInputOpen, setIsWordInputOpen] = useState(false) // Word input modal visibility
  const [isSubmissionCompleteOpen, setIsSubmissionCompleteOpen] = useState(false) // Submission complete modal visibility
  const [submittedWords, setSubmittedWords] = useState<Array<{ correct: string; scrambled: string }>>([]) // Submitted words

  // Handle profile close with fade-out animation
  const handleProfileClose = () => {
    setIsProfileClosing(true)
    setTimeout(() => {
      setShowProfile(false)
      setIsProfileClosing(false)
    }, 400) // Match animation duration
  }

  // Show authentication form if auth is enabled and user is not authenticated
  if (isAuthEnabled && !isAuthenticated) {
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
        onDailyChallengeClick={() => setIsDailyChallengeOpen(true)}
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
              <AvailablePools 
                onJoinGame={(title: string, entryAmount: string, category: 'Logic' | 'Word', difficulty?: 'easy' | 'medium' | 'hard') => {
                  // Find pool ID from title
                  const pool = pools.find(p => p.title === title)
                  setSelectedPool({ title, entryAmount, poolId: pool?.id, category, difficulty })
                  setIsConfirmEntryOpen(true)
                }}
              />
              
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
        <div className={`profile-overlay ${isProfileClosing ? 'closing' : ''}`} onClick={handleProfileClose}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <ProfileScreen onClose={handleProfileClose} />
          </div>
        </div>
      )}

      {/* Daily Challenge overlay */}
      <DailyChallenge
        isOpen={isDailyChallengeOpen}
        onClose={() => setIsDailyChallengeOpen(false)}
        onSelectDifficulty={(difficulty: DailyDifficulty) => {
          setSelectedDifficulty(difficulty)
          setIsDailyChallengeOpen(false)
          setIsActivationCodeOpen(true)
        }}
      />

      {/* Activation Code screen */}
      <ActivationCode
        isOpen={isActivationCodeOpen}
        difficulty={selectedDifficulty}
        onClose={() => {
          setIsActivationCodeOpen(false)
          setSelectedDifficulty(null)
        }}
        onContinue={() => {
          // TODO: Navigate to challenge/game screen or start the challenge
          console.log('Starting challenge with difficulty:', selectedDifficulty)
          setIsActivationCodeOpen(false)
          setSelectedDifficulty(null)
        }}
      />

      {/* Confirm Entry modal */}
      <ConfirmEntry
        isOpen={isConfirmEntryOpen}
        poolTitle={selectedPool?.title || ''}
        entryFee={selectedPool?.entryAmount || ''}
        currentBalance={`₦${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        onClose={() => {
          setIsConfirmEntryOpen(false)
          setSelectedPool(null)
        }}
        onConfirm={() => {
          if (!selectedPool?.poolId) return
          
          const entryFeeNum = parseFloat(selectedPool.entryAmount.replace(/[₦,]/g, ''))
          const success = deductBalance(entryFeeNum)
          
          if (success) {
            // Join pool
            joinPool(selectedPool.poolId, entryFeeNum)
            
            // Generate activation code
            const activationCode = `GAME-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
            
            // Check if pool is now full (check after a brief delay to ensure state is updated)
            setTimeout(() => {
              const updatedPool = getPool(selectedPool.poolId!)
              if (updatedPool?.isFull && updatedPool.countdownSeconds === 300) {
                // Play chime sound
                playChime()
                
                // Add notification
                addNotification({
                  title: 'Pool Full!',
                  description: `${selectedPool.title} has reached maximum players. Game starting in 5 minutes!`,
                  type: 'pool-full',
                })
              }
            }, 100)
            
            // Show payment success
            setPaymentResult({ success: true, activationCode })
            setIsConfirmEntryOpen(false)
            setIsPaymentSuccessOpen(true)
          } else {
            // Show payment failure
            setPaymentResult({ success: false })
            setIsConfirmEntryOpen(false)
            setIsPaymentSuccessOpen(true)
          }
        }}
      />

      {/* Payment Success/Failure modal */}
      <PaymentSuccess
        isOpen={isPaymentSuccessOpen}
        isSuccess={paymentResult?.success || false}
        activationCode={paymentResult?.activationCode}
        poolTitle={selectedPool?.title}
        onClose={() => {
          setIsPaymentSuccessOpen(false)
          setSelectedPool(null)
          setPaymentResult(null)
        }}
        onContinue={() => {
          // Store all pool info before closing PaymentSuccess to avoid closure issues
          const poolCategory = selectedPool?.category
          const poolTitle = selectedPool?.title
          const poolId = selectedPool?.poolId
          const entryAmount = selectedPool?.entryAmount
          const poolDifficulty = selectedPool?.difficulty
          
          // Close PaymentSuccess (PaymentSuccess's handleContinue already started fade-out animation
          // and waits 400ms before calling onContinue, so we're already past the fade-out)
          setIsPaymentSuccessOpen(false)
          
          // Open WordInput for ALL pools (both Logic and Word) after payment success
          if (poolTitle) {
            // Preserve selectedPool with all data including category and difficulty for WordInput
            setSelectedPool({ 
              title: poolTitle, 
              entryAmount: entryAmount || '', 
              poolId, 
              category: poolCategory || 'Logic',
              difficulty: poolDifficulty || 'easy'
            })
            // Small delay to ensure PaymentSuccess overlay is fully removed from DOM
            // before opening WordInput (allows fade-out animation to complete)
            setTimeout(() => {
              setIsWordInputOpen(true)
            }, 100)
          } else {
            // Fallback: clean up if no pool title
            setTimeout(() => {
              setSelectedPool(null)
              setPaymentResult(null)
            }, 100)
          }
        }}
      />

      {/* Word Input modal (only for Word category pools) */}
      <WordInput
        isOpen={isWordInputOpen}
        poolTitle={selectedPool?.title || ''}
        poolCategory={selectedPool?.category || 'Logic'}
        difficulty={selectedPool?.difficulty || 'easy'}
        totalWords={5}
        onClose={() => {
          setIsWordInputOpen(false)
          setSelectedPool(null)
          setPaymentResult(null)
        }}
        onComplete={(words) => {
          // Store submitted words and open submission complete screen
          setSubmittedWords(words)
          setIsWordInputOpen(false)
          setTimeout(() => {
            setIsSubmissionCompleteOpen(true)
          }, 100)
        }}
      />

      {/* Submission Complete modal */}
      <SubmissionComplete
        isOpen={isSubmissionCompleteOpen}
        words={submittedWords}
        wordAmounts={submittedWords.map((_, index) => {
          // Calculate word amount based on difficulty and word length
          // For now, using a simple calculation: base amount * difficulty multiplier
          const baseAmount = 20
          const difficultyMultiplier = selectedPool?.difficulty === 'easy' ? 1 : selectedPool?.difficulty === 'medium' ? 1.5 : 2
          const wordLength = submittedWords[index]?.correct.length || 4
          return Math.round(baseAmount * difficultyMultiplier * (wordLength / 4))
        })}
        activationCode={paymentResult?.activationCode || ''}
        poolId={selectedPool?.poolId}
        onClose={() => {
          setIsSubmissionCompleteOpen(false)
          setSubmittedWords([])
          setSelectedPool(null)
          setPaymentResult(null)
        }}
        onEnterArena={() => {
          // TODO: Navigate to game arena
          console.log('Entering game arena with words:', submittedWords)
          setIsSubmissionCompleteOpen(false)
          setSubmittedWords([])
          setSelectedPool(null)
          setPaymentResult(null)
        }}
      />
    </div>
  )
}

export default App
