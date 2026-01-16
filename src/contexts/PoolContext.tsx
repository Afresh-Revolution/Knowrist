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
  // Metadata for display
  category?: 'Logic' | 'Word' | 'SCIENCE' | 'MATHS' | 'ENGLISH' | 'LITERATURE' | 'HISTORY'
  difficulty?: 'easy' | 'medium' | 'hard' | 'EASY' | 'MEDIUM' | 'HARD'
  // Store original schema category for proper display
  schemaCategory?: 'SCIENCE' | 'MATHS' | 'ENGLISH' | 'LITERATURE' | 'HISTORY'
  type?: 'Daily' | 'Paid'
  currency?: string
  image?: string
  timeUntilStart?: number
  timeUntilEnd?: number
  // New schema fields
  wordLength?: number
  rewardPerQuestion?: number
  questionsPerUser?: number
  scheduledStart?: string // ISO datetime string
  durationMinutes?: number
}

interface PoolContextType {
  pools: Pool[]
  joinPool: (poolId: string, entryFee: number) => boolean
  updatePool: (poolId: string, updates: Partial<Pool>) => void
  getPool: (poolId: string) => Pool | undefined
  createPool: (poolData: CreatePoolData) => void
}

export interface CreatePoolData {
  title: string
  type: 'Daily' | 'Paid'
  category: 'Logic' | 'Word' | 'SCIENCE' | 'MATHS' | 'ENGLISH' | 'LITERATURE' | 'HISTORY'
  difficulty: 'easy' | 'medium' | 'hard'
  entryFee: string
  currency: string
  maxPlayers: number
  status: 'active' | 'pending' | 'ended'
  image?: string
  timeUntilStart?: number
  timeUntilEnd?: number
  // New schema fields
  wordLength?: number
  rewardPerQuestion?: number
  questionsPerUser?: number
  scheduledStart?: string
  durationMinutes?: number
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
      category: 'Logic',
      difficulty: 'hard',
      type: 'Paid',
      currency: '₦',
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
      category: 'Word',
      difficulty: 'medium',
      type: 'Paid',
      currency: '₦',
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
      category: 'Logic',
      difficulty: 'easy',
      type: 'Paid',
      currency: '₦',
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
      category: 'Word',
      difficulty: 'hard',
      type: 'Paid',
      currency: '₦',
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

  const createPool = useCallback((poolData: CreatePoolData) => {
    // Parse entry fee - remove currency symbols and commas
    const entryFeeNum = poolData.type === 'Daily' 
      ? 0 
      : parseFloat(poolData.entryFee.replace(/[₦₩$,]/g, '')) || 0

    // Convert admin status to user pool status
    let userStatus: Pool['status'] = 'available'
    if (poolData.status === 'active') {
      userStatus = 'available'
    } else if (poolData.status === 'pending') {
      userStatus = 'available' // Will show as available but with countdown
    } else if (poolData.status === 'ended') {
      userStatus = 'ended'
    }

    // Generate pool ID from title
    const poolId = poolData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const newPool: Pool = {
      id: poolId,
      title: poolData.title,
      currentPlayers: 0,
      maxPlayers: poolData.maxPlayers,
      totalAmountPaid: 0,
      entryFee: entryFeeNum,
      isFull: false,
      countdownSeconds: poolData.timeUntilStart && poolData.timeUntilStart > 0 
        ? poolData.timeUntilStart 
        : null,
      status: userStatus,
      category: poolData.category,
      difficulty: poolData.difficulty,
      type: poolData.type,
      currency: poolData.currency,
      image: poolData.image,
      timeUntilStart: poolData.timeUntilStart,
      timeUntilEnd: poolData.timeUntilEnd,
      wordLength: poolData.wordLength,
      rewardPerQuestion: poolData.rewardPerQuestion,
      questionsPerUser: poolData.questionsPerUser,
      scheduledStart: poolData.scheduledStart,
      durationMinutes: poolData.durationMinutes,
    }

    setPools((prev) => [...prev, newPool])
  }, [])

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
    <PoolContext.Provider value={{ pools, joinPool, updatePool, getPool, createPool }}>
      {children}
    </PoolContext.Provider>
  )
}
