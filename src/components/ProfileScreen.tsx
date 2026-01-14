import React from "react";

interface ProfileScreenProps {
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onClose }) => {
  return (
    <div className="profile-screen">
      <button className="profile-close" onClick={onClose} aria-label="Close">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-card">
            <button className="profile-settings-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 12C11.105 12 12 11.105 12 10C12 8.895 11.105 8 10 8C8.895 8 8 8.895 8 10C8 11.105 8.895 12 10 12Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 2L12.5 7.5L18.5 8.5L14.5 12.5L15.5 18.5L10 15.5L4.5 18.5L5.5 12.5L1.5 8.5L7.5 7.5L10 2ZM10 4.5L8.5 8.5L4.5 9.5L7.5 12.5L6.5 16.5L10 14.5L13.5 16.5L12.5 12.5L15.5 9.5L11.5 8.5L10 4.5Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="profile-avatar-large">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oliem"
                alt="Oliem"
              />
              <div className="profile-status-large"></div>
            </div>
            <h2 className="profile-name">Oliem</h2>
            <div className="profile-rank">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2L12 7H17L13 10L15 15L10 12L5 15L7 10L3 7H8L10 2Z"
                  fill="#fbbf24"
                />
              </svg>
              <span>Grandmaster II</span>
            </div>
            <div className="profile-progress">
              <div className="profile-progress-header">
                <span className="profile-level">Lvl 42</span>
                <span className="profile-xp">750 / 1000 XP</span>
              </div>
              <div className="profile-progress-bar">
                <div
                  className="profile-progress-fill"
                  ref={(el) => {
                    if (el) {
                      el.style.setProperty('--progress-width', '75%')
                    }
                  }}
                ></div>
              </div>
            </div>
            <div className="profile-actions">
              <button className="profile-action-button profile-action-active">
                STATUS: Active
              </button>
              <button className="profile-action-button profile-action-joined">
                JOINED: Oct 2023
              </button>
            </div>
          </div>
        </div>
        <div className="profile-main">
          <div className="wallet-card">
            <div className="wallet-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 4H3C1.895 4 1 4.895 1 6V18C1 19.105 1.895 20 3 20H21C22.105 20 23 19.105 23 18V6C23 4.895 22.105 4 21 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path d="M1 10H23" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h3>WALLET BALANCE</h3>
            </div>
            <div className="wallet-content-row">
              <div className="wallet-balance">
                <span className="wallet-amount">₦12,450.00</span>
                <p className="wallet-subtitle">Available for withdrawal</p>
              </div>
              <div className="wallet-actions">
                <button className="wallet-button wallet-button-fund">
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M10 12L6 8L10 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Fund Wallet
                </button>
                <button className="wallet-button wallet-button-withdraw">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M12 4L15 1M15 1L12 4M15 1H11V5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Withdraw
                </button>
              </div>
            </div>
          </div>
          <div className="profile-stats-grid">
            <div className="profile-stat-card">
              <div className="profile-stat-icon profile-stat-purple">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="profile-stat-value">842k</div>
              <div className="profile-stat-label">Total Score</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon profile-stat-blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 12H7L9 8L15 16L17 12H21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="profile-stat-value">1,240</div>
              <div className="profile-stat-label">Games Played</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon profile-stat-gold">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="profile-stat-value">68%</div>
              <div className="profile-stat-label">Win Rate</div>
            </div>
            <div className="profile-stat-card">
              <div className="profile-stat-icon profile-stat-green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="profile-stat-value">142h</div>
              <div className="profile-stat-label">Time Played</div>
            </div>
          </div>
        </div>
        <div className="transaction-history-card">
          <h3 className="transaction-history-title">Transaction History</h3>
          <div className="transaction-list">
            <div className="transaction-item">
              <div className="transaction-icon transaction-icon-credit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 15L5 10L6.41 8.59L10 12.17L13.59 8.59L15 10L10 15Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="transaction-details">
                <div className="transaction-type">Game Reward</div>
                <div className="transaction-description">
                  Won Neon Matrix Challenge
                </div>
              </div>
              <div className="transaction-amount-wrapper">
                <div className="transaction-amount transaction-amount-credit">
                  +₦450
                </div>
                <div className="transaction-time">2 hours ago</div>
              </div>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon transaction-icon-debit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 5L15 10L13.59 11.41L10 7.83L6.41 11.41L5 10L10 5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="transaction-details">
                <div className="transaction-type">Entry Fee</div>
                <div className="transaction-description">
                  Joined Speed Syntax Pool
                </div>
              </div>
              <div className="transaction-amount-wrapper">
                <div className="transaction-amount transaction-amount-debit">
                  -₦50
                </div>
                <div className="transaction-time">5 hours ago</div>
              </div>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon transaction-icon-credit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 15L5 10L6.41 8.59L10 12.17L13.59 8.59L15 10L10 15Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="transaction-details">
                <div className="transaction-type">Top Up</div>
                <div className="transaction-description">Wallet Deposit</div>
              </div>
              <div className="transaction-amount-wrapper">
                <div className="transaction-amount transaction-amount-credit">
                  +₦2,000
                </div>
                <div className="transaction-time">1 day ago</div>
              </div>
            </div>
            <div className="transaction-item">
              <div className="transaction-icon transaction-icon-debit">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 5L15 10L13.59 11.41L10 7.83L6.41 11.41L5 10L10 5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="transaction-details">
                <div className="transaction-type">Withdrawal</div>
                <div className="transaction-description">Transfer to Bank</div>
              </div>
              <div className="transaction-amount-wrapper">
                <div className="transaction-amount transaction-amount-debit">
                  -₦1,000
                </div>
                <div className="transaction-time">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
