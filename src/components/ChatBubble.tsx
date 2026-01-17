import React, { useState } from 'react'
import ChatPanel from './ChatPanel'

interface ChatBubbleProps {
  onClick?: () => void
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const handleClick = () => {
    setIsChatOpen(true)
    if (onClick) {
      onClick()
    }
  }

  return (
    <>
      <button
        className="chat-bubble"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        aria-label="Open chat"
      >
        <div className="chat-bubble-icon">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
              fill="currentColor"
            />
          </svg>
        </div>
        {isHovered && <span className="chat-bubble-tooltip">Chat Support</span>}
        <div className="chat-bubble-notification"></div>
      </button>
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

export default ChatBubble
