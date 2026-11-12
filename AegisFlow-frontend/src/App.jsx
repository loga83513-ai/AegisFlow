import { AuthProvider, useAuth } from './context/AuthContext'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/employee/Dashboard'
import AgentDashboard from './pages/agent/Dashboard'
import DashboardLayout from './layouts/DashboardLayout'
import MyTickets from './pages/employee/MyTickets'
import CreateTicket from './pages/employee/CreateTicket'
import ProtectedRoute from './components/ProtectedRoute'
import TicketDetails from './pages/employee/TicketDetails'
import Analytics from './pages/Analytics'
import Team from './pages/Team'
import Calendar from './pages/Calendar'
import Settings from './pages/Settings'
import ManagementDashboard from './pages/management/ManagementDashboard'
import UserManagement from './pages/admin/UserManagement'




function RoleBasedDashboard() {
  const { userRole } = useAuth()

  switch (userRole) {
    case 'EMPLOYEE':
      return <Dashboard />

    case 'AGENT':
      return <AgentDashboard />

    case 'TEAM_LEAD':
    case 'MANAGER':
    case 'ADMIN':
      return <ManagementDashboard role={userRole} />

    default:
      return <Dashboard />
  }
}

function AdminRoute() {
  const { userRole } = useAuth()

  return userRole === 'ADMIN'
    ? <UserManagement />
    : <Dashboard />
}


function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
        <AuthProvider>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>

              <Route
  path="/dashboard"
  element={<RoleBasedDashboard />}
/>

              <Route
  path="/user-management"
  element={<AdminRoute />}
/>

              <Route path="/tickets" element={<MyTickets />} />
              <Route path="/create-ticket" element={<CreateTicket />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/team" element={<Team />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/settings" element={<Settings />} />

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
        </AuthProvider>
    </>
  )
}

export default App
