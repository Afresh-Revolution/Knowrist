import React, { useEffect, useId } from 'react'
import { useDialogHover } from '../hooks/useDialogHover'

interface PaymentSuccessProps {
  isOpen: boolean
  isSuccess: boolean
  activationCode?: string
  poolTitle?: string
  onClose: () => void
  onContinue: () => void
}

/**
 * Payment Success/Failure Screen
 *
 * Displays after payment is processed.
 * Shows success with activation code or failure message.
 */
const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  isOpen,
  isSuccess,
  activationCode,
  poolTitle: _poolTitle,
  onClose,
  onContinue,
}) => {
  const titleId = useId()
  const [isClosing, setIsClosing] = React.useState(false)
  const { dialogRef, style: hoverStyle } = useDialogHover()

  // Generate activation code if not provided
  const displayCode = activationCode || `GAME-${Math.random().toString(36).substring(2, 7).toUpperCase()}`

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400)
  }

  // Handle continue with fade-out animation
  const handleContinue = () => {
    setIsClosing(true)
    setTimeout(() => {
      onContinue()
      setIsClosing(false)
    }, 400)
  }

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

  if (!isOpen && !isClosing) return null

  return (
    <div
      className={`payment-success-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        className="payment-success-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        style={hoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="payment-success-content">
          {isSuccess ? (
            <>
              {/* Success icon */}
              <div className="payment-success-icon">
                <div className="payment-success-icon-circle">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 id={titleId} className="payment-success-title">
                Payment Successful!
              </h1>

              {/* Subtitle */}
              <p className="payment-success-subtitle">
                Here is your activation code. You will need this to start the game.
              </p>

              {/* Activation code panel */}
              <div className="payment-success-code-panel">
                <div className="payment-success-code-label">ACTIVATION CODE</div>
                <div className="payment-success-code-value">{displayCode}</div>
              </div>
            </>
          ) : (
            <>
              {/* Failure icon */}
              <div className="payment-success-icon">
                <div className="payment-success-icon-circle payment-success-icon-circle--error">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="currentColor" />
                    <path
                      d="M9 9l6 6M15 9l-6 6"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h1 id={titleId} className="payment-success-title">
                Payment Failed
              </h1>

              {/* Subtitle */}
              <p className="payment-success-subtitle">
                Unable to process your payment. Please check your balance and try again.
              </p>
            </>
          )}

          {/* Continue button */}
          <button
            type="button"
            className="payment-success-continue"
            onClick={isSuccess ? handleContinue : handleClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
