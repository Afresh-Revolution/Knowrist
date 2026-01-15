import React, { useState, useEffect, useId, useRef } from 'react'
import { gameService } from '../services/gameService'
import { useDialogHover } from '../hooks/useDialogHover'

interface SubmissionCompleteProps {
  isOpen: boolean
  words: Array<{ correct: string; scrambled: string }>
  wordAmounts: number[] // Amount per word (from pool creator)
  activationCode: string // The activation code from payment success
  poolId?: string // Pool ID for verification context
  onClose: () => void
  onEnterArena: () => void
}

/**
 * Submission Complete Screen
 *
 * Displays word scores and requires activation code verification before entering game arena.
 */
const SubmissionComplete: React.FC<SubmissionCompleteProps> = ({
  isOpen,
  words,
  wordAmounts,
  activationCode: _activationCode, // Kept for reference but verified via backend
  poolId,
  onClose,
  onEnterArena,
}) => {
  const titleId = useId()
  const [isClosing, setIsClosing] = React.useState(false)
  const { dialogRef, style: hoverStyle } = useDialogHover()
  const [enteredCode, setEnteredCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isCodeVerified, setIsCodeVerified] = useState(false)
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate total potential value
  const totalValue = wordAmounts.reduce((sum, amount) => sum + amount, 0)

  // Verify activation code with backend
  const verifyCode = async (code: string) => {
    if (!code || !code.trim()) {
      setIsCodeVerified(false)
      return false
    }

    setIsVerifying(true)
    setCodeError('')

    try {
      const response = await gameService.verifyActivationCode(code, poolId)
      
      if (response.valid) {
        setIsCodeVerified(true)
        setCodeError('')
        return true
      } else {
        setIsCodeVerified(false)
        setCodeError(response.message || 'Invalid activation code')
        return false
      }
    } catch (error) {
      console.error('Activation code verification error:', error)
      setIsCodeVerified(false)
      setCodeError(
        error instanceof Error
          ? error.message
          : 'Failed to verify activation code. Please try again.'
      )
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  // Handle code input change with debounced verification
  const handleCodeChange = (value: string) => {
    const upperValue = value.toUpperCase().trim()
    setEnteredCode(upperValue)
    setIsCodeVerified(false) // Reset verification when code changes
    
    if (codeError) {
      setCodeError('')
    }

    // Clear existing timeout
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current)
    }

    // Verify code after user stops typing (debounce)
    if (upperValue.length > 0) {
      verificationTimeoutRef.current = setTimeout(() => {
        verifyCode(upperValue)
      }, 500) // Wait 500ms after user stops typing
    }
  }

  // Handle Enter Game Arena button
  const handleEnterArena = async () => {
    if (!isCodeVerified) {
      // If not verified yet, verify now
      const isValid = await verifyCode(enteredCode)
      if (!isValid) {
        return
      }
    }
    onEnterArena()
  }

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
      setEnteredCode('')
      setCodeError('')
      setIsCodeVerified(false)
      setIsVerifying(false)
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current)
      }
    }, 400)
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current)
      }
    }
  }, [])

  // Close on Escape + focus management
  useEffect(() => {
    if (!isOpen && !isClosing) {
      setIsClosing(false)
      return
    }

    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'Enter' && isCodeVerified && !isVerifying) {
        handleEnterArena()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    dialogRef.current?.focus()
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isClosing, isCodeVerified, isVerifying])

  if (!isOpen && !isClosing) return null

  // Button is only enabled when activation code is verified by backend
  const canEnterArena = isCodeVerified && !isVerifying

  return (
    <div
      className={`submission-complete-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        className="submission-complete-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        style={hoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="submission-complete-content">
          {/* Trophy Icon */}
          <div className="submission-complete-icon">
            <div className="submission-complete-icon-circle">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.5 8.5L22 10L17 14.5L18 21L12 17.5L6 21L7 14.5L2 10L8.5 8.5L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 id={titleId} className="submission-complete-title">
            Submission Complete!
          </h1>

          {/* Subtitle */}
          <p className="submission-complete-subtitle">
            Here's how your words scored based on complexity.
          </p>

          {/* Word List */}
          <div className="submission-complete-words">
            {words.map((word, index) => (
              <div key={index} className="submission-complete-word-item">
                <div className="submission-complete-word-number">
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div className="submission-complete-word-content">
                  <div className="submission-complete-word-correct">{word.correct}</div>
                  <div className="submission-complete-word-scrambled">{word.scrambled}</div>
                </div>
                <div className="submission-complete-word-score">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.5 8.5L22 10L17 14.5L18 21L12 17.5L6 21L7 14.5L2 10L8.5 8.5L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>₦{wordAmounts[index]?.toLocaleString() || 0}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Total Potential Value */}
          <div className="submission-complete-total">
            <span className="submission-complete-total-label">Total Potential Value</span>
            <div className="submission-complete-total-value">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>₦{totalValue.toLocaleString()}</span>
            </div>
          </div>

          {/* Activation Code Section */}
          <div className="submission-complete-code-section">
            <h3 className="submission-complete-code-title">Activation Code Required</h3>
            <div className="submission-complete-code-input-wrapper">
              <input
                type="text"
                className={`submission-complete-code-input ${codeError ? 'error' : ''} ${isCodeVerified ? 'verified' : ''}`}
                placeholder="ENTER CODE"
                value={enteredCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                maxLength={20}
                disabled={isVerifying}
              />
              {isVerifying && (
                <div className="submission-complete-code-verifying">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.416" strokeDashoffset="31.416">
                      <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416;0 31.416" repeatCount="indefinite"/>
                      <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416;-31.416" repeatCount="indefinite"/>
                    </circle>
                  </svg>
                  <span>Verifying...</span>
                </div>
              )}
              {isCodeVerified && !isVerifying && (
                <div className="submission-complete-code-verified">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            {codeError && (
              <span className="submission-complete-code-error">{codeError}</span>
            )}
          </div>

          {/* Enter Game Arena Button - Only enabled when activation code is verified */}
          <button
            type="button"
            className={`submission-complete-enter-button ${!canEnterArena ? 'disabled' : ''}`}
            onClick={handleEnterArena}
            disabled={!canEnterArena || isVerifying}
            aria-disabled={!canEnterArena || isVerifying}
            title={!canEnterArena ? (isVerifying ? 'Verifying activation code...' : 'Please enter and verify the activation code') : 'Enter Game Arena'}
          >
            Enter Game Arena
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22L11 13M22 2L2 2L11 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubmissionComplete
