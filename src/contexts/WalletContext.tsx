import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { walletService } from '../services/walletService'
import { useUser } from './UserContext'

interface WalletContextType {
  balance: number
  isLoading: boolean
  deductBalance: (amount: number) => boolean
  addBalance: (amount: number) => void
  refreshBalance: () => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
}) => {
  const { user } = useUser()
  const [balance, setBalance] = useState<number>(1000000) // Default to 1 million naira
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch wallet balance from API
  const fetchBalance = useCallback(async () => {
    setIsLoading(true)
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('knowrist_token') || undefined
      const walletBalance = await walletService.getBalance(token)
      setBalance(walletBalance)
    } catch (error) {
      console.error('Error fetching wallet balance:', error)
      // Keep the default demo amount on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch balance when user is available
  useEffect(() => {
    if (user) {
      fetchBalance()
    } else {
      // If no user, use demo amount
      setBalance(1000000)
      setIsLoading(false)
    }
  }, [user, fetchBalance])

  const deductBalance = (amount: number): boolean => {
    if (balance >= amount) {
      setBalance((prev) => prev - amount)
      return true
    }
    return false
  }

  const addBalance = (amount: number) => {
    setBalance((prev) => prev + amount)
  }

  const refreshBalance = async () => {
    await fetchBalance()
  }

  return (
    <WalletContext.Provider value={{ balance, isLoading, deductBalance, addBalance, refreshBalance }}>
      {children}
    </WalletContext.Provider>
  )
}
