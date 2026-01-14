import React from 'react'

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  code?: string
  type: 'activation' | 'welcome' | 'other'
}

interface NotificationsPanelProps {
  onClose: () => void
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose }) => {
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Activation Code Ready',
      description: 'Code for Neon Matrix:',
      timestamp: '2 mins ago',
      code: 'GAME-X9Y2',
      type: 'activation',
    },
    {
      id: '2',
      title: 'Welcome to Knowrist',
      description: 'Get ready to challenge your mind!',
      timestamp: '1 hour ago',
      type: 'welcome',
    },
    {
      id: '3',
      title: 'Activation Code Ready',
      description: 'Code for Speed Syntax:',
      timestamp: '3 hours ago',
      code: 'GAME-A7B4',
      type: 'activation',
    },
  ]

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  return (
    <>
      <div className="notifications-overlay" onClick={onClose}></div>
      <div className="notifications-panel">
        <div className="notifications-header">
          <h2 className="notifications-title">Notifications</h2>
          <button className="notifications-close" onClick={onClose} aria-label="Close notifications">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="notifications-content">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-item">
              <div className="notification-header-row">
                <h3 className="notification-title">{notification.title}</h3>
                <span className="notification-timestamp">{notification.timestamp}</span>
              </div>
              <p className="notification-description">{notification.description}</p>
              {notification.code && (
                <div className="notification-code-block">
                  <span className="notification-code">{notification.code}</span>
                  <button
                    className="notification-copy-button"
                    onClick={() => handleCopyCode(notification.code!)}
                    aria-label="Copy code"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.5 3.5H10.5C11.328 3.5 12 4.172 12 5V10C12 10.828 11.328 11.5 10.5 11.5H5.5C4.672 11.5 4 10.828 4 10V5C4 4.172 4.672 3.5 5.5 3.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 1.5V3.5M8 11.5V13.5M3.5 8H1.5M14.5 8H12.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default NotificationsPanel
