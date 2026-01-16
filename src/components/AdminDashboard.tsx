import React, { useState, useEffect } from 'react'
import PoolCard from './PoolCard'
import CreatePoolModal, { type PoolFormData } from './CreatePoolModal'
import { usePools } from '../contexts/PoolContext'
import { poolService, type AdminPool } from '../services/poolService'

type AdminRole = 'main' | 'super'
type AdminPage = 'pools' | 'wallet' | 'transactions' | 'live-game' | 'system-override'

interface AdminDashboardProps {
  adminRole: AdminRole
  currentPage: AdminPage
}

interface Pool {
  id: string
  title: string
  type: 'Daily' | 'Paid'
  entryFee: string
  currency: string
  activePlayers: number
  currentPot: string
  status: 'active' | 'pending' | 'ended'
  timeUntilStart?: number // seconds until game starts (for pending)
  timeUntilEnd?: number // seconds until game ends (for active)
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminRole,
  currentPage,
}) => {
  const { createPool } = usePools()
  const [pools, setPools] = useState<Pool[]>([])
  const [isLoadingPools, setIsLoadingPools] = useState(true)
  const [poolsError, setPoolsError] = useState<string | null>(null)

  // Fetch pools from API on mount and when currentPage changes to 'pools'
  useEffect(() => {
    if (currentPage === 'pools') {
      fetchAdminPools()
    }
  }, [currentPage])

  const fetchAdminPools = async () => {
    try {
      setIsLoadingPools(true)
      setPoolsError(null)

      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin_token')
      if (!adminToken) {
        throw new Error('Admin token not found. Please login again.')
      }

      // Fetch pools from API
      const adminPoolsData = await poolService.getAdminPools(adminToken)
      
      // Convert backend pool data to admin pool display format
      const now = new Date()
      const convertedPools: Pool[] = adminPoolsData.map((pool: AdminPool) => {
        // Calculate time until start/end
        const scheduledStart = new Date(pool.scheduled_start)
        const scheduledEnd = new Date(scheduledStart.getTime() + pool.duration_minutes * 60 * 1000)
        
        let timeUntilStart: number | undefined
        let timeUntilEnd: number | undefined
        let status: 'active' | 'pending' | 'ended' = 'pending'

        if (now < scheduledStart) {
          // Pool hasn't started yet
          timeUntilStart = Math.max(0, Math.floor((scheduledStart.getTime() - now.getTime()) / 1000))
          status = 'pending'
        } else if (now >= scheduledStart && now < scheduledEnd) {
          // Pool is active
          timeUntilEnd = Math.max(0, Math.floor((scheduledEnd.getTime() - now.getTime()) / 1000))
          status = pool.status === 'LIVE' || pool.status === 'OPEN' ? 'active' : 'pending'
        } else {
          // Pool has ended
          status = 'ended'
        }

        // Map backend status to display status
        if (pool.status === 'ENDED') {
          status = 'ended'
        } else if (pool.status === 'LIVE' || pool.status === 'OPEN') {
          status = 'active'
        } else if (pool.status === 'WAITING' || pool.status === 'DRAFT') {
          status = 'pending'
        }

        return {
          id: pool.id,
          title: pool.title,
          type: pool.entry_fee === 0 ? 'Daily' : 'Paid',
          entryFee: pool.entry_fee === 0 ? 'Free' : `₦${pool.entry_fee.toLocaleString()}`,
          currency: '₦',
          activePlayers: 0, // TODO: Get from backend if available
          currentPot: '₦0', // TODO: Get from backend if available
          status,
          timeUntilStart,
          timeUntilEnd,
        }
      })

      setPools(convertedPools)
    } catch (error) {
      console.error('Failed to fetch admin pools:', error)
      setPoolsError(error instanceof Error ? error.message : 'Failed to fetch pools')
      setPools([]) // Set empty array on error
    } finally {
      setIsLoadingPools(false)
    }
  }

  const activePoolsCount = pools.filter(p => p.status === 'active').length
  const totalRevenue = '2.4M' // TODO: Calculate from pools or fetch from API
  const onlineUsers = 342 // TODO: Fetch from API

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreatePool = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreatePoolSubmit = async (poolData: PoolFormData) => {
    try {
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('admin_token')
      if (!adminToken) {
        console.error('Admin token not found. Please login again.')
        return
      }

      // Convert scheduledStart to ISO string format
      const scheduledStartDate = new Date(poolData.scheduledStart)
      const scheduledStartISO = scheduledStartDate.toISOString()

      // Prepare pool data in backend schema format
      const poolRequest = {
        title: poolData.title,
        difficulty: poolData.difficulty,
        category: poolData.category,
        word_length: poolData.wordLength,
        entry_fee: poolData.entryFee,
        reward_per_question: poolData.rewardPerQuestion,
        max_players: poolData.maxPlayers,
        questions_per_user: poolData.questionsPerUser,
        scheduled_start: scheduledStartISO,
        duration_minutes: poolData.durationMinutes,
        status: poolData.status,
      }

      // Call backend API to create pool
      const response = await poolService.createAdminPool(poolRequest, adminToken)
      
      console.log('Pool created successfully:', response)

      // Close modal
      setIsCreateModalOpen(false)

      // Refresh pools list to show the newly created pool
      await fetchAdminPools()

      // Also add to context for user dashboard
      const scheduledStart = new Date(poolData.scheduledStart)
      const now = new Date()
      const timeUntilStart = Math.max(0, Math.floor((scheduledStart.getTime() - now.getTime()) / 1000))
      const timeUntilEnd = poolData.durationMinutes * 60

      // Map difficulty from uppercase to lowercase for display
      const displayDifficulty = poolData.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'
      
      // Map status from schema to context format
      let contextStatus: 'active' | 'pending' | 'ended' = 'pending'
      if (poolData.status === 'LIVE' || poolData.status === 'OPEN') {
        contextStatus = 'active'
      } else if (poolData.status === 'ENDED') {
        contextStatus = 'ended'
      }

      // Add to context for immediate UI update in user dashboard
      createPool({
        title: poolData.title,
        type: poolData.entryFee === 0 ? 'Daily' : 'Paid',
        category: poolData.category,
        difficulty: displayDifficulty,
        entryFee: poolData.entryFee.toString(),
        currency: '₦',
        maxPlayers: poolData.maxPlayers,
        status: contextStatus,
        image: poolData.image,
        timeUntilStart: timeUntilStart > 0 ? timeUntilStart : undefined,
        timeUntilEnd: timeUntilEnd > 0 ? timeUntilEnd : undefined,
        wordLength: poolData.wordLength,
        rewardPerQuestion: poolData.rewardPerQuestion,
        questionsPerUser: poolData.questionsPerUser,
        scheduledStart: poolData.scheduledStart,
        durationMinutes: poolData.durationMinutes,
      })
    } catch (error) {
      console.error('Failed to create pool:', error)
      // You might want to show an error message to the user here
      alert(error instanceof Error ? error.message : 'Failed to create pool. Please try again.')
    }
  }

  const handleEditPool = (poolId: string) => {
    // TODO: Implement edit pool functionality
    console.log('Edit pool:', poolId)
  }

  const handleStopPool = (poolId: string) => {
    // TODO: Implement stop pool functionality
    console.log('Stop pool:', poolId)
  }

  if (currentPage === 'pools') {
    return (
      <div className="admin-dashboard">
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-icon pools">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H10V10H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3H21V10H14V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14H10V21H3V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H21V21H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ACTIVE POOLS</div>
              <div className="admin-metric-value">{activePoolsCount}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon revenue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">TOTAL REVENUE</div>
              <div className="admin-metric-value">₦{totalRevenue}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ONLINE USERS</div>
              <div className="admin-metric-value">{onlineUsers}</div>
            </div>
          </div>
        </div>
        <div className="admin-pools-section">
          <div className="admin-pools-header">
            <div>
              <h1 className="admin-pools-title">Pools Management</h1>
              <p className="admin-pools-subtitle">Create, edit, and monitor game pools.</p>
            </div>
            <button className="admin-create-pool-button" onClick={handleCreatePool}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4V16M4 10H16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Create Pool</span>
            </button>
          </div>
          {isLoadingPools ? (
            <div className="admin-pools-loading">
              <p>Loading pools...</p>
            </div>
          ) : poolsError ? (
            <div className="admin-pools-error">
              <p>Error: {poolsError}</p>
              <button onClick={fetchAdminPools} className="admin-retry-button">
                Retry
              </button>
            </div>
          ) : pools.length === 0 ? (
            <div className="admin-pools-empty">
              <p>No pools found. Create your first pool to get started.</p>
            </div>
          ) : (
            <div className="admin-pools-grid">
              {pools.map((pool) => (
                <PoolCard
                  key={pool.id}
                  pool={pool}
                  onEdit={() => handleEditPool(pool.id)}
                  onStop={() => handleStopPool(pool.id)}
                />
              ))}
            </div>
          )}
        </div>
        <CreatePoolModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePoolSubmit}
        />
      </div>
    )
  }

  if (currentPage === 'wallet') {
    return (
      <div className="admin-dashboard">
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-icon pools">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H10V10H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3H21V10H14V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14H10V21H3V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H21V21H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ACTIVE POOLS</div>
              <div className="admin-metric-value">{activePoolsCount}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon revenue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">TOTAL REVENUE</div>
              <div className="admin-metric-value">₦{totalRevenue}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ONLINE USERS</div>
              <div className="admin-metric-value">{onlineUsers}</div>
            </div>
          </div>
        </div>
        <div className="admin-wallet-section">
          <div className="admin-wallet-header">
            <div>
              <h1 className="admin-wallet-title">Wallet & Finance</h1>
              <p className="admin-wallet-subtitle">Manage system liquidity and funds.</p>
            </div>
          </div>
          <div className="admin-wallet-card">
            <div className="wallet-header">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="2"
                  y="7"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 21V5C16 3.89543 15.1046 3 14 3H6C4.89543 3 4 3.89543 4 5V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>ADMIN BALANCE</span>
            </div>
            <div className="wallet-content-row">
              <div className="wallet-balance">
                <div className="wallet-amount">₦524,450.00</div>
                <p className="wallet-subtitle">Total System Funds</p>
              </div>
              <div className="wallet-actions">
                <button className="wallet-button wallet-button-fund">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Fund System</span>
                </button>
                <button className="wallet-button wallet-button-withdraw">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Withdraw Funds</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === 'transactions') {
    // Mock transaction data
    const transactions = [
      {
        id: 'TX_1',
        pool: 'Speed Syntax',
        user: 'User_101',
        type: 'Entry Fee',
        amount: 1000,
        isPositive: true,
        time: '2 mins ago',
      },
      {
        id: 'TX_2',
        pool: 'Neon Matrix',
        user: 'User_202',
        type: 'Prize Payout',
        amount: 500,
        isPositive: false,
        time: '5 mins ago',
      },
      {
        id: 'TX_3',
        pool: 'Speed Syntax',
        user: 'User_303',
        type: 'Entry Fee',
        amount: 1000,
        isPositive: true,
        time: '8 mins ago',
      },
      {
        id: 'TX_4',
        pool: 'Wallet Fund',
        user: 'User_101',
        type: 'Deposit',
        amount: 10000,
        isPositive: true,
        time: '15 mins ago',
      },
    ]

    return (
      <div className="admin-dashboard">
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-icon pools">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H10V10H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3H21V10H14V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14H10V21H3V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H21V21H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ACTIVE POOLS</div>
              <div className="admin-metric-value">{activePoolsCount}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon revenue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">TOTAL REVENUE</div>
              <div className="admin-metric-value">₦{totalRevenue}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ONLINE USERS</div>
              <div className="admin-metric-value">{onlineUsers}</div>
            </div>
          </div>
        </div>
        <div className="admin-transactions-section">
          <div className="admin-transactions-header">
            <div>
              <h1 className="admin-transactions-title">Transaction Logs</h1>
              <p className="admin-transactions-subtitle">View history of all pool transactions.</p>
            </div>
            <div className="admin-transactions-filters">
              <select className="admin-transactions-filter-select">
                <option value="all">All Pools</option>
                {pools.map((pool) => (
                  <option key={pool.id} value={pool.id}>
                    {pool.title}
                  </option>
                ))}
              </select>
              <button className="admin-transactions-refresh-button">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.5 2.5V7.5H12.5M2.5 17.5V12.5H7.5M17.5 17.5L14.1667 14.1667C13.2458 15.0875 12.0458 15.625 10.75 15.625C8.125 15.625 6 13.5 6 10.875C6 8.25 8.125 6.125 10.75 6.125C13.375 6.125 15.5 8.25 15.5 10.875C15.5 12.1708 14.9625 13.3708 14.0417 14.2917L17.5 17.5ZM2.5 2.5L5.83333 5.83333C6.75417 4.9125 7.95417 4.375 9.25 4.375C11.875 4.375 14 6.5 14 9.125C14 11.75 11.875 13.875 9.25 13.875C6.625 13.875 4.5 11.75 4.5 9.125C4.5 7.82917 5.0375 6.62917 5.95833 5.70833L2.5 2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>
          <div className="admin-transactions-table-container">
            <table className="admin-transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Pool / Context</th>
                  <th>User</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="admin-transaction-id">{tx.id}</td>
                    <td className="admin-transaction-pool">{tx.pool}</td>
                    <td className="admin-transaction-user">{tx.user}</td>
                    <td>
                      <span className="admin-transaction-type-badge">{tx.type}</span>
                    </td>
                    <td>
                      <span className={`admin-transaction-amount ${tx.isPositive ? 'positive' : 'negative'}`}>
                        {tx.isPositive ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="admin-transaction-time">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === 'system-override' && adminRole === 'super') {
    return (
      <div className="admin-dashboard">
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-icon pools">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H10V10H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3H21V10H14V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14H10V21H3V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H21V21H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ACTIVE POOLS</div>
              <div className="admin-metric-value">{activePoolsCount}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon revenue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">TOTAL REVENUE</div>
              <div className="admin-metric-value">₦{totalRevenue}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ONLINE USERS</div>
              <div className="admin-metric-value">{onlineUsers}</div>
            </div>
          </div>
        </div>
        <div className="admin-override-section">
          <div className="admin-override-header">
            <div>
              <h1 className="admin-override-title">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 9V12M12 15H12.01M5 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V6C21 5.46957 20.7893 4.96086 20.4142 4.58579C20.0391 4.21071 19.5304 4 19 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                System Override
              </h1>
              <p className="admin-override-subtitle">Emergency controls and system-wide settings.</p>
            </div>
          </div>
          <div className="admin-override-content">
            <div className="admin-override-column">
              <h2 className="admin-override-column-title">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V12M12 16H12.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Emergency Controls
              </h2>
              <div className="admin-override-controls">
                <div className="admin-override-control-item">
                  <div className="admin-override-control-info">
                    <div className="admin-override-control-label">Maintenance Mode</div>
                    <div className="admin-override-control-description">Disable all gameplay and logins</div>
                  </div>
                  <label className="admin-toggle-switch">
                    <input type="checkbox" />
                    <span className="admin-toggle-slider"></span>
                  </label>
                </div>
                <div className="admin-override-control-item">
                  <div className="admin-override-control-info">
                    <div className="admin-override-control-label">Freeze Transactions</div>
                    <div className="admin-override-control-description">Stop all deposits and withdrawals</div>
                  </div>
                  <label className="admin-toggle-switch">
                    <input type="checkbox" />
                    <span className="admin-toggle-slider"></span>
                  </label>
                </div>
                <button className="admin-override-reboot-button">
                  FORCE SYSTEM REBOOT
                </button>
              </div>
            </div>
            <div className="admin-override-column">
              <h2 className="admin-override-column-title">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 7C4 6.44772 4.44772 6 5 6H19C19.5523 6 20 6.44772 20 7V9C20 9.55228 19.5523 10 19 10H5C4.44772 10 4 9.55228 4 9V7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 15C4 14.4477 4.44772 14 5 14H19C19.5523 14 20 14.4477 20 15V17C20 17.5523 19.5523 18 19 18H5C4.44772 18 4 17.5523 4 17V15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Game State Overrides
              </h2>
              <div className="admin-override-controls">
                <div className="admin-override-control-item">
                  <div className="admin-override-control-info">
                    <div className="admin-override-control-label">Reset Daily Challenge</div>
                    <div className="admin-override-control-description">Regenerate daily puzzle seed</div>
                  </div>
                  <button className="admin-override-action-button">Run</button>
                </div>
                <div className="admin-override-control-item">
                  <div className="admin-override-control-info">
                    <div className="admin-override-control-label">Clear Active Sessions</div>
                    <div className="admin-override-control-description">Log out all active users</div>
                  </div>
                  <button className="admin-override-action-button">Run</button>
                </div>
                <div className="admin-override-control-item">
                  <div className="admin-override-control-info">
                    <div className="admin-override-control-label">Manual Result Entry</div>
                    <div className="admin-override-control-description">Force specific game result</div>
                  </div>
                  <button className="admin-override-action-button">Open</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentPage === 'live-game' && adminRole === 'super') {
    return (
      <div className="admin-dashboard">
        <div className="admin-metrics">
          <div className="admin-metric-card">
            <div className="admin-metric-icon pools">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 3H10V10H3V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 3H21V10H14V3Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 14H10V21H3V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 14H21V21H14V14Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ACTIVE POOLS</div>
              <div className="admin-metric-value">{activePoolsCount}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon revenue">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 18L9 12L13 16L21 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 8H15V14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">TOTAL REVENUE</div>
              <div className="admin-metric-value">₦{totalRevenue}</div>
            </div>
          </div>
          <div className="admin-metric-card">
            <div className="admin-metric-icon users">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="admin-metric-content">
              <div className="admin-metric-label">ONLINE USERS</div>
              <div className="admin-metric-value">{onlineUsers}</div>
            </div>
          </div>
        </div>
        <div className="admin-live-game-section">
          <div className="admin-live-game-header">
            <div>
              <h1 className="admin-live-game-title">Live Game Monitor</h1>
              <p className="admin-live-game-subtitle">Monitor active games in real-time.</p>
            </div>
          </div>
          <div className="admin-page-placeholder">
            <p>Live game monitoring coming soon...</p>
          </div>
        </div>
      </div>
    )
  }

  // Placeholder for other pages
  return (
    <div className="admin-dashboard">
      <div className="admin-page-placeholder">
        <h2>{currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page</h2>
        <p>This page is coming soon...</p>
      </div>
    </div>
  )
}

export default AdminDashboard
