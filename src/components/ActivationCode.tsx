import React, { useEffect, useId, useRef } from 'react'
import { type DailyDifficulty } from './DailyChallenge'

interface ActivationCodeProps {
  isOpen: boolean
  difficulty: DailyDifficulty | null
  onClose: () => void
  onContinue: () => void
}

/**
 * Generates a unique activation code based on difficulty
 * Format: DAILY-{E|M|H}-{6-digit-number}
 */
const generateActivationCode = (difficulty: DailyDifficulty): string => {
  const prefix = {
    easy: 'E',
    medium: 'M',
    hard: 'H',
  }[difficulty]

  // Generate a random 6-digit number
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  return `DAILY-${prefix}-${randomNum}`
}

/**
 * Activation Code Screen
 *
 * Displays after a user selects a difficulty level for the daily challenge.
 * Shows a unique activation code that the user can use to start the challenge.
 */
const ActivationCode: React.FC<ActivationCodeProps> = ({
  isOpen,
  difficulty,
  onClose,
  onContinue,
}) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [activationCode, setActivationCode] = React.useState<string>('')
  const [isClosing, setIsClosing] = React.useState(false)

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  // Handle continue with fade-out animation
  const handleContinue = () => {
    setIsClosing(true)
    setTimeout(() => {
      onContinue()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  // Generate activation code when difficulty is set
  useEffect(() => {
    if (difficulty) {
      setActivationCode(generateActivationCode(difficulty))
    }
  }, [difficulty])

  // Close on Escape + focus management
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
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isClosing])

  if ((!isOpen && !isClosing) || !difficulty) return null

  return (
    <div 
      className={`activation-code-overlay ${isClosing ? 'closing' : ''}`} 
      onClick={handleClose} 
      aria-hidden="true"
    >
      <div
        className="activation-code-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="activation-code-header">
          <button
            type="button"
            className="activation-code-close"
            onClick={handleClose}
            aria-label="Close activation code"
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

        <div className="activation-code-content">
          {/* Success icon with green border and shield */}
          <div className="activation-code-icon">
            <div className="activation-code-icon-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z"
                  fill="currentColor"
                />
                <path
                  d="M9 12l2 2 4-4"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Main heading */}
          <h1 id={titleId} className="activation-code-title">
            Activation Ready!
          </h1>

          {/* Subtitle */}
          <p className="activation-code-subtitle">
            Here is your daily challenge code. Good luck!
          </p>

          {/* Activation code panel */}
          <div className="activation-code-panel">
            <div className="activation-code-label">ACTIVATION CODE</div>
            <div className="activation-code-value">{activationCode}</div>
          </div>

          {/* Continue button */}
          <button
            type="button"
            className="activation-code-continue"
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default ActivationCode
