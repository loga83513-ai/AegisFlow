
import { useEffect, useState } from 'react'
import api from '../../services/api'
import {
  Ticket,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Phone,
  Users,
  ArrowUpRight,
  Check,
  Circle,
  MoreHorizontal,
  Sparkles
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
function Dashboard() {
  const [completedTasks, setCompletedTasks] = useState([0])
  const [selectedDate, setSelectedDate] = useState(7)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [currentPage, setCurrentPage] = useState(1)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
const [notificationLoading, setNotificationLoading] = useState(false)

const unreadCount = notifications.filter(
  (notification) => !notification.is_read
).length


const ticketsPerPage = 5
  const [analytics, setAnalytics] = useState({
  total_tickets: 0,
  open_tickets: 0,
  resolved_tickets: 0,
  sla_breached_tickets: 0
})

const [loading, setLoading] = useState(true)
const [error, setError] = useState('')
const [tickets, setTickets] = useState([])
const [monthlyStats, setMonthlyStats] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const fetchAnalytics = async () => {
  try {
    setLoading(true)
    setError('')

    const response = await api.get('/tickets/dashboard-analytics/')
    const ticketsResponse = await api.get('/tickets/')

    const ticketData = Array.isArray(ticketsResponse.data)
      ? ticketsResponse.data
      : ticketsResponse.data.results || []

    setTickets(ticketData)
    setAnalytics(response.data)

  } catch (error) {
    console.error('Dashboard analytics error:', error)
    setError('Unable to load dashboard analytics')
  } finally {
    setLoading(false)
  }
}
const fetchNotifications = async () => {
  try {
    setNotificationLoading(true)

    const response = await api.get('/tickets/notifications/')

    const data = response.data

    setNotifications(
      Array.isArray(data) ? data : data.results || []
    )

  } catch (error) {
    console.error('Notification fetch error:', error)
  } finally {
    setNotificationLoading(false)
  }
}
const markAsRead = async (notificationId) => {
  try {
    await api.patch(
      `/tickets/notifications/${notificationId}/read/`,
      {}
    )

    setNotifications((previous) =>
      previous.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    )

  } catch (error) {
    console.error('Mark notification as read error:', error)
  }
}

useEffect(() => {
  fetchAnalytics()
}, [])
useEffect(() => {
  fetchNotifications()
}, [])
useEffect(() => {
  const fetchMonthlyStats = async () => {
    try {
      const response = await api.get('/tickets/monthly-analytics/')

      setMonthlyStats(response.data)

    } catch (error) {
      console.error('Monthly analytics error:', error)
    }
  }

  fetchMonthlyStats()
}, [])
console.log('Monthly Statistics:', monthlyStats)


  const stats = [
  {
    title: 'Total Tickets',
    value: loading ? '...' : analytics.total_tickets,
    detail: 'Your total tickets',
    icon: Ticket,
    theme: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-emerald-200'
  },
  {
    title: 'Open Tickets',
    value: loading ? '...' : analytics.open_tickets,
    detail: 'Needs attention',
    icon: Clock3,
    theme: 'from-orange-300 to-orange-500',
    shadow: 'shadow-orange-200'
  },
  {
    title: 'Resolved Tickets',
    value: loading ? '...' : analytics.resolved_tickets,
    detail: 'Successfully resolved',
    icon: CheckCircle2,
    theme: 'from-violet-400 to-purple-500',
    shadow: 'shadow-violet-200'
  },
  {
    title: 'SLA Breaches',
    value: loading ? '...' : analytics.sla_breached_tickets,
    detail: 'Requires action',
    icon: AlertTriangle,
    theme: 'from-rose-400 to-pink-500',
    shadow: 'shadow-rose-200'
  }
]
  const tasks = tickets.map((ticket) => ({
  id: ticket.id,
  title: ticket.title,
  status: ticket.status,
  priority: ticket.priority,
}))
const filteredTasks = tasks.filter((task) => {
  const search = searchTerm.toLowerCase()

  return (
    task.title.toLowerCase().includes(search) ||
    String(task.id).includes(search) ||
    task.status.toLowerCase().includes(search) ||
    task.priority.toLowerCase().includes(search)
  )
})
const indexOfLastTicket = currentPage * ticketsPerPage

const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage

const currentTickets = filteredTasks.slice(
  indexOfFirstTicket,
  indexOfLastTicket
)

const totalPages = Math.ceil(
  filteredTasks.length / ticketsPerPage
)
const chartData = monthlyStats.map((item) => ({
  month: new Date(2026, item.month - 1).toLocaleString('en-US', {
    month: 'short'
  }),
  Created: item.created,
  Resolved: item.resolved
}))
console.log('Chart Data:', chartData)

  const events = [
    { title: 'Team Meeting', time: 'Today · 11:00 AM', icon: Users, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Project Review', time: 'Today · 03:00 PM', icon: CalendarDays, color: 'bg-violet-100 text-violet-600' },
    { title: 'Client Call', time: 'Tomorrow · 10:00 AM', icon: Phone, color: 'bg-orange-100 text-orange-600' }
  ]

  const firstDay = new Date(
  currentMonth.getFullYear(),
  currentMonth.getMonth(),
  1
).getDay()

const daysInMonth = new Date(
  currentMonth.getFullYear(),
  currentMonth.getMonth() + 1,
  0
).getDate()

const days = [
  ...Array(firstDay).fill(null),
  ...Array.from({ length: daysInMonth }, (_, index) => index + 1)
]
const today = new Date()

const isToday =
  currentMonth.getMonth() === today.getMonth() &&
  currentMonth.getFullYear() === today.getFullYear()

  const toggleTask = (index) => {
    setCompletedTasks((previous) =>
      previous.includes(index)
        ? previous.filter((item) => item !== index)
        : [...previous, index]
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Hello, Loga 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here's what's happening with your support tickets today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/70 backdrop-blur-xl border border-white rounded-full px-4 py-3 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input
  type="text"
  placeholder="Search tickets..."
  value={searchTerm}
  onChange={(e) => {
  setSearchTerm(e.target.value)
  setCurrentPage(1)
}}
  className="bg-transparent outline-none text-sm w-32 md:w-44 text-slate-700"
/>
          </div>


<div className="relative">
  <button
    onClick={() => setShowNotifications(!showNotifications)}
    className="relative bg-white/70 backdrop-blur-xl border border-white p-3 rounded-full shadow-sm text-slate-600"
  >
    <Bell size={19} />

   {unreadCount > 0 && (
  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
    {unreadCount > 9 ? '9+' : unreadCount}
  </span>
)}
  </button>

  {showNotifications && (
    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">
          Notifications
        </h3>

        <button
          onClick={() => setShowNotifications(false)}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Close
        </button>
      </div>

     <div className="max-h-80 overflow-y-auto">

  {notificationLoading ? (
    <p className="p-5 text-center text-sm text-slate-500">
      Loading notifications...
    </p>
  ) : notifications.length === 0 ? (
    <p className="p-5 text-center text-sm text-slate-500">
      No notifications yet
    </p>
  ) : (
    notifications.map((notification) => (
     <div
  key={notification.id}
  onClick={() => {
    if (!notification.is_read) {
      markAsRead(notification.id)
    }
  }}
  className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 ${
    notification.is_read ? 'bg-white' : 'bg-emerald-50'
  }`}
>
        <p className="text-sm font-semibold text-slate-800">
          {notification.title}
        </p>

        <p className="text-xs text-slate-600 mt-1">
          {notification.message}
        </p>

        <p className="text-xs text-slate-400 mt-2">
          {new Date(notification.created_at).toLocaleString()}
        </p>
      </div>
    ))
  )}

</div>
    </div>
  )}
</div>

          <div className="w-11 h-11 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center font-bold text-emerald-700 shadow-sm">
            L
          </div>
        </div>
      </header>

      {/* Main content and calendar */}
      <div className="grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_265px] gap-5">

        <div className="min-w-0 space-y-6">

          {/* Summary cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.title}
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.theme} p-5 text-white shadow-lg ${stat.shadow} hover:-translate-y-1 transition-all duration-300`}
                >
                  <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-white/10" />
                  <div className="absolute right-12 top-16 w-20 h-20 rounded-full bg-white/10" />

                  <div className="relative flex justify-between items-center">
                    <div className="bg-white/25 backdrop-blur-md p-3 rounded-xl">
                      <Icon size={22} />
                    </div>
                    <MoreHorizontal size={22} className="text-white/80" />
                  </div>

                  <div className="relative mt-5">
                    <h2 className="text-3xl font-bold">{stat.value}</h2>
                    <p className="font-semibold text-sm mt-1">{stat.title}</p>
                    <p className="text-xs text-white/85 mt-3">{stat.detail}</p>
                  </div>
                </div>
              )
            })}

          </section>

          {/* Tasks and Statistics */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">

            {/* My Tasks */}
            <div className="bg-white/65 backdrop-blur-2xl border border-white/80 rounded-2xl p-5 shadow-lg shadow-slate-200/40">

              <div className="flex justify-between items-center mb-5">
                <h2 className="text-lg font-bold text-slate-800">
                  <span className="inline-block w-1.5 h-6 bg-emerald-500 rounded-full mr-2 align-middle" />
                  My Tasks
                </h2>
                <button className="text-sm font-semibold text-emerald-700">
                  View All →
                </button>
              </div>

             <div className="space-y-4">

 {loading ? (
  <p className="text-sm text-slate-400 text-center py-6">
    Loading tickets...
  </p>
) : error ? (
  <div className="text-center py-6">
    <p className="text-sm text-rose-500 mb-3">
      {error}
    </p>

    <button
      onClick={fetchAnalytics}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >
      Retry
    </button>
  </div>
) : filteredTasks.length === 0 ? (
  <p className="text-sm text-slate-400 text-center py-6">
    No matching tickets found.
  </p>
) : (
   currentTickets.map((ticket) => (
      <div
        key={ticket.id}
        className="flex items-center gap-3 border-b border-slate-100 pb-3 last:border-0"
      >

        {/* Status icon */}
        <div className={`shrink-0 ${
          ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
            ? 'text-emerald-600'
            : 'text-orange-500'
        }`}>
          {ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
            ? <CheckCircle2 size={22} />
            : <Clock3 size={22} />
          }
        </div>

        {/* Ticket details */}
        <div className="flex-1 min-w-0">

          <p className="text-sm font-semibold text-slate-700 truncate">
            {ticket.title}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            #{ticket.id} · {ticket.status.replace('_', ' ')}
          </p>

        </div>

        {/* Priority */}
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          ticket.priority === 'CRITICAL'
            ? 'bg-rose-100 text-rose-700'
            : ticket.priority === 'HIGH'
            ? 'bg-orange-100 text-orange-700'
            : ticket.priority === 'MEDIUM'
            ? 'bg-blue-100 text-blue-700'
            : 'bg-slate-100 text-slate-600'
        }`}>
          {ticket.priority}
        </span>
        {!loading && !error && filteredTasks.length > ticketsPerPage && (
  <div className="flex items-center justify-between mt-4">

    <button
      onClick={() => setCurrentPage((prev) => prev - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
    >
      Previous
    </button>

    <span className="text-sm text-slate-500">
      Page {currentPage} of {totalPages}
    </span>

    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
      disabled={currentPage === totalPages}
      className="px-4 py-2 text-sm border rounded-lg disabled:opacity-40"
    >
      Next
    </button>

  </div>
)}

      </div>
    ))
  )}

</div>
            </div>

            {/* Statistics */}
            <div className="bg-white/65 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-sm">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-slate-800">
                  Statistics Overview
                </h2>
                <select className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none">
                  <option>This Month</option>
                  <option>Last Month</option>
                </select>
              </div>

              <div className="flex justify-end gap-4 text-xs text-slate-500 mb-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Created
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Resolved
                </span>
              </div>

              <div className="w-full h-[230px]">

  {monthlyStats.length === 0 ? (
    <div className="h-full flex items-center justify-center text-sm text-slate-400">
      No statistics available
    </div>
  ) : (

    <ResponsiveContainer width="100%" height="100%">

      <LineChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
      >

        <CartesianGrid
          strokeDasharray="4 5"
          stroke="#E2E8F0"
        />

        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#94A3B8' }}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: '#94A3B8' }}
        />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="Created"
          stroke="#10B981"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

        <Line
          type="monotone"
          dataKey="Resolved"
          stroke="#8B5CF6"
          strokeWidth={3}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />

      </LineChart>

    </ResponsiveContainer>

  )}

</div>
            </div>
          </section>

          {/* Bottom banner */}
          <section className="relative overflow-hidden bg-gradient-to-r from-emerald-100 via-teal-50 to-violet-100 rounded-2xl p-6 md:p-8 border border-white shadow-sm">
            <div className="relative z-10 max-w-md">
              <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold">
                <Sparkles size={17} />
                YOUR WORKSPACE
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-3">
                Keep up the great work!
              </h2>

              <p className="text-slate-600 text-sm mt-2">
                Your dedication helps us deliver better support for our customers.
              </p>

              <button className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition">
                View Details <ArrowUpRight size={16} className="inline ml-1" />
              </button>
            </div>

            <div className="absolute -right-8 -bottom-16 w-48 h-48 bg-emerald-300/30 rounded-full blur-2xl" />
            <div className="absolute right-16 top-5 w-24 h-24 bg-violet-300/30 rounded-full blur-2xl" />
          </section>

        </div>

        {/* Calendar */}
        <aside className="bg-white/65 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-sm h-fit">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Calendar</h2>
            <button className="text-xs text-emerald-700 font-semibold">
              View All →
            </button>
          </div>

          <div className="flex justify-between items-center mt-6 mb-5">
           <button
  onClick={() => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    )
    setSelectedDate(null)
  }}
  className="p-2 bg-slate-50 rounded-full"
>
  <ChevronLeft size={17} />
</button>
          <span className="text-sm font-bold text-slate-700">
  {currentMonth.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric'
  })}
</span>
           <button
  onClick={() => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    )
    setSelectedDate(null)
  }}
  className="p-2 bg-slate-50 rounded-full"
>
  <ChevronRight size={17} />
</button>
          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <span key={`${day}-${index}`} className="text-xs text-slate-400 font-semibold">
                {day}
              </span>
            ))}

           {days.map((day, index) => (
  day === null ? (
    <span key={`empty-${index}`} />
  ) : (
    <button
      key={day}
      onClick={() => setSelectedDate(day)}
      className={`w-8 h-8 mx-auto rounded-full text-xs transition ${
        selectedDate === day
  ? 'bg-emerald-500 text-white shadow-md'
  : isToday && today.getDate() === day
  ? 'bg-emerald-100 text-emerald-700 font-bold'
  : 'text-slate-600 hover:bg-emerald-50'
      }`}
    >
      {day}
    </button>
  )
))}
          </div>

          <div className="border-t border-slate-100 mt-6 pt-5">
            <h3 className="font-bold text-slate-800 text-sm mb-4">
              Upcoming Events
            </h3>

            <div className="space-y-4">
              {events.map((event) => {
                const Icon = event.icon

                return (
                  <div key={event.title} className="flex gap-3 items-center">
                    <div className={`p-2.5 rounded-xl ${event.color}`}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {event.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </aside>
      </div>
    </div>
  )
}

export default Dashboard
