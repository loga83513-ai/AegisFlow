import { useEffect, useState } from 'react'
import { Search, Plus, Ticket, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function MyTickets() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const [tickets, setTickets] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/tickets/')

      const data = response.data

const ticketList = Array.isArray(data)
  ? data
  : data.results || []

const sortedTickets = [...ticketList].sort(
  (a, b) => new Date(b.created_at) - new Date(a.created_at)
)

setTickets(sortedTickets)
    } catch (err) {
      console.error('Ticket fetch error:', err)
      setError('Unable to load tickets. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  fetchTickets()
}, [])
 const totalTickets = tickets.length

const openTickets = tickets.filter(
  (ticket) => ticket.status?.toLowerCase() === 'open'
).length

const resolvedTickets = tickets.filter(
  (ticket) => ticket.status?.toLowerCase() === 'resolved'
).length

  const statusStyle = {
    Open: 'bg-orange-100 text-orange-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
  }

  const priorityStyle = {
    High: 'text-rose-600',
    Medium: 'text-orange-600',
    Low: 'text-emerald-600',
  }
  const filteredTickets = tickets.filter((ticket) =>
  `${ticket.id} ${ticket.title} ${ticket.category}`
    .toLowerCase()
    .includes(search.toLowerCase())
)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track and manage your support requests.
          </p>
        </div>

       <button
  onClick={() => navigate('/create-ticket')}
  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-white font-semibold shadow-lg shadow-emerald-200 hover:opacity-90"
>
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
  title="Total Tickets"
  value={totalTickets}
  icon={Ticket}
  color="text-violet-600"
/>

<StatCard
  title="Open Tickets"
  value={openTickets}
  icon={Clock}
  color="text-orange-600"
/>

<StatCard
  title="Resolved"
  value={resolvedTickets}
  icon={CheckCircle2}
  color="text-emerald-600"
/>
      </div>

      <div className="rounded-2xl bg-white/65 backdrop-blur-2xl border border-white/80 p-5 shadow-lg shadow-slate-200/40">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full rounded-xl border border-slate-200 bg-white/70 py-3 pl-10 pr-4 text-sm outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3">
  {loading ? (
    <p className="py-8 text-center text-sm text-slate-500">
      Loading tickets...
    </p>
  ) : error ? (
    <p className="py-8 text-center text-sm text-rose-600">
      {error}
    </p>
  ) : filteredTickets.length === 0 ? (
    <p className="py-8 text-center text-sm text-slate-500">
      No tickets found.
    </p>
  ) : (
    filteredTickets.map((ticket) => (
      <div
        key={ticket.id}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-xl border border-slate-100 bg-white/60 p-4 hover:bg-white/90 transition"
      >
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Ticket size={20} />
          </div>

          <div>
            <p className="text-xs font-semibold text-emerald-700">
              #{ticket.id}
            </p>
            <h3 className="font-semibold text-slate-800 mt-1">
              {ticket.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {ticket.category} · {ticket.created_at || ticket.date}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <span className={`text-xs font-semibold ${priorityStyle[ticket.priority] || 'text-slate-600'}`}>
            <AlertCircle size={14} className="inline mr-1" />
            {ticket.priority}
          </span>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[ticket.status] || 'bg-slate-100 text-slate-700'}`}>
            {ticket.status}
          </span>

          <button
            onClick={() => navigate(`/tickets/${ticket.id}`)}
            className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
          >
            View
          </button>
        </div>
      </div>
    ))
  )}
</div>


          {filteredTickets.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              No tickets found.
            </p>
          )}
        </div>
      </div>

  )
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/65 p-5 shadow-lg shadow-slate-200/40 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <Icon size={21} className={color} />
      </div>
      <h2 className="mt-3 text-3xl font-bold text-slate-800">{value}</h2>
    </div>
  )
}

export default MyTickets