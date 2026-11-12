
import { useEffect, useState } from 'react'
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw
} from 'lucide-react'
import api from '../../services/api'

function ManagementDashboard({ role }) {
console.log('Management Dashboard Role:', role)
  const [analytics, setAnalytics] = useState(null)
  const [tickets, setTickets] = useState([])
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const roleTitles = {
    TEAM_LEAD: 'Team Lead Dashboard',
    MANAGER: 'Manager Dashboard',
    ADMIN: 'Admin Dashboard'
  }
  const roleDescriptions = {
  TEAM_LEAD: 'Monitor your team, assigned tickets and agent performance.',
  MANAGER: 'Track department performance and overall service operations.',
  ADMIN: 'Manage users, tickets and overall system performance.'
}

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError('')

      const requests = [
        api.get('/tickets/dashboard-analytics/'),
        api.get('/tickets/')
      ]

      if (['TEAM_LEAD', 'MANAGER', 'ADMIN'].includes(role)) {
        requests.push(api.get('/accounts/team/'))
      }

      const responses = await Promise.all(requests)

      setAnalytics(responses[0].data)

      const ticketData = responses[1].data
      setTickets(
        Array.isArray(ticketData)
          ? ticketData
          : ticketData.results || []
      )

      if (responses[2]) {
        setTeam(responses[2].data)
      }
    } catch (err) {
      console.error('Dashboard error:', err)
      setError('Unable to load dashboard information.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [role])
  const cardGradients = [
  'from-emerald-400 to-teal-500',
  'from-orange-400 to-orange-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-blue-400 to-cyan-500'
]

  const stats = [
    {
      title: 'Total Tickets',
      value: analytics?.total_tickets ?? 0,
      icon: Ticket,
      color: 'text-violet-600',
      bg: 'bg-violet-100'
    },
    {
      title: 'Open Tickets',
      value: analytics?.open_tickets ?? 0,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    {
      title: 'Resolved Tickets',
      value: analytics?.resolved_tickets ?? 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100'
    },
    {
      title: 'SLA Breaches',
      value: analytics?.sla_breached_tickets ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-100'
    },
    {
      title: 'Team Members',
      value: team?.total_members ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    }
  ]
  const teamMembers = team?.members || []

const activeMembers = teamMembers.filter(
  (member) => member.is_active
).length

const totalAgents = teamMembers.filter(
  (member) => member.role === 'AGENT'
).length

const totalTeamLeads = teamMembers.filter(
  (member) => member.role === 'TEAM_LEAD'
).length

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl bg-white p-6 text-center">
        <p className="text-rose-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboard}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {roleTitles[role]}
          </h1>
         <p className="mt-1 text-sm text-slate-500">
  {roleDescriptions[role]}
</p>
        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
       {stats.map((stat, index) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className={`rounded-2xl bg-gradient-to-br ${cardGradients[index]} p-5 text-white shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {stat.title}
                </p>

                <div className="rounded-xl bg-white/20 p-3">
  <Icon size={21} className="text-white" />
</div>
              </div>

              <h2 className="mt-3 text-3xl font-bold text-slate-800">
                {stat.value}
              </h2>
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">

  <div className="mb-5 flex items-center justify-between">
    <div>
      <h2 className="text-lg font-bold text-slate-800">
        Recent Tickets
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Monitor your team's latest ticket activity
      </p>
    </div>

    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
      {tickets.length} Tickets
    </span>
  </div>

  {tickets.length === 0 ? (
    <p className="py-8 text-center text-sm text-slate-500">
      No tickets available.
    </p>
  ) : (
    <div className="space-y-3">

      {tickets.slice(0, 8).map((ticket) => (

        <div
          key={ticket.id}
          className="rounded-xl border border-slate-100 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-md"
        >

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Ticket Details */}
            <div className="min-w-0">

              <p className="text-xs font-bold text-emerald-600">
                TICKET #{ticket.id}
              </p>

              <h3 className="mt-1 truncate font-semibold text-slate-800">
                {ticket.title}
              </h3>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">

                <span>
                  Category: {ticket.category || 'N/A'}
                </span>

                <span>
                  Agent: {ticket.assigned_to_username || 'Unassigned'}
                </span>

                <span>
                  Created: {new Date(ticket.created_at).toLocaleDateString()}
                </span>

              </div>

            </div>

            {/* Priority and Status */}
            <div className="flex flex-wrap items-center gap-2">

              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                ticket.priority === 'HIGH'
                  ? 'bg-rose-100 text-rose-700'
                  : ticket.priority === 'MEDIUM'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {ticket.priority}
              </span>

              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {ticket.status}
              </span>

            </div>

          </div>

        </div>

      ))}

    </div>
  )}

</section>
{['TEAM_LEAD', 'MANAGER', 'ADMIN'].includes(role) && (
  <section className="rounded-2xl border border-white bg-white/80 p-5 shadow-sm">
    <div className="mb-5">
      <h2 className="text-lg font-bold text-slate-800">
        Team Performance
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Overview of your team members and their roles
      </p>
    </div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        {
          title: 'Total Members',
          value: team?.total_members ?? 0,
          color: 'bg-blue-50 text-blue-600',
          icon: Users
        },
        {
          title: 'Active Members',
          value: activeMembers,
          color: 'bg-emerald-50 text-emerald-600',
          icon: CheckCircle2
        },
        {
          title: 'Agents',
          value: totalAgents,
          color: 'bg-violet-50 text-violet-600',
          icon: Users
        },
        {
          title: 'Team Leads',
          value: totalTeamLeads,
          color: 'bg-orange-50 text-orange-600',
          icon: Users
        }
      ].map((item) => {
        const Icon = item.icon

        return (
          <div
            key={item.title}
            className="rounded-xl border border-slate-100 bg-white p-4"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>
              <Icon size={20} />
            </div>

            <p className="text-sm text-slate-500">{item.title}</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-800">
              {item.value}
            </h3>
          </div>
        )
      })}
    </div>

    <h3 className="mb-3 font-semibold text-slate-800">
      Team Members
    </h3>

    <div className="space-y-3">
      {teamMembers.map((member) => (
        <div
          key={member.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold text-slate-800">
              {member.first_name || member.username}
              {member.last_name ? ` ${member.last_name}` : ''}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {member.email || 'No email available'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
              {member.role.replace('_', ' ')}
            </span>

            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              member.is_active
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}>
              {member.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      ))}
    </div>
  </section>
)}


    </div>

  )
}

export default ManagementDashboard
