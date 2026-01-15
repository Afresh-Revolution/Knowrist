import React, { useEffect, useId, useRef } from 'react'

interface ConfirmEntryProps {
  isOpen: boolean
  poolTitle: string
  entryFee: string
  currentBalance: string
  onClose: () => void
  onConfirm: () => void
}

/**
 * Confirm Entry Modal
 *
 * Displays when user clicks "Join Game" button.
 * Shows entry fee, current balance, remaining balance, and confirmation buttons.
 */
const ConfirmEntry: React.FC<ConfirmEntryProps> = ({
  isOpen,
  poolTitle,
  entryFee,
  currentBalance,
  onClose,
  onConfirm,
}) => {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement | null>(null)
  const [isClosing, setIsClosing] = React.useState(false)

  // Calculate remaining balance
  const entryFeeNum = parseFloat(entryFee.replace(/[₦,]/g, ''))
  const currentBalanceNum = parseFloat(currentBalance.replace(/[₦,]/g, ''))
  const remainingBalance = (currentBalanceNum - entryFeeNum).toFixed(2)

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  // Handle confirm with fade-out animation
  const handleConfirm = () => {
    setIsClosing(true)
    setTimeout(() => {
      onConfirm()
      setIsClosing(false)
    }, 400) // Match animation duration
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
      className={`confirm-entry-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
      aria-hidden="true"
    >
      <div
        className="confirm-entry-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-entry-content">
          {/* Trophy icon */}
          <div className="confirm-entry-icon">
            <div className="confirm-entry-icon-circle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L15.5 8.5L22 10L17 14.5L18 21L12 17.5L6 21L7 14.5L2 10L8.5 8.5L12 2Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 id={titleId} className="confirm-entry-title">
            Confirm Entry
          </h1>

          {/* Subtitle */}
          <p className="confirm-entry-subtitle">
            You are about to join <span className="confirm-entry-pool-name">{poolTitle}</span>
          </p>

          {/* Balance information card */}
          <div className="confirm-entry-balance-card">
            <div className="confirm-entry-balance-row">
              <span className="confirm-entry-balance-label">Entry Fee</span>
              <div className="confirm-entry-balance-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.5 8.5L22 10L17 14.5L18 21L12 17.5L6 21L7 14.5L2 10L8.5 8.5L12 2Z"
                    fill="#fbbf24"
                  />
                </svg>
                <span>{entryFee}</span>
              </div>
            </div>

            <div className="confirm-entry-balance-row">
              <span className="confirm-entry-balance-label">Current Balance</span>
              <div className="confirm-entry-balance-value">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H4V8H20V18Z"
                    fill="currentColor"
                  />
                </svg>
                <span>{currentBalance}</span>
              </div>
            </div>

            <div className="confirm-entry-balance-divider"></div>

            <div className="confirm-entry-balance-row">
              <span className="confirm-entry-balance-label">Remaining</span>
              <span className="confirm-entry-balance-remaining">₦{remainingBalance}</span>
            </div>
          </div>

          {/* Pay & Play button */}
          <button type="button" className="confirm-entry-pay-button" onClick={handleConfirm}>
            Pay & Play
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
          </button>

          {/* Cancel link */}
          <button type="button" className="confirm-entry-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmEntry
