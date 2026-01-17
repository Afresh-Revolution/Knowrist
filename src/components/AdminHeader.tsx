import React from "react";

interface AdminHeaderProps {
  onLogout: () => void;
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onLogout,
  onMenuToggle,
  isSidebarOpen,
}) => {
  return (
    <header className="admin-header">
      <div className="admin-header-container">
        <div className="admin-header-left">
          <button
            className="admin-hamburger-button"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isSidebarOpen ? (
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <path
                  d="M3 12H21M3 6H21M3 18H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </svg>
          </button>
          <div className="admin-logo">
            <span className="admin-logo-text">KNOWRIST ADMIN</span>
          </div>
        </div>
        <div className="admin-header-right">
          <button className="admin-logout-button" onClick={onLogout}>
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
