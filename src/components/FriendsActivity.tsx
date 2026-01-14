import React from 'react'

interface FriendActivity {
  username: string
  activity: string
}

const FriendsActivity: React.FC = () => {
  const activities: FriendActivity[] = [
    {
      username: 'User_100',
      activity: 'Just won a match in Logic.',
    },
    {
      username: 'User_101',
      activity: 'Just won a match in Logic.',
    },
  ]

  return (
    <div className="friends-activity-card">
      <h3 className="friends-activity-title">Friends Activity</h3>
      <div className="friends-activity-list">
        {activities.map((activity, index) => (
          <div key={index} className="friends-activity-item">
            <div className="friend-avatar">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="20" cy="20" r="20" fill="#4b5563" />
                <path
                  d="M20 10C16.134 10 13 13.134 13 17C13 20.866 16.134 24 20 24C23.866 24 27 20.866 27 17C27 13.134 23.866 10 20 10ZM20 26C15.029 26 8 27.567 8 32.5V35H32V32.5C32 27.567 24.971 26 20 26Z"
                  fill="#9ca3af"
                />
              </svg>
            </div>
            <div className="friend-activity-text">
              <span className="friend-username">{activity.username}</span>{' '}
              {activity.activity}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FriendsActivity
