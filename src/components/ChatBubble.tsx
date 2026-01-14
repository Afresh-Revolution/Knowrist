import React, { useState } from 'react'

const ChatBubble: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="chat-bubble"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
  )
}

export default ChatBubble
