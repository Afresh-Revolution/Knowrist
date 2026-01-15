import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'

export interface Pool {
  id: string
  title: string
  currentPlayers: number
  maxPlayers: number
  totalAmountPaid: number
  entryFee: number
  isFull: boolean
  countdownSeconds: number | null
  status: 'available' | 'full' | 'starting' | 'playing' | 'ended'
}

interface PoolContextType {
  pools: Pool[]
  joinPool: (poolId: string, entryFee: number) => boolean
  updatePool: (poolId: string, updates: Partial<Pool>) => void
  getPool: (poolId: string) => Pool | undefined
}

const PoolContext = createContext<PoolContextType | undefined>(undefined)

export const usePools = () => {
  const context = useContext(PoolContext)
  if (!context) {
    throw new Error('usePools must be used within PoolProvider')
  }
  return context
}

interface PoolProviderProps {
  children: ReactNode
}

export const PoolProvider: React.FC<PoolProviderProps> = ({ children }) => {
  const [pools, setPools] = useState<Pool[]>([
    {
      id: 'neon-matrix',
      title: 'Neon Matrix',
      currentPlayers: 1240,
      maxPlayers: 2000,
      totalAmountPaid: 62000,
      entryFee: 50,
      isFull: false,
      countdownSeconds: null,
      status: 'available',
    },
    {
      id: 'speed-syntax',
      title: 'Speed Syntax',
      currentPlayers: 856,
      maxPlayers: 1000,
      totalAmountPaid: 21400,
      entryFee: 25,
      isFull: false,
      countdownSeconds: null,
      status: 'playing',
    },
    {
      id: 'memory-core',
      title: 'Memory Core',
      currentPlayers: 523,
      maxPlayers: 800,
      totalAmountPaid: 7845,
      entryFee: 15,
      isFull: false,
      countdownSeconds: null,
      status: 'available',
    },
    {
      id: 'quantum-leap',
      title: 'Quantum Leap',
      currentPlayers: 1892,
      maxPlayers: 2000,
      totalAmountPaid: 141900,
      entryFee: 75,
      isFull: false,
      countdownSeconds: null,
      status: 'available',
    },
  ])

  const joinPool = useCallback((poolId: string, entryFee: number): boolean => {
    setPools((prev) =>
      prev.map((pool) => {
        if (pool.id === poolId && !pool.isFull && pool.status === 'available') {
          const newCurrentPlayers = pool.currentPlayers + 1
          const isFull = newCurrentPlayers >= pool.maxPlayers
          return {
            ...pool,
            currentPlayers: newCurrentPlayers,
            totalAmountPaid: pool.totalAmountPaid + entryFee,
            isFull,
            status: isFull ? 'full' : pool.status,
            countdownSeconds: isFull ? 300 : null, // 5 minutes = 300 seconds
          }
        }
        return pool
      })
    )
    return true
  }, [])

  const updatePool = useCallback((poolId: string, updates: Partial<Pool>) => {
    setPools((prev) =>
      prev.map((pool) => (pool.id === poolId ? { ...pool, ...updates } : pool))
    )
  }, [])

  const getPool = useCallback(
    (poolId: string) => pools.find((p) => p.id === poolId),
    [pools]
  )

  // Countdown timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPools((prev) =>
        prev.map((pool) => {
          if (pool.countdownSeconds !== null && pool.countdownSeconds > 0) {
            const newSeconds = pool.countdownSeconds - 1
            if (newSeconds === 0) {
              // Countdown finished, start the game
              return {
                ...pool,
                countdownSeconds: null,
                status: 'playing',
              }
            }
            return {
              ...pool,
              countdownSeconds: newSeconds,
            }
          }
          return pool
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <PoolContext.Provider value={{ pools, joinPool, updatePool, getPool }}>
      {children}
    </PoolContext.Provider>
  )
}
