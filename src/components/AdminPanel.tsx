import React, { useState, useEffect } from 'react'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'
import AdminDashboard from './AdminDashboard'
import AuthForm from './AuthForm'
import ConfirmLogout from './ConfirmLogout'

type AdminRole = 'main' | 'super'
type AdminPage = 'pools' | 'wallet' | 'transactions' | 'live-game' | 'system-override'

interface AdminPanelProps {
  adminRole: AdminRole
}

const AdminPanel: React.FC<AdminPanelProps> = ({ adminRole: initialRole }) => {
  const [adminRole, setAdminRole] = useState<AdminRole | null>(() => {
    // Check for existing admin session
    const storedRole = localStorage.getItem('admin_role') as AdminRole | null
    const token = localStorage.getItem('admin_token')
    return (storedRole && token) ? storedRole : null
  })
  const [currentPage, setCurrentPage] = useState<AdminPage>('pools')
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminRole)

  // Update role when prop changes (route change) - but only if authenticated
  useEffect(() => {
    if (isAuthenticated && initialRole) {
      setAdminRole(initialRole)
      localStorage.setItem('admin_role', initialRole)
    }
  }, [initialRole, isAuthenticated])

  const handleLoginSuccess = (role: AdminRole) => {
    setAdminRole(role)
    setIsAuthenticated(true)
    // Navigate to appropriate route
    const route = role === 'super' ? '/superadmin' : '/mainadmin'
    window.history.pushState({}, '', route)
    // Dispatch popstate event to trigger App.tsx route detection
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleLogout = () => {
    // Clear all admin session data
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_role')
    
    // Clear any user data as well
    localStorage.removeItem('knowrist_user')
    localStorage.removeItem('knowrist_token')
    
    setIsAuthenticated(false)
    setAdminRole(null)
    
    // Close logout confirmation modal
    setShowLogoutConfirm(false)
    
    // Navigate back to login page (root) and reload to show login form
    window.history.pushState({}, '', '/')
    window.location.reload()
  }

  // Show login if not authenticated
  if (!isAuthenticated || !adminRole) {
    return (
      <div className="app">
        <AuthForm 
          isAdminLogin={true}
          onAdminLoginSuccess={handleLoginSuccess}
        />
      </div>
    )
  }

  return (
    <div className="admin-panel">
      <AdminHeader
        onLogout={() => setShowLogoutConfirm(true)}
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />
      {isSidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="admin-layout">
        <AdminSidebar
          adminRole={adminRole}
          currentPage={currentPage}
          onPageChange={(page) => {
            setCurrentPage(page)
            setIsSidebarOpen(false)
          }}
          isOpen={isSidebarOpen}
        />
        <div className="admin-content">
          <AdminDashboard
            adminRole={adminRole}
            currentPage={currentPage}
          />
        </div>
      </div>
      {showLogoutConfirm && (
        <ConfirmLogout
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}

export default AdminPanel
