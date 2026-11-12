
import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
} from 'lucide-react'
import api from '../services/api'

const COLORS = [
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#64748b',
]

function Analytics() {
  const [analytics, setAnalytics] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError('')

        const [analyticsResponse, ticketsResponse] =
          await Promise.all([
            api.get('/tickets/dashboard-analytics/'),
            api.get('/tickets/'),
          ])

        setAnalytics(analyticsResponse.data)

        const ticketData = Array.isArray(ticketsResponse.data)
          ? ticketsResponse.data
          : ticketsResponse.data.results || []

        setTickets(ticketData)
      } catch (err) {
        console.error('Analytics error:', err.response?.data || err)
        setError('Unable to load analytics data.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const priorityData = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map(
    (priority) => ({
      name: priority,
      count: tickets.filter(
        (ticket) => ticket.priority === priority
      ).length,
    })
  )

  const categoryData = [
    ...new Set(tickets.map((ticket) => ticket.category).filter(Boolean)),
  ].map((category) => ({
    name: category,
    count: tickets.filter(
      (ticket) => ticket.category === category
    ).length,
  }))
  console.table(
  tickets.map((ticket) => ({
    id: ticket.id,
    title: ticket.title,
    category: ticket.category,
    employee_category: ticket.employee_category,
  }))
)

  const stats = analytics
    ? [
        {
          label: 'Total Tickets',
          value: analytics.total_tickets,
          icon: Ticket,
        },
        {
          label: 'Open Tickets',
          value: analytics.open_tickets,
          icon: Clock,
        },
        {
          label: 'In Progress',
          value: analytics.in_progress_tickets,
          icon: AlertTriangle,
        },
        {
          label: 'Resolved Tickets',
          value: analytics.resolved_tickets,
          icon: CheckCircle,
        },
        {
          label: 'Response SLA Breached',
          value: analytics.response_sla_breached_tickets,
          icon: ShieldAlert,
        },
        {
          label: 'Resolution SLA Breached',
          value: analytics.resolution_sla_breached_tickets,
          icon: ShieldAlert,
        },
      ]
    : []

  if (loading) {
    return (
      <p className="p-6 text-slate-500">
        Loading analytics...
      </p>
    )
  }

  if (error) {
    return (
      <p className="p-6 text-rose-600">
        {error}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Detailed ticket and SLA performance insights.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100"
            >
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">
                  {item.label}
                </p>
                <Icon size={20} className="text-emerald-600" />
              </div>

              <h2 className="text-3xl font-bold text-slate-800 mt-3">
                {item.value ?? 0}
              </h2>
            </div>
          )
        })}
      </div>

      {/* Priority Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-1">
            Priority-wise Tickets
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Ticket distribution by priority.
          </p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar
                  dataKey="count"
                  name="Tickets"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="font-bold text-slate-800 mb-1">
            Category-wise Tickets
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Ticket distribution by category.
          </p>

          <div className="h-72">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="count"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {categoryData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 text-center pt-24">
                No category data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
