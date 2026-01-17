import React from 'react'

type AdminRole = 'main' | 'super'
type AdminPage = 'pools' | 'wallet' | 'transactions' | 'live-game' | 'system-override' | 'chat'

interface AdminSidebarProps {
  adminRole: AdminRole
  currentPage: AdminPage
  onPageChange: (page: AdminPage) => void
  isOpen: boolean
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  adminRole,
  currentPage,
  onPageChange,
  isOpen,
}) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="admin-sidebar-content">
        <div className="admin-sidebar-section">
          <h3 className="admin-sidebar-section-title">MANAGEMENT</h3>
          <nav className="admin-sidebar-nav">
            <button
              className={`admin-sidebar-item ${currentPage === 'pools' ? 'active' : ''}`}
              onClick={() => onPageChange('pools')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="admin-sidebar-icon"
              >
                <path
                  d="M3 3H8V8H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3H17V8H12V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12H8V17H3V12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 12H17V17H12V12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Pools Management</span>
            </button>
            <button
              className={`admin-sidebar-item ${currentPage === 'wallet' ? 'active' : ''}`}
              onClick={() => onPageChange('wallet')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="admin-sidebar-icon"
              >
                <path
                  d="M2 4H18C18.5523 4 19 4.44772 19 5V15C19 15.5523 18.5523 16 18 16H2C1.44772 16 1 15.5523 1 15V5C1 4.44772 1.44772 4 2 4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 7H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Wallet & Finance</span>
            </button>
            <button
              className={`admin-sidebar-item ${currentPage === 'transactions' ? 'active' : ''}`}
              onClick={() => onPageChange('transactions')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="admin-sidebar-icon"
              >
                <circle
                  cx="10"
                  cy="10"
                  r="8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 6V10L13 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Transactions Log</span>
            </button>
            <button
              className={`admin-sidebar-item ${currentPage === 'chat' ? 'active' : ''}`}
              onClick={() => onPageChange('chat')}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="admin-sidebar-icon"
              >
                <path
                  d="M17 2H3C1.89543 2 1 2.89543 1 4V18L5 14H17C18.1046 14 19 13.1046 19 12V4C19 2.89543 18.1046 2 17 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Chat Support</span>
            </button>
          </nav>
        </div>
        {adminRole === 'super' && (
          <div className="admin-sidebar-section">
            <h3 className="admin-sidebar-section-title super-admin">SUPER ADMIN</h3>
            <nav className="admin-sidebar-nav">
              <button
                className={`admin-sidebar-item ${currentPage === 'live-game' ? 'active' : ''}`}
                onClick={() => onPageChange('live-game')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="admin-sidebar-icon"
                >
                  <path
                    d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14C12.2091 14 14 12.2091 14 10C14 7.79086 12.2091 6 10 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="1.5"
                    fill="currentColor"
                  />
                </svg>
                <span>Live Game Monitor</span>
              </button>
              <button
                className={`admin-sidebar-item ${currentPage === 'system-override' ? 'active' : ''}`}
                onClick={() => onPageChange('system-override')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="admin-sidebar-icon"
                >
                  <path
                    d="M10 2L11.5 6.5L16 8L11.5 9.5L10 14L8.5 9.5L4 8L8.5 6.5L10 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="10"
                    cy="10"
                    r="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>System Override</span>
              </button>
            </nav>
          </div>
        )}
      </div>
    </aside>
  )
}

export default AdminSidebar
