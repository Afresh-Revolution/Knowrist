import React, { useEffect, useId } from 'react'
import { useDialogHover } from '../hooks/useDialogHover'

interface ConfirmDeleteAccountProps {
  isOpen: boolean
  currentBalance: number
  onClose: () => void
  onConfirm: () => void
}

const ConfirmDeleteAccount: React.FC<ConfirmDeleteAccountProps> = ({
  isOpen,
  currentBalance,
  onClose,
  onConfirm,
}) => {
  const titleId = useId()
  const [isClosing, setIsClosing] = React.useState(false)
  const { dialogRef, style: hoverStyle } = useDialogHover()

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400)
  }

  const handleConfirm = () => {
    setIsClosing(true)
    setTimeout(() => {
      onConfirm()
      setIsClosing(false)
    }, 400)
  }

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

  const hasBalance = currentBalance > 0

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
        style={hoverStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-entry-content">
          <div className="confirm-entry-icon">
            <div className="confirm-entry-icon-circle" style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <h1 id={titleId} className="confirm-entry-title">
            Delete Account
          </h1>

          <p className="confirm-entry-subtitle" style={{ textAlign: 'left', marginBottom: '20px' }}>
            This action cannot be undone. Are you sure you want to permanently delete your account?
          </p>

          <div className="confirm-entry-balance-card" style={{ textAlign: 'left', marginBottom: '24px' }}>
            {hasBalance && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                <div style={{ marginBottom: '8px', color: '#f59e0b', fontWeight: 600, fontSize: '14px' }}>
                  💰 Wallet Balance
                </div>
                <p style={{ fontSize: '14px', lineHeight: '1.6', margin: 0, color: 'rgba(255, 255, 255, 0.8)' }}>
                  You have <strong style={{ color: '#fbbf24' }}>₦{currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> remaining in your wallet. 
                  Please withdraw or use all remaining funds before deleting your account, as you will lose access to this money.
                </p>
              </div>
            )}
            
            <div style={{ marginBottom: '12px', color: '#ef4444', fontWeight: 600 }}>
              ⚠️ What You'll Lose
            </div>
            <ul style={{ fontSize: '14px', lineHeight: '1.8', margin: 0, paddingLeft: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <li>All your achievements and progress</li>
              <li>Game history and statistics</li>
              <li>Wallet balance (if not withdrawn)</li>
              <li>Profile data and settings</li>
              <li>Access to any ongoing games</li>
            </ul>
          </div>

          <button 
            type="button" 
            className="confirm-entry-pay-button" 
            onClick={handleConfirm}
            style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }}
          >
            Yes, Delete Account
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button type="button" className="confirm-entry-cancel" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteAccount
