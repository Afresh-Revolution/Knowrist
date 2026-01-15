import React, { createContext, useContext, useState, ReactNode } from 'react'

interface WalletContextType {
  balance: number
  deductBalance: (amount: number) => boolean
  addBalance: (amount: number) => void
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
  initialBalance?: number
}

export const WalletProvider: React.FC<WalletProviderProps> = ({
  children,
  initialBalance = 12450.0,
}) => {
  const [balance, setBalance] = useState<number>(initialBalance)

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

  return (
    <WalletContext.Provider value={{ balance, deductBalance, addBalance }}>
      {children}
    </WalletContext.Provider>
  )
}
