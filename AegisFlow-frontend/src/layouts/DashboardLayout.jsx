import { useAuth } from '../context/AuthContext'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import profileImage from '../assets/profile.png'
import { useEffect, useState } from 'react'
import api from '../services/api'

import {
  LayoutDashboard,
  Ticket,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  ChartNoAxesColumn,
  CalendarDays,
    UserCog
} from 'lucide-react'


function DashboardLayout() {
const [profile, setProfile] = useState(null)


useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await api.get('/accounts/profile/')
      setProfile(response.data)
    } catch (error) {
      console.error('Profile fetch error:', error)
    }
  }

  fetchProfile()
}, [])
const { userRole, logout } = useAuth()

const displayName = profile
  ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.username
  : 'Loading...'


const displayRole = userRole.replace('_', ' ')
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tickets', path: '/tickets', icon: Ticket },
    { name: 'Analytics', path: '/analytics', icon: ChartNoAxesColumn },
    { name: 'Team', path: '/team', icon: Users },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    ...(userRole === 'ADMIN'
  ? [
      {
        name: 'User Management',
        path: '/user-management',
        icon: UserCog
      }
    ]
  : []),
    { name: 'Settings', path: '/settings', icon: Settings },
  ]
  const navigate = useNavigate()

const handleLogout = () => {
  logout()
  navigate('/login', { replace: true })
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D9F5E9] via-[#E8F3FF] to-[#E9E1FF] p-4 md:p-6">

      <div className="max-w-[1600px] min-h-[calc(100vh-48px)] mx-auto flex gap-5">

        <aside className="w-64 shrink-0 bg-white/30 backdrop-blur-2xl border border-white/70 rounded-3xl p-5 flex flex-col shadow-xl">



          <div className="flex items-center gap-2 mb-10">


            <ShieldCheck className="text-emerald-600" size={30} />
            <h1 className="text-2xl font-bold text-slate-800">
              Aegis<span className="text-emerald-600">Flow</span>
            </h1>

          </div>

<div className="bg-white/50 backdrop-blur-xl border border-white/70 rounded-2xl p-3 mb-8 flex items-center gap-3 shadow-sm">
  <img
    src={profileImage}
    alt="Profile"
    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
  />
  <p className="text-xs text-slate-500">
  {displayRole}
</p>

  <div className="min-w-0">
    <h3 className="text-sm font-bold text-slate-800 truncate">
  {displayName}
</h3>
    
    <div className="flex items-center gap-1 mt-1">
      <span className="w-2 h-2 rounded-full bg-emerald-500" />
      <span className="text-[10px] text-emerald-700">
        Online
      </span>
    </div>
  </div>
</div>



          <nav className="space-y-2 flex-1">

            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                      isActive
                        ? 'bg-emerald-400/20 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:bg-white/50 hover:text-slate-900'
                    }`
                  }
                >
                  <Icon size={20} />
                  {item.name}
                </NavLink>
              )
            })}
          </nav>


          <button
  onClick={handleLogout}
  className="flex items-center gap-3 text-slate-600 hover:text-red-500 px-4 py-3"
>
  <LogOut size={20} />
  Logout
</button>

        </aside>

        <main className="flex-1 min-w-0 bg-white/35 backdrop-blur-2xl border border-white/70 rounded-3xl p-5 md:p-8 shadow-xl">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default DashboardLayout
