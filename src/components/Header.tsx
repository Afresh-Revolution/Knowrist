import React, { useState } from 'react'
import NotificationsPanel from './NotificationsPanel'
import knowristLogo from '../images/KNOWRIST-LOGO.png'
import { useWallet } from '../contexts/WalletContext'

type Page = 'dashboard' | 'leaderboard'

interface HeaderProps {
  onProfileClick: () => void
  isProfileOpen?: boolean
  currentPage?: Page
  onPageChange?: (page: Page) => void
  onDailyChallengeClick?: () => void
}

const Header: React.FC<HeaderProps> = ({
  onProfileClick,
  isProfileOpen = false,
  currentPage = 'dashboard',
  onPageChange,
  onDailyChallengeClick,
}) => {
  const { balance } = useWallet()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, page: Page) => {
    e.preventDefault()
    if (onPageChange) {
      onPageChange(page)
    }
    closeMenu()
  }

  return (
    <>
      {isMenuOpen && (
        <div 
          className="menu-overlay"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo">
              <img src={knowristLogo} alt="Knowrist Logo" className="logo-icon" />
              <span className="logo-text">Knowrist</span>
            </div>
          </div>
          <nav className="nav desktop-nav">
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'dashboard')}
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className={`nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'leaderboard')}
            >
              Leaderboard
            </a>
          </nav>
          <div className="header-right">
            <button 
              className={`menu-toggle-button ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="menu-icon">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
            <div className="desktop-menu-items">
              <button 
                className="icon-button notification-button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Notifications"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2C8.343 2 7 3.343 7 5V8.586L4.293 11.293C4.105 11.481 4 11.735 4 12V14C4 14.552 4.448 15 5 15H15C15.552 15 16 14.552 16 14V12C16 11.735 15.895 11.481 15.707 11.293L13 8.586V5C13 3.343 11.657 2 10 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M10 17C9.448 17 9 16.552 9 16H11C11 16.552 10.552 17 10 17Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="currency-display">
                <svg
                  className="trophy-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 2H15V4H13V6H15C16.105 6 17 6.895 17 8V10C17 12.209 15.209 14 13 14H12V16H15V18H5V16H8V14H7C4.791 14 3 12.209 3 10V8C3 6.895 3.895 6 5 6H7V4H5V2Z"
                    fill="#fbbf24"
                  />
                </svg>
                <span className="currency-amount">₦{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <button
                className="daily-challenge-button"
                onClick={onDailyChallengeClick}
                type="button"
              >
                <svg
                  className="lightning-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.5 1L3 9.5H8.5L6.5 15L13 6.5H7.5L9.5 1Z"
                    fill="currentColor"
                  />
                </svg>
                <span>Daily Challenge</span>
              </button>
              <button
                className="profile-button"
                onClick={onProfileClick}
                aria-label={isProfileOpen ? "Close profile" : "User profile"}
              >
                {isProfileOpen ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="close-icon"
                  >
                    <path
                      d="M18 6L6 18M6 6L18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <div className="profile-avatar">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oliem"
                      alt="Oliem"
                    />
                    <div className="profile-status"></div>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className={`slide-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="slide-menu-content">
          <button 
            className="slide-menu-close"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <nav className="mobile-nav">
            <a 
              href="#" 
              className={`mobile-nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'dashboard')}
            >
              Dashboard
            </a>
            <a 
              href="#" 
              className={`mobile-nav-link ${currentPage === 'leaderboard' ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, 'leaderboard')}
            >
              Leaderboard
            </a>
          </nav>
          <div className="mobile-menu-items">
            <button 
              className="mobile-menu-item notification-button" 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen)
                closeMenu()
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 2C8.343 2 7 3.343 7 5V8.586L4.293 11.293C4.105 11.481 4 11.735 4 12V14C4 14.552 4.448 15 5 15H15C15.552 15 16 14.552 16 14V12C16 11.735 15.895 11.481 15.707 11.293L13 8.586V5C13 3.343 11.657 2 10 2Z"
                  fill="currentColor"
                />
                <path
                  d="M10 17C9.448 17 9 16.552 9 16H11C11 16.552 10.552 17 10 17Z"
                  fill="currentColor"
                />
              </svg>
              <span>Notifications</span>
            </button>
            <div className="mobile-menu-item currency-display" onClick={closeMenu}>
              <svg
                className="trophy-icon"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 2H15V4H13V6H15C16.105 6 17 6.895 17 8V10C17 12.209 15.209 14 13 14H12V16H15V18H5V16H8V14H7C4.791 14 3 12.209 3 10V8C3 6.895 3.895 6 5 6H7V4H5V2Z"
                  fill="#fbbf24"
                />
              </svg>
              <span className="currency-amount">₦{balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <button
              type="button"
              className="mobile-menu-item daily-challenge-button"
              onClick={() => {
                onDailyChallengeClick?.()
                closeMenu()
              }}
            >
              <svg
                className="lightning-icon"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.5 1L3 9.5H8.5L6.5 15L13 6.5H7.5L9.5 1Z"
                  fill="currentColor"
                />
              </svg>
              <span>Daily Challenge</span>
            </button>
            <button
              className="mobile-menu-item profile-button"
              onClick={() => {
                onProfileClick()
                closeMenu()
              }}
              aria-label={isProfileOpen ? "Close profile" : "User profile"}
            >
              {isProfileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="close-icon"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <div className="profile-avatar">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oliem"
                    alt="Oliem"
                  />
                  <div className="profile-status"></div>
                </div>
              )}
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
      {isNotificationsOpen && (
        <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
      )}
    </>
  )
}

export default Header
