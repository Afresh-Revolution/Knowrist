import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { useWallet } from "../contexts/WalletContext";
import ConfirmLogout from "./ConfirmLogout";
import ConfirmDeleteAccount from "./ConfirmDeleteAccount";
import { authService } from "../services/authService";

interface ProfileScreenProps {
  onClose: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onClose }) => {
  const { user, setUser } = useUser();
  const { balance, isLoading: isBalanceLoading } = useWallet();
  const displayName = user?.name || user?.username || "User";
  const avatarSeed = user?.username || user?.name || "User";
  
  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Confirmation dialog states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load profile picture from localStorage when user changes
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`profile_picture_${user.id}`);
      setProfilePicture(stored || null);
    } else {
      setProfilePicture(null);
    }
  }, [user?.id]);

  const handleEditPicture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Read file as data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfilePicture(result);
        // Save to localStorage
        if (user?.id) {
          localStorage.setItem(`profile_picture_${user.id}`, result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    // Clear all user data
    setUser(null);
    localStorage.removeItem('knowrist_user');
    localStorage.removeItem('knowrist_token');
    
    // Clear any admin data as well
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_role');
    
    // Clear profile picture
    if (user?.id) {
      localStorage.removeItem(`profile_picture_${user.id}`);
    }
    
    onClose();
    
    // Navigate to root and reload to show login form
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteAccountConfirm = async () => {
    try {
      const token = localStorage.getItem('knowrist_token') || undefined;
      
      // Call API to delete account from database
      await authService.deleteAccount(token);
      
      // Clear all user data
      setUser(null);
      localStorage.removeItem('knowrist_user');
      localStorage.removeItem('knowrist_token');
      if (user?.id) {
        localStorage.removeItem(`profile_picture_${user.id}`);
      }
      onClose();
      // Reload page to reset app state
      window.location.reload();
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete account. Please try again.');
    }
  };

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
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <button 
              className="profile-settings-button" 
              onClick={handleEditPicture}
              type="button"
              aria-label="Edit display picture"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <div className="profile-avatar-large">
              <img
                src={profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                alt={displayName}
              />
              <div className="profile-status-large"></div>
            </div>
            <h2 className="profile-name">{displayName}</h2>
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
            <div className="profile-account-actions">
              <button 
                className="profile-account-button profile-account-button-logout"
                onClick={handleLogout}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Logout
              </button>
              <button 
                className="profile-account-button profile-account-button-delete"
                onClick={handleDeleteAccount}
                type="button"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Delete Account
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
                <span className="wallet-amount">
                  {isBalanceLoading ? (
                    'Loading...'
                  ) : (
                    `₦${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  )}
                </span>
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
      
      {/* Logout Confirmation Dialog */}
      <ConfirmLogout
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />
      
      {/* Delete Account Confirmation Dialog */}
      <ConfirmDeleteAccount
        isOpen={showDeleteConfirm}
        currentBalance={balance}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccountConfirm}
      />
    </div>
  );
};

export default ProfileScreen;
