import React, { useState, useRef, useMemo } from 'react'
import { usePools } from '../contexts/PoolContext'
import poolImage1 from '../images/Image (Neon Matrix) (1).png'
import poolImage2 from '../images/speed syntax.png'
import poolImage3 from '../images/Container memory core.png'
import poolImage4 from '../images/Container quantum leap.png'

// Default images mapping for pools without custom images
const defaultImages: Record<string, string> = {
  'neon-matrix': poolImage1,
  'speed-syntax': poolImage2,
  'memory-core': poolImage3,
  'quantum-leap': poolImage4,
}

interface PoolCardProps {
  poolId: string
  title: string
  category: string
  status: 'available' | 'playing'
  difficulty: 'easy' | 'medium' | 'hard'
  backgroundType: 'logic' | 'word'
  entryAmount: string
  timeRemaining?: string
  action: 'join' | 'spectate' | 'ended'
  delay?: number
  image: string
  onJoinGame?: (title: string, entryAmount: string, category: 'Logic' | 'Word', difficulty?: 'easy' | 'medium' | 'hard') => void
}

interface AvailablePoolsProps {
  onJoinGame?: (title: string, entryAmount: string, category: 'Logic' | 'Word', difficulty?: 'easy' | 'medium' | 'hard') => void
}

// Helper function to map schema categories to display categories
const getCategoryType = (category: string): 'Logic' | 'Word' => {
  const upperCategory = category.toUpperCase()
  if (upperCategory === 'SCIENCE' || upperCategory === 'MATHS') {
    return 'Logic'
  }
  return 'Word'
}

// Helper function to get display name for category
const getCategoryDisplayName = (category: string): string => {
  const upperCategory = category.toUpperCase()
  const categoryMap: Record<string, string> = {
    'SCIENCE': 'Science',
    'MATHS': 'Maths',
    'ENGLISH': 'English',
    'LITERATURE': 'Literature',
    'HISTORY': 'History',
    'LOGIC': 'Logic',
    'WORD': 'Word',
  }
  return categoryMap[upperCategory] || category
}

// Helper function to normalize difficulty
const normalizeDifficulty = (difficulty: string): 'easy' | 'medium' | 'hard' => {
  const upper = difficulty.toUpperCase()
  if (upper === 'EASY') return 'easy'
  if (upper === 'MEDIUM') return 'medium'
  if (upper === 'HARD') return 'hard'
  return difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
}

// Get background type from category
const getBackgroundType = (category?: string): 'logic' | 'word' => {
  if (!category) return 'logic'
  const upper = category.toUpperCase()
  if (upper === 'SCIENCE' || upper === 'MATHS') {
    return 'logic'
  }
  return 'word'
}


const PoolCard: React.FC<PoolCardProps> = ({
  poolId,
  title,
  category,
  status,
  difficulty,
  backgroundType,
  entryAmount,
  timeRemaining,
  action,
  onJoinGame,
  delay = 0,
  image,
}) => {
  const { getPool } = usePools()
  const pool = getPool(poolId)
  
  const currentPlayers = pool?.currentPlayers || 0
  const maxPlayers = pool?.maxPlayers || 0
  const isFull = pool?.isFull || false
  const countdownSeconds = pool?.countdownSeconds ?? null
  const poolStatus = pool?.status || status
  const normalizedDifficulty = normalizeDifficulty(difficulty)

  // Format countdown timer
  const formatCountdown = (seconds: number | null): string => {
    if (seconds === null || seconds === undefined) return ''
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isDisabled = isFull || poolStatus === 'starting' || poolStatus === 'playing' || action === 'ended'
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate position as percentage (0-100)
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    setMousePosition({ x: xPercent, y: yPercent })
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setMousePosition({ x: 50, y: 50 }) // Reset to center
  }

  // Calculate weight effect - the hover point tilts inward, other areas scale up
  const maxDistance = Math.sqrt(50 * 50 + 50 * 50) // Max distance from center
  
  // Calculate distance from hover point
  const distance = Math.sqrt(
    Math.pow(mousePosition.x - 50, 2) + Math.pow(mousePosition.y - 50, 2)
  )
  
  // Weight effect: hover point goes down, other areas scale up
  const weightDepth = isHovering ? Math.max(0, (50 - distance) / 50) * 8 : 0
  const scaleUp = isHovering ? 1 + (distance / maxDistance) * 0.03 : 1
  
  // Tilt towards the hover point (inward)
  const rotateX = isHovering ? (50 - mousePosition.y) * 0.3 : 0
  const rotateY = isHovering ? (mousePosition.x - 50) * 0.3 : 0

  React.useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.setProperty('--animation-delay', `${delay}ms`)
      cardRef.current.style.setProperty('--mouse-x', `${mousePosition.x}%`)
      cardRef.current.style.setProperty('--mouse-y', `${mousePosition.y}%`)
      cardRef.current.style.setProperty('--weight-depth', `${weightDepth}px`)
      cardRef.current.style.setProperty('--rotate-x', `${rotateX}deg`)
      cardRef.current.style.setProperty('--rotate-y', `${rotateY}deg`)
      cardRef.current.style.setProperty('--scale', `${scaleUp}`)
    }
  }, [delay, mousePosition, weightDepth, rotateX, rotateY, scaleUp])

  return (
    <div
      ref={cardRef}
      className={`pool-card pool-card--${backgroundType} ${isHovering ? 'is-hovering' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top 2/3: Graphic Area */}
      <div className="pool-card-graphic">
        <div 
          className="pool-card-background"
          ref={(el) => {
            if (el) {
              el.style.setProperty('background-image', `url(${image})`)
            }
          }}
        ></div>
        <div className="pool-card-overlay">
          <div className="pool-card-header">
            {/* Total amount badge */}
            {pool && pool.totalAmountPaid > 0 && (
              <div className="pool-total-amount-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.5 8.5L22 10L17 14.5L18 21L12 17.5L6 21L7 14.5L2 10L8.5 8.5L12 2Z"
                    fill="#fbbf24"
                  />
                </svg>
                <span>₦{pool.totalAmountPaid.toLocaleString()}</span>
              </div>
            )}
            <div className="pool-tags-left">
              <div
                className={`pool-category pool-category--${category.toLowerCase()}`}
              >
                {category === 'Logic' ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 4C8.343 4 7 5.343 7 7C7 8.657 8.343 10 10 10C11.657 10 13 8.657 13 7C13 5.343 11.657 4 10 4Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M6 12C5.448 12 5 12.448 5 13C5 14.657 6.343 16 8 16H12C13.657 16 15 14.657 15 13C15 12.448 14.552 12 14 12H6Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M14 12C14.552 12 15 12.448 15 13C15 14.657 13.657 16 12 16H8C6.343 16 5 14.657 5 13C5 12.448 5.448 12 6 12H14Z"
                      fill="#ffffff"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2L11.5 7H17L12.75 10L14.25 15L10 12.5L5.75 15L7.25 10L3 7H8.5L10 2Z"
                      fill="#ffffff"
                    />
                  </svg>
                )}
                <span>{getCategoryDisplayName(category)}</span>
              </div>
              <span
                className={`pool-status pool-status--${status}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
              <span
                className={`pool-difficulty pool-difficulty--${normalizedDifficulty}`}
              >
                {normalizedDifficulty.charAt(0).toUpperCase() + normalizedDifficulty.slice(1)}
              </span>
          </div>
          <div className="pool-card-image-section">
            {countdownSeconds !== null && countdownSeconds > 0 ? (
              <div className="pool-countdown-timer">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 13.5C5.515 13.5 3.5 11.485 3.5 9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9C12.5 11.485 10.485 13.5 8 13.5ZM8.5 5.5V9C8.5 9.276 8.276 9.5 8 9.5H5.5C5.224 9.5 5 9.276 5 9C5 8.724 5.224 8.5 5.5 8.5H7.5V5.5C7.5 5.224 7.724 5 8 5C8.276 5 8.5 5.224 8.5 5.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Starting in: {formatCountdown(countdownSeconds)}</span>
              </div>
            ) : timeRemaining ? (
              <div className="pool-time-remaining">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 13.5C5.515 13.5 3.5 11.485 3.5 9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9C12.5 11.485 10.485 13.5 8 13.5ZM8.5 5.5V9C8.5 9.276 8.276 9.5 8 9.5H5.5C5.224 9.5 5 9.276 5 9C5 8.724 5.224 8.5 5.5 8.5H7.5V5.5C7.5 5.224 7.724 5 8 5C8.276 5 8.5 5.224 8.5 5.5Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Starts in: {timeRemaining}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* Bottom 1/3: Info Section */}
      <div className="pool-card-info-section">
        <h3 className="pool-title">{title}</h3>
        <div className="pool-card-info">
          <div className="pool-info-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 8C9.657 8 11 6.657 11 5C11 3.343 9.657 2 8 2C6.343 2 5 3.343 5 5C5 6.657 6.343 8 8 8ZM8 9C6.067 9 2 9.673 2 11.5V13H14V11.5C14 9.673 9.933 9 8 9Z"
                fill="currentColor"
              />
            </svg>
            <span>{currentPlayers} / {maxPlayers} Players</span>
          </div>
          <div className="pool-info-item">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1L10.5 5.5L15.5 6.5L12 9.5L12.5 14.5L8 12L3.5 14.5L4 9.5L0.5 6.5L5.5 5.5L8 1Z"
                fill="currentColor"
              />
            </svg>
            <span>{entryAmount} Entry</span>
          </div>
          {pool?.wordLength && (
            <div className="pool-info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4H14M2 8H14M2 12H10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <span>{pool.wordLength} Letters</span>
            </div>
          )}
          {pool?.rewardPerQuestion && (
            <div className="pool-info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1L10.5 5.5L15.5 6.5L12 9.5L12.5 14.5L8 12L3.5 14.5L4 9.5L0.5 6.5L5.5 5.5L8 1Z"
                  fill="currentColor"
                />
              </svg>
              <span>₦{pool.rewardPerQuestion.toLocaleString()} per Question</span>
            </div>
          )}
          {pool?.questionsPerUser && (
            <div className="pool-info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 13.5C5.515 13.5 3.5 11.485 3.5 9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9C12.5 11.485 10.485 13.5 8 13.5Z"
                  fill="currentColor"
                />
                <path
                  d="M8 6C7.172 6 6.5 6.672 6.5 7.5C6.5 8.328 7.172 9 8 9C8.828 9 9.5 8.328 9.5 7.5C9.5 6.672 8.828 6 8 6Z"
                  fill="currentColor"
                />
              </svg>
              <span>{pool.questionsPerUser} Questions</span>
            </div>
          )}
          {pool?.durationMinutes && (
            <div className="pool-info-item">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 13.5C5.515 13.5 3.5 11.485 3.5 9C3.5 6.515 5.515 4.5 8 4.5C10.485 4.5 12.5 6.515 12.5 9C12.5 11.485 10.485 13.5 8 13.5ZM8.5 5.5V9C8.5 9.276 8.276 9.5 8 9.5H5.5C5.224 9.5 5 9.276 5 9C5 8.724 5.224 8.5 5.5 8.5H7.5V5.5C7.5 5.224 7.724 5 8 5C8.276 5 8.5 5.224 8.5 5.5Z"
                  fill="currentColor"
                />
              </svg>
              <span>{pool.durationMinutes} Min Duration</span>
            </div>
          )}
        </div>
        <button 
          className={`pool-action-button pool-action-button--${isDisabled ? 'ended' : action}`}
          disabled={isDisabled}
          onClick={() => {
            if (action === 'join' && !isDisabled && onJoinGame) {
              onJoinGame(title, entryAmount, getCategoryType(category), normalizedDifficulty)
            }
          }}
        >
          {isFull ? 'Pool Full' : poolStatus === 'starting' ? 'Starting...' : poolStatus === 'playing' ? 'Playing' : action === 'join' ? 'Join Game' : action === 'spectate' ? 'Spectate' : 'Ended'}
          {action !== 'ended' && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 14C4.686 14 2 11.314 2 8C2 4.686 4.686 2 8 2C11.314 2 14 4.686 14 8C14 11.314 11.314 14 8 14ZM7 5V11L11 8L7 5Z"
                fill="currentColor"
              />
            </svg>
          )}
          {action === 'ended' && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1C4.134 1 1 4.134 1 8C1 11.866 4.134 15 8 15C11.866 15 15 11.866 15 8C15 4.134 11.866 1 8 1ZM8 14C4.686 14 2 11.314 2 8C2 4.686 4.686 2 8 2C11.314 2 14 4.686 14 8C14 11.314 11.314 14 8 14ZM6 6L10 10M10 6L6 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

const AvailablePools: React.FC<AvailablePoolsProps> = ({ onJoinGame }) => {
  const { pools } = usePools()

  // Format entry amount
  const formatEntryAmount = (pool: typeof pools[0]): string => {
    if (pool.type === 'Daily') {
      return 'Free'
    }
    const fee = pool.entryFee || 0
    const currency = pool.currency || '₦'
    return `${currency}${fee.toLocaleString()}`
  }

  // Determine action based on pool status
  const getAction = (pool: typeof pools[0]): 'join' | 'spectate' | 'ended' => {
    if (pool.status === 'ended') return 'ended'
    if (pool.status === 'playing') return 'spectate'
    return 'join'
  }

  // Format time remaining
  const formatTimeRemaining = (pool: typeof pools[0]): string | undefined => {
    if (pool.timeUntilEnd && pool.timeUntilEnd > 0) {
      const hours = Math.floor(pool.timeUntilEnd / 3600)
      const minutes = Math.floor((pool.timeUntilEnd % 3600) / 60)
      if (hours > 0) {
        return `${hours}h ${minutes}m`
      }
      return `${minutes}m`
    }
    // If scheduledStart is available, calculate time until start
    if (pool.scheduledStart) {
      const scheduled = new Date(pool.scheduledStart)
      const now = new Date()
      const diffMs = scheduled.getTime() - now.getTime()
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / (1000 * 60 * 60))
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        if (hours > 0) {
          return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
      }
    }
    return undefined
  }

  // Get pool image
  const getPoolImage = (pool: typeof pools[0]): string => {
    if (pool.image) return pool.image
    return defaultImages[pool.id] || poolImage1
  }

  // Filter out ended pools and sort by status
  const displayPools = useMemo(() => {
    return pools
      .filter(pool => pool.status !== 'ended')
      .sort((a, b) => {
        // Sort: available first, then playing
        const statusOrder = { available: 0, full: 1, starting: 2, playing: 3, ended: 4 }
        return statusOrder[a.status] - statusOrder[b.status]
      })
  }, [pools])

  return (
    <section className="available-pools">
      <div className="pools-header">
        <h2 className="pools-title">Available Pools</h2>
        <p className="pools-subtitle">
          Join competitive pools, solve puzzles, and climb the leaderboard.
        </p>
      </div>
      <div className="pools-container">
        <div className="pools-grid">
          {displayPools.map((pool, index) => {
            if (!pool.category || !pool.difficulty) {
              // Skip pools without required metadata
              return null
            }

            const normalizedDifficulty = normalizeDifficulty(pool.difficulty)

            return (
              <PoolCard
                key={pool.id}
                poolId={pool.id}
                title={pool.title}
                category={pool.category} // Pass original category for display
                status={pool.status === 'playing' ? 'playing' : 'available'}
                difficulty={normalizedDifficulty}
                backgroundType={getBackgroundType(pool.category)}
                entryAmount={formatEntryAmount(pool)}
                timeRemaining={formatTimeRemaining(pool)}
                action={getAction(pool)}
                delay={index * 100}
                image={getPoolImage(pool)}
                onJoinGame={onJoinGame}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AvailablePools
