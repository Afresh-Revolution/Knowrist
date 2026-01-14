/**
 * Authentication Form Component
 * 
 * Handles user login and signup with:
 * - Tab switching between Sign In and Sign Up
 * - Form validation
 * - Password visibility toggle
 * - Terms and Conditions acceptance (for signup)
 * - 3D hover effects on the form card
 * - Integration with auth service API
 */

import React, { useState, useRef } from 'react'
import { authService } from '../services/authService'
import knowristLogo from '../images/KNOWRIST-LOGO.png'
import TermsAndConditions from './TermsAndConditions'
import PrivacyPolicy from './PrivacyPolicy'

interface AuthFormProps {
  onClose?: () => void // Callback when authentication is successful
}

const AuthForm: React.FC<AuthFormProps> = ({ onClose }) => {
  // Form state management
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin') // Current active tab
  const [fullname, setFullname] = useState('') // Full name (signup only)
  const [username, setUsername] = useState('') // Username (signup only)
  const [email, setEmail] = useState('') // Email address
  const [password, setPassword] = useState('') // Password
  const [showPassword, setShowPassword] = useState(false) // Password visibility toggle
  const [error, setError] = useState<string | null>(null) // Error message
  const [isLoading, setIsLoading] = useState(false) // Loading state during API calls
  const [isHovering, setIsHovering] = useState(false) // Hover state for 3D effect
  const [acceptedTerms, setAcceptedTerms] = useState(false) // Terms acceptance checkbox
  const [showTerms, setShowTerms] = useState(false) // Terms modal visibility
  const [showPrivacy, setShowPrivacy] = useState(false) // Privacy policy modal visibility
  const formContainerRef = useRef<HTMLDivElement>(null) // Ref for form container (for 3D effects)

  /**
   * Handle form submission
   * Validates form data and calls appropriate auth service method
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Validate signup-specific fields
    if (activeTab === 'signup') {
      if (!fullname.trim()) {
        setError('Full name is required')
        return
      }
      if (!username.trim()) {
        setError('Username is required')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long')
        return
      }
      if (!acceptedTerms) {
        setError('You must accept the Terms and Conditions to sign up')
        return
      }
    }
    
    setIsLoading(true)
    
    try {
      // Call appropriate authentication method based on active tab
      if (activeTab === 'signin') {
        await authService.login({ email, password })
      } else {
        await authService.signup({ fullname, username, email, password })
      }
      
      // Authentication successful - close form and proceed to main app
      if (onClose) onClose()
    } catch (error) {
      // Display error message to user
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Handle mouse movement for 3D skew effect
   * Calculates mouse position relative to form center and applies skew transform
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!formContainerRef.current) return

    const rect = formContainerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate distance from center (normalized to -1 to 1)
    const deltaX = (x - centerX) / centerX
    const deltaY = (y - centerY) / centerY

    // Calculate skew angles (maximum -20 degrees)
    const skewX = deltaY * -20
    const skewY = deltaX * 20

    // Apply skew transform via CSS custom properties
    formContainerRef.current.style.setProperty('--skew-x', `${skewX}deg`)
    formContainerRef.current.style.setProperty('--skew-y', `${skewY}deg`)
  }

  /**
   * Handle mouse enter - enable hover state for 3D effect
   */
  const handleMouseEnter = () => {
    setIsHovering(true)
  }

  /**
   * Handle mouse leave - reset 3D effect to neutral state
   */
  const handleMouseLeave = () => {
    setIsHovering(false)
    if (formContainerRef.current) {
      formContainerRef.current.style.setProperty('--skew-x', '0deg')
      formContainerRef.current.style.setProperty('--skew-y', '0deg')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-header">
        <div className="auth-logo">
          <img src={knowristLogo} alt="Knowrist Logo" />
        </div>
        <h1 className="auth-brand-name">Knowrist</h1>
        <p className="auth-tagline">Master your mind, conquer the pool.</p>
      </div>

      <div
        ref={formContainerRef}
        className={`auth-form-container ${isHovering ? 'is-hovering' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <>
              <div className="auth-form-group">
                <label htmlFor="fullname" className="auth-label">
                  Full Name
                </label>
                <div className="auth-input-wrapper">
                  <svg
                    className="auth-input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 20C0 15.5817 4.47715 12 10 12C15.5228 12 20 15.5817 20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    id="fullname"
                    className="auth-input"
                    placeholder="John Doe"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-form-group">
                <label htmlFor="username" className="auth-label">
                  Username
                </label>
                <div className="auth-input-wrapper">
                  <svg
                    className="auth-input-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M0 20C0 15.5817 4.47715 12 10 12C15.5228 12 20 15.5817 20 20"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    id="username"
                    className="auth-input"
                    placeholder="johndoe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <svg
                className="auth-input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 5.83333L9.0755 10.0504C9.63533 10.3676 10.3647 10.3676 10.9245 10.0504L17.5 5.83333M3.33333 15.8333H16.6667C17.5871 15.8333 18.3333 15.0871 18.3333 14.1667V5.83333C18.3333 4.91286 17.5871 4.16667 16.6667 4.16667H3.33333C2.41286 4.16667 1.66667 4.91286 1.66667 5.83333V14.1667C1.66667 15.0871 2.41286 15.8333 3.33333 15.8333Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="email"
                id="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-form-group">
            <div className="auth-label-row">
              <label htmlFor="password" className="auth-label">
                Password
              </label>
              {activeTab === 'signin' && (
                <a href="#" className="auth-forgot-link">
                  Forgot password?
                </a>
              )}
            </div>
            <div className="auth-input-wrapper">
              <svg
                className="auth-input-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.8333 9.16667V5.83333C15.8333 3.53215 13.9679 1.66667 11.6667 1.66667H8.33333C6.03215 1.66667 4.16667 3.53215 4.16667 5.83333V9.16667M10 14.5833V16.6667M5.83333 9.16667H14.1667C15.0871 9.16667 15.8333 9.91286 15.8333 10.8333V15.8333C15.8333 16.7538 15.0871 17.5 14.1667 17.5H5.83333C4.91286 17.5 4.16667 16.7538 4.16667 15.8333V10.8333C4.16667 9.91286 4.91286 9.16667 5.83333 9.16667Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="auth-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 3.33333C6.66667 3.33333 3.83333 5.41667 1.66667 8.33333C3.83333 11.25 6.66667 13.3333 10 13.3333C13.3333 13.3333 16.1667 11.25 18.3333 8.33333C16.1667 5.41667 13.3333 3.33333 10 3.33333ZM10 11.6667C8.15833 11.6667 6.66667 10.175 6.66667 8.33333C6.66667 6.49167 8.15833 5 10 5C11.8417 5 13.3333 6.49167 13.3333 8.33333C13.3333 10.175 11.8417 11.6667 10 11.6667ZM10 6.66667C9.08333 6.66667 8.33333 7.41667 8.33333 8.33333C8.33333 9.25 9.08333 10 10 10C10.9167 10 11.6667 9.25 11.6667 8.33333C11.6667 7.41667 10.9167 6.66667 10 6.66667Z"
                      fill="currentColor"
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
                      d="M10 3.33333C6.66667 3.33333 3.83333 5.41667 1.66667 8.33333L3.33333 10L6.66667 12.5L10 13.3333L13.3333 12.5L16.6667 10L18.3333 8.33333C16.1667 5.41667 13.3333 3.33333 10 3.33333ZM10 11.6667C8.15833 11.6667 6.66667 10.175 6.66667 8.33333C6.66667 6.49167 8.15833 5 10 5C11.8417 5 13.3333 6.49167 13.3333 8.33333C13.3333 10.175 11.8417 11.6667 10 11.6667Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2.5 2.5L17.5 17.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error-message">
              {error}
            </div>
          )}
          <button type="submit" className="auth-primary-button" disabled={isLoading}>
            {isLoading ? 'Loading...' : activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
            {!isLoading && (
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {activeTab === 'signup' && (
            <div className="auth-terms-checkbox">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="auth-checkbox-input"
                />
                <span className="auth-checkbox-text">
                  I agree to the{' '}
                  <a 
                    href="#" 
                    className="auth-terms-link"
                    onClick={(e) => {
                      e.preventDefault()
                      setShowTerms(true)
                    }}
                  >
                    Terms and Conditions
                  </a>
                </span>
              </label>
            </div>
          )}
        </form>

        <div className="auth-separator">
          <span>OR CONTINUE WITH</span>
        </div>

        <div className="auth-social-buttons">
          <button className="auth-social-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 0C5.374 0 0 5.373 0 12C0 17.302 3.438 21.8 8.207 23.387C8.806 23.498 9.043 23.126 9.043 22.787C9.043 22.479 9.031 21.512 9.025 20.576C5.672 21.302 4.967 19.16 4.967 19.16C4.421 17.773 3.634 17.404 3.634 17.404C2.546 16.659 3.717 16.675 3.717 16.675C4.922 16.759 5.556 17.912 5.556 17.912C6.626 19.746 8.363 19.216 9.048 18.909C9.155 18.134 9.466 17.604 9.81 17.305C7.145 17.001 4.343 15.977 4.343 11.388C4.343 10.07 4.812 8.988 5.579 8.152C5.455 7.85 5.044 6.629 5.696 4.978C5.696 4.978 6.704 4.655 9.004 6.207C9.954 5.941 10.98 5.808 12 5.803C13.02 5.808 14.047 5.941 14.997 6.207C17.295 4.655 18.303 4.978 18.303 4.978C18.956 6.63 18.545 7.851 18.421 8.152C19.191 8.988 19.658 10.07 19.658 11.388C19.658 15.988 16.849 16.998 14.177 17.295C14.607 17.667 15.001 18.398 15.001 19.513C15.001 21.116 14.988 22.419 14.988 22.787C14.988 23.129 15.22 23.504 15.826 23.386C20.566 21.797 24 17.3 24 12C24 5.373 18.627 0 12 0Z"
                fill="currentColor"
              />
            </svg>
            <span>Github</span>
          </button>
          <button className="auth-social-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.51H17.93C17.68 15.99 16.78 17.24 15.46 18.09V21.09H19.28C21.36 19.13 22.56 16.38 22.56 12.25Z"
                fill="#4285F4"
              />
              <path
                d="M12 23C15.24 23 17.95 21.99 19.28 21.09L15.46 18.09C14.35 18.81 12.9 19.25 12 19.25C8.87 19.25 6.22 17.14 5.27 14.29H1.28V17.38C2.6 20.03 5.38 23 12 23Z"
                fill="#34A853"
              />
              <path
                d="M5.27 14.29C5.02 13.57 4.88 12.8 4.88 12C4.88 11.2 5.03 10.43 5.27 9.71V6.62H1.28C0.46 8.24 0 10.06 0 12C0 13.94 0.46 15.76 1.28 17.38L5.27 14.29Z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.75C13.77 4.75 15.35 5.36 16.6 6.55L19.34 3.81C17.95 2.54 15.24 1 12 1C5.38 1 2.6 3.97 1.28 6.62L5.27 9.71C6.22 6.86 8.87 4.75 12 4.75Z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>
        </div>
      </div>

      <div className="auth-footer">
        <p className="auth-footer-text">
          By continuing, you agree to our{' '}
          <a 
            href="#" 
            className="auth-footer-link"
            onClick={(e) => {
              e.preventDefault()
              setShowTerms(true)
            }}
          >
            Terms of Service
          </a>{' '}
          and{' '}
          <a 
            href="#" 
            className="auth-footer-link"
            onClick={(e) => {
              e.preventDefault()
              setShowPrivacy(true)
            }}
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
      {showTerms && (
        <TermsAndConditions onClose={() => setShowTerms(false)} />
      )}
      {showPrivacy && (
        <PrivacyPolicy onClose={() => setShowPrivacy(false)} />
      )}
    </div>
  )
}

export default AuthForm
