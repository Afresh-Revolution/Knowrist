import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  code?: string
  type: 'activation' | 'welcome' | 'pool-full' | 'other'
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: 'Just now',
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
