import { useEffect, useState } from 'react'
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  PlayCircle,
  ShieldAlert
} from 'lucide-react'
import api from '../../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

function Dashboard() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const [ticketResponse, analyticsResponse] = await Promise.all([
        api.get('/tickets/'),
        api.get('/tickets/dashboard-analytics/')
      ])

      const ticketData = ticketResponse.data

setTickets(
  Array.isArray(ticketData)
    ? ticketData
    : ticketData.results || []
)
      setAnalytics(analyticsResponse.data)

   } catch (err) {
  console.error('Agent Dashboard Error:', {
    url: err.config?.url,
    status: err.response?.status,
    response: err.response?.data
  })

  setError(
    `${err.config?.url} failed (${err.response?.status})`
  )
} finally {
  setLoading(false)
}
  }

  fetchDashboard()
}, [])

  const openTickets = tickets.filter(
    (ticket) => ticket.status === 'OPEN'
  ).length

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === 'RESOLVED'
  ).length

  const highPriorityTickets = tickets.filter(
    (ticket) => ['HIGH', 'CRITICAL'].includes(ticket.priority)
  ).length
  const slaChartData = analytics ? [
  {
    name: 'Response SLA',
    breached: analytics.response_sla_breached_tickets,
  },
  {
    name: 'Resolution SLA',
    breached: analytics.resolution_sla_breached_tickets,
  }
] : []

 const stats = analytics ? [
  {
    label: 'Assigned Tickets',
    value: analytics.total_tickets,
    icon: Ticket
  },
  {
    label: 'Open Tickets',
    value: analytics.open_tickets,
    icon: Clock
  },
  {
    label: 'In Progress',
    value: analytics.in_progress_tickets,
    icon: PlayCircle
  },
  {
    label: 'Resolved Tickets',
    value: analytics.resolved_tickets,
    icon: CheckCircle
  },
  {
    label: 'Critical Tickets',
    value: analytics.critical_tickets,
    icon: AlertTriangle
  },
  {
    label: 'SLA Breached',
    value: analytics.sla_breached_tickets,
    icon: ShieldAlert
  },
  {
  label: 'Response SLA Breached',
  value: analytics.response_sla_breached_tickets,
  icon: Clock
},
{
  label: 'Resolution SLA Breached',
  value: analytics.resolution_sla_breached_tickets,
  icon: AlertTriangle
}
] : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Agent Dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Manage and resolve your assigned support tickets.
        </p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading assigned tickets...</p>
      ) : error ? (
        <p className="text-rose-600">{error}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.label}
                  className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-5 shadow-lg"
                >
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <Icon className="text-emerald-600" size={22} />
                  </div>

                  <p className="text-3xl font-bold text-slate-800 mt-4">
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>
          {/* SLA Performance Chart */}
<div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-6">
  <div className="mb-5">
    <h2 className="text-lg font-bold text-slate-800">
      SLA Performance Analytics
    </h2>
    <p className="text-sm text-slate-500">
      Response vs Resolution SLA breaches
    </p>
  </div>

  <div className="w-full h-80">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={slaChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />

        <Bar
          dataKey="breached"
          name="Breached Tickets"
          fill="#ef4444"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              My Assigned Tickets
            </h2>

            {tickets.length === 0 ? (
              <p className="text-slate-500">
                No tickets assigned to you yet.
              </p>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-slate-200 rounded-xl p-4"
                  >
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="text-sm text-emerald-700 font-semibold">
                          Ticket #{ticket.id}
                        </p>
                        <h3 className="font-semibold text-slate-800 mt-1">
                          {ticket.title}
                        </h3>
                      </div>

                      <div className="text-sm text-slate-600">
                        {ticket.priority} · {ticket.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard