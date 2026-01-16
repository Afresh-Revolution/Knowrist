import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface User {
  id: string
  name: string
  username: string
  email: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  updateUser: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // Try to load user from localStorage on mount
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('knowrist_user')
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading user from localStorage:', error)
    }
    return null
  })

  const setUser = (newUser: User | null) => {
    setUserState(newUser)
    if (newUser) {
      localStorage.setItem('knowrist_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('knowrist_user')
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
    }
  }

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}
