import React from 'react'
import { useDialogHover } from '../hooks/useDialogHover'

interface TermsAndConditionsProps {
  onClose: () => void
}

const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({ onClose }) => {
  const [isClosing, setIsClosing] = React.useState(false)
  const { dialogRef, style: hoverStyle } = useDialogHover()

  // Handle close with fade-out animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose()
      setIsClosing(false)
    }, 400) // Match animation duration
  }

  return (
    <div className={`terms-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="terms-modal" ref={dialogRef} style={hoverStyle} onClick={(e) => e.stopPropagation()}>
        <div className="terms-header">
          <h1 className="terms-title">Terms and Conditions</h1>
          <button className="terms-close-button" onClick={handleClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="terms-content">
          <p className="terms-last-updated">Last updated: {new Date().toLocaleDateString()}</p>
          
          <section className="terms-section">
            <h2 className="terms-section-title">1. Acceptance of Terms</h2>
            <p className="terms-text">
              By accessing and using Knowrist, you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">2. Use License</h2>
            <p className="terms-text">
              Permission is granted to temporarily use Knowrist for personal, non-commercial transitory viewing only. 
              This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="terms-list">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on Knowrist</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">3. User Account</h2>
            <p className="terms-text">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">4. Game Rules and Fair Play</h2>
            <p className="terms-text">
              All users must play fairly and in accordance with the rules of each game. Cheating, exploiting bugs, or using 
              unauthorized third-party software is strictly prohibited and may result in immediate account termination.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">5. Payment and Refunds</h2>
            <p className="terms-text">
              Entry fees for game pools are non-refundable once a game has started. Refunds may be considered on a case-by-case 
              basis for technical issues that prevent game participation, subject to our review.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">6. Intellectual Property</h2>
            <p className="terms-text">
              The Service and its original content, features, and functionality are and will remain the exclusive property of 
              Knowrist and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">7. Limitation of Liability</h2>
            <p className="terms-text">
              In no event shall Knowrist, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable 
              for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of 
              profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">8. Termination</h2>
            <p className="terms-text">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or 
              liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">9. Changes to Terms</h2>
            <p className="terms-text">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
              material, we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">10. Contact Information</h2>
            <p className="terms-text">
              If you have any questions about these Terms and Conditions, please contact us at support@knowrist.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
