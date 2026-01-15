import React, { useEffect, useId, useRef } from 'react'

export type DailyDifficulty = 'easy' | 'medium' | 'hard'

interface DailyChallengeProps {
  isOpen: boolean
  onClose: () => void
  onSelectDifficulty: (difficulty: DailyDifficulty) => void
}

/**
 * Daily Challenge overlay
 *
 * Opens on top of the dashboard when the "Daily Challenge" button is clicked.
 * Users can pick a difficulty (Easy/Medium/Hard) by clicking a card.
 */
const DailyChallenge: React.FC<DailyChallengeProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
}) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [isClosing, setIsClosing] = React.useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  // Close on Escape + basic focus management for accessibility
  useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(false)
      return
    }

    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', onKeyDown)
    // Focus the dialog so keyboard users land inside the overlay
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isClosing])

  if (!isOpen && !isClosing) return null

  return (
    <div 
      ref={overlayRef}
      className={`daily-challenge-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose} 
      aria-hidden="true"
    >
      <div
        className="daily-challenge-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="daily-challenge-header">
          <button
            type="button"
            className="daily-challenge-close"
            onClick={onClose}
            aria-label="Close daily challenge"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <div className="daily-challenge-content">
          <h1 id={titleId} className="daily-challenge-title">
            Select Difficulty
          </h1>
          <p className="daily-challenge-subtitle">
            Choose your challenge level for today&apos;s daily pool. Higher
            difficulties offer greater rewards but require sharper focus.
          </p>

          <div className="daily-difficulty-grid">
            <button
              type="button"
              className="daily-difficulty-card daily-difficulty-card--easy"
              onClick={() => {
                handleClose()
                setTimeout(() => onSelectDifficulty('easy'), 400)
              }}
            >
              <div className="daily-difficulty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    // Brain-like icon (simple, readable at small sizes)
                    d="M9.5 4.2c-1.8 0-3.3 1.4-3.4 3.2C4.9 8 4 9.3 4 10.8c0 1.7 1.1 3.1 2.7 3.6V16c0 1.7 1.3 3 3 3h.8c.6 0 1-.4 1-1v-1.6c0-.6.4-1 1-1s1 .4 1 1V18c0 .6.4 1 1 1h.8c1.7 0 3-1.3 3-3v-1.6c1.6-.5 2.7-1.9 2.7-3.6 0-1.5-.9-2.8-2.1-3.4-.1-1.8-1.6-3.2-3.4-3.2-.8 0-1.5.3-2.1.7-.5-.4-1.2-.7-2-.7Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div className="daily-difficulty-watermark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9.5 4.2c-1.8 0-3.3 1.4-3.4 3.2C4.9 8 4 9.3 4 10.8c0 1.7 1.1 3.1 2.7 3.6V16c0 1.7 1.3 3 3 3h.8c.6 0 1-.4 1-1v-1.6c0-.6.4-1 1-1s1 .4 1 1V18c0 .6.4 1 1 1h.8c1.7 0 3-1.3 3-3v-1.6c1.6-.5 2.7-1.9 2.7-3.6 0-1.5-.9-2.8-2.1-3.4-.1-1.8-1.6-3.2-3.4-3.2-.8 0-1.5.3-2.1.7-.5-.4-1.2-.7-2-.7Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                </svg>
              </div>
              <h3 className="daily-difficulty-name">Easy</h3>
              <p className="daily-difficulty-desc">
                Perfect for warming up. Standard puzzles with relaxed timing.
              </p>
              <span className="daily-difficulty-cta">
                Select Level
                <svg className="daily-difficulty-checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className="daily-difficulty-card daily-difficulty-card--medium"
              onClick={() => {
                handleClose()
                setTimeout(() => onSelectDifficulty('medium'), 400)
              }}
            >
              <div className="daily-difficulty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    // Puzzle-piece icon
                    d="M13.5 3c.8 0 1.5.7 1.5 1.5 0 .3-.1.6-.3.8l-.5.7h1.8c1.1 0 2 .9 2 2v1.7l.7-.5c.2-.2.5-.3.8-.3.8 0 1.5.7 1.5 1.5S19.3 13.5 18.5 13.5c-.3 0-.6-.1-.8-.3l-.7-.5V14.5c0 1.1-.9 2-2 2H13v-1.8l.7.5c.2.2.5.3.8.3.8 0 1.5-.7 1.5-1.5S15.3 12 14.5 12c-.3 0-.6.1-.8.3l-.7.5V11H9.5c-1.1 0-2-.9-2-2V6.5c0-1.1.9-2 2-2H11l-.5-.7c-.2-.2-.3-.5-.3-.8C10.2 2.7 10.9 2 11.7 2c.5 0 .9.2 1.2.6.3-.4.7-.6 1.2-.6Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div className="daily-difficulty-watermark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13.5 3c.8 0 1.5.7 1.5 1.5 0 .3-.1.6-.3.8l-.5.7h1.8c1.1 0 2 .9 2 2v1.7l.7-.5c.2-.2.5-.3.8-.3.8 0 1.5.7 1.5 1.5S19.3 13.5 18.5 13.5c-.3 0-.6-.1-.8-.3l-.7-.5V14.5c0 1.1-.9 2-2 2H13v-1.8l.7.5c.2.2.5.3.8.3.8 0 1.5-.7 1.5-1.5S15.3 12 14.5 12c-.3 0-.6.1-.8.3l-.7.5V11H9.5c-1.1 0-2-.9-2-2V6.5c0-1.1.9-2 2-2H11l-.5-.7c-.2-.2-.3-.5-.3-.8C10.2 2.7 10.9 2 11.7 2c.5 0 .9.2 1.2.6.3-.4.7-.6 1.2-.6Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                </svg>
              </div>
              <h3 className="daily-difficulty-name">Medium</h3>
              <p className="daily-difficulty-desc">
                The standard challenge. Balanced complexity and speed.
              </p>
              <span className="daily-difficulty-cta">
                Select Level
                <svg className="daily-difficulty-checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className="daily-difficulty-card daily-difficulty-card--hard"
              onClick={() => {
                handleClose()
                setTimeout(() => onSelectDifficulty('hard'), 400)
              }}
            >
              <div className="daily-difficulty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
                    fill="currentColor"
                    opacity="0.9"
                  />
                </svg>
              </div>
              <div className="daily-difficulty-watermark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13 2 3 14h7l-1 8 12-14h-7l-1-6Z"
                    fill="currentColor"
                    opacity="0.95"
                  />
                </svg>
              </div>
              <h3 className="daily-difficulty-name">Hard</h3>
              <p className="daily-difficulty-desc">
                For the elite. Complex patterns and unforgiving timers.
              </p>
              <span className="daily-difficulty-cta">
                Select Level
                <svg className="daily-difficulty-checkmark" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          <button type="button" className="daily-challenge-cancel" onClick={handleClose}>
            Cancel and return to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default DailyChallenge

