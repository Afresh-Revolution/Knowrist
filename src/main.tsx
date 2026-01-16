import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { WalletProvider } from './contexts/WalletContext'
import { PoolProvider } from './contexts/PoolContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { UserProvider } from './contexts/UserContext'
import './styles/main.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <WalletProvider>
        <PoolProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </PoolProvider>
      </WalletProvider>
    </UserProvider>
  </React.StrictMode>,
)
