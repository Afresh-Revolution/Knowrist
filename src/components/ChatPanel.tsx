import React, { useState } from 'react'

interface ChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isOpen, onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="chat-panel-overlay" onClick={onClose}></div>
      <div className={`chat-panel ${isOpen ? 'open' : ''} ${isExpanded ? 'expanded' : ''}`}>
        <div className={`chat-panel-window ${isExpanded ? 'expanded' : ''}`}>
          <div className="chat-panel-header">
            <div className="chat-panel-header-left">
              <div className="chat-panel-avatar">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="6" y="6" width="12" height="10" rx="2" fill="currentColor"/>
                  <circle cx="9.5" cy="10.5" r="1" fill="#ffffff"/>
                  <circle cx="14.5" cy="10.5" r="1" fill="#ffffff"/>
                  <path d="M9 14H15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 6V4C6 3.44772 6.44772 3 7 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M18 6V4C18 3.44772 17.5523 3 17 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <div className="chat-panel-status-dot"></div>
              </div>
              <div className="chat-panel-header-info">
                <div className="chat-panel-header-title">Knowrist Support</div>
                <div className="chat-panel-header-subtitle">AI Assistant • Online</div>
              </div>
            </div>
            <div className="chat-panel-header-actions">
              <button 
                className="chat-panel-expand-button"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 5L15 15M15 15H5M15 15V5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
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
                      d="M5 15L15 5M15 5H5M15 5V15"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
              <button className="chat-panel-close-button" onClick={onClose}>
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
          </div>
          <div className="chat-panel-messages">
            <div className="chat-panel-message chat-panel-message-user">
              <div className="chat-panel-message-content">
                <div className="chat-panel-message-bubble">
                  Hello! How can we help you today? You can ask about game rules, payments, or report an issue.
                </div>
                <div className="chat-panel-message-time">00:16</div>
              </div>
              <div className="chat-panel-message-avatar">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="6" y="6" width="12" height="10" rx="2" fill="currentColor"/>
                  <circle cx="9.5" cy="10.5" r="1" fill="#ffffff"/>
                  <circle cx="14.5" cy="10.5" r="1" fill="#ffffff"/>
                  <path d="M9 14H15" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 6V4C6 3.44772 6.44772 3 7 3H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M18 6V4C18 3.44772 17.5523 3 17 3H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="chat-panel-input-container">
            <input
              type="text"
              className="chat-panel-input"
              placeholder="Type your message..."
            />
            <button className="chat-panel-send-button">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ChatPanel
