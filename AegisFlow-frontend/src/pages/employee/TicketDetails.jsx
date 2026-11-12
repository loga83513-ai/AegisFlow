import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Ticket,
  Clock,
  AlertCircle,
  CircleDot,
  Clock3,
  CheckCircle2,
  XCircle,
   ShieldAlert,
} from 'lucide-react'
import api from '../../services/api'
const statusConfig = {
  OPEN: {
    label: 'Open',
    color: 'text-blue-600',
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    icon: CircleDot,
  },
  IN_PROGRESS: {
    label: 'In Progress',
    color: 'text-orange-600',
    bg: 'bg-orange-100',
    border: 'border-orange-400',
    icon: Clock3,
  },
  RESOLVED: {
    label: 'Resolved',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100',
    border: 'border-emerald-400',
    icon: CheckCircle2,
  },
  CLOSED: {
    label: 'Closed',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    icon: XCircle,
  },
}

function TicketDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [comments, setComments] = useState([])
const [commentText, setCommentText] = useState('')
const [commentLoading, setCommentLoading] = useState(false)
const [updatingStatus, setUpdatingStatus] = useState(false)
const [statusMessage, setStatusMessage] = useState('')
const userRole = localStorage.getItem('user_role')
const [statusHistory, setStatusHistory] = useState([])
const [historyLoading, setHistoryLoading] = useState(false)

const canUpdateStatus = [
  'AGENT',
  'TEAM_LEAD',
  'MANAGER',
  'ADMIN',
].includes(userRole)
const fetchComments = async () => {
  try {
    const response = await api.get(`/tickets/${id}/comments/`)
    setComments(response.data)
  } catch (err) {
    console.error(
      'Comments fetch error:',
      err.response?.data || err
    )
  }
}
const fetchStatusHistory = async () => {
  try {
    setHistoryLoading(true)

    const response = await api.get(`/tickets/${id}/history/`)

    setStatusHistory(response.data)
  } catch (err) {
    console.error(
      'Status history fetch error:',
      err.response?.data || err
    )
  } finally {
    setHistoryLoading(false)
  }
}
const handleAddComment = async (e) => {
  e.preventDefault()

  if (!commentText.trim()) return

  try {
    setCommentLoading(true)

    await api.post(`/tickets/${id}/comments/`, {
      message: commentText.trim(),
    })

    setCommentText('')
    await fetchComments()
  } catch (err) {
    console.error(
      'Add comment error:',
      err.response?.data || err
    )
  } finally {
    setCommentLoading(false)
  }
}
const handleStatusUpdate = async (e) => {
  const newStatus = e.target.value

  if (!newStatus || newStatus === ticket.status) return

  try {
    setUpdatingStatus(true)
    setStatusMessage('')

    const response = await api.patch(
      `/tickets/${id}/status/`,
      { status: newStatus }
    )

    setTicket((prev) => ({
  ...prev,
  ...response.data,
}))
    setStatusMessage('Ticket status updated successfully!')
    await fetchStatusHistory()
  } catch (err) {
    console.error(
      'Status update error:',
      err.response?.data || err
    )
    setStatusMessage('Unable to update ticket status.')
  } finally {
    setUpdatingStatus(false)
  }
}

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/tickets/${id}/`)
        setTicket(response.data)
        await fetchComments()
        await fetchStatusHistory()
      } catch (err) {
        console.error('Ticket details error:', err.response?.data || err)
        setError('Unable to load ticket details.')
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [id])

  if (loading) {
    return <p className="p-6 text-slate-500">Loading ticket details...</p>
  }

  if (error || !ticket) {
    return <p className="p-6 text-rose-600">{error || 'Ticket not found.'}</p>
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-emerald-700 font-semibold"
      >
        <ArrowLeft size={18} />
        Back to My Tickets
      </button>

      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white p-6 shadow-lg space-y-5">
        <div>
          <p className="text-sm text-emerald-700 font-semibold">
            Ticket #{ticket.id}
          </p>
          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            {ticket.title}
          </h1>
        </div>

        <div>
          <h2 className="font-semibold text-slate-700 mb-2">Description</h2>
          <p className="text-slate-600 whitespace-pre-wrap">
            {ticket.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InfoCard
            icon={Ticket}
            label="Category"
            value={ticket.category || ticket.ai_predicted_category || 'Pending'}
          />
          <InfoCard
            icon={AlertCircle}
            label="Priority"
            value={ticket.priority}
          />
          <InfoCard
            icon={Clock}
            label="Status"
            value={ticket.status}
          />
        </div>
        {/* SLA Monitoring */}
<div className="rounded-xl border border-slate-200 p-4 space-y-4">
  <h2 className="font-semibold text-slate-800 flex items-center gap-2">
    <ShieldAlert size={20} />
    SLA Monitoring
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

    {/* Response SLA */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-600">
        Response SLA
      </p>


      <span
        className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
          ticket.response_sla_breached
            ? 'bg-rose-100 text-rose-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {ticket.response_sla_breached
          ? 'Breached'
          : 'Not Breached'}
      </span>
      <p className="text-xs text-slate-500 mt-3">
  Deadline:
  {ticket.response_deadline
    ? new Date(ticket.response_deadline).toLocaleString()
    : 'Not available'}
</p>
    </div>

    {/* Resolution SLA */}
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-600">
        Resolution SLA
      </p>


      <span
        className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
          ticket.resolution_sla_breached
            ? 'bg-rose-100 text-rose-700'
            : 'bg-emerald-100 text-emerald-700'
        }`}
      >
        {ticket.resolution_sla_breached
          ? 'Breached'
          : 'Not Breached'}
      </span>
       <p className="text-xs text-slate-500 mt-3">
  Deadline:
  {ticket.resolution_deadline
    ? new Date(ticket.resolution_deadline).toLocaleString()
    : 'Not available'}
</p>
    </div>

  </div>
</div>

        {canUpdateStatus && (
  <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-3">
    <h2 className="font-semibold text-slate-800">
      Update Ticket Status
    </h2>

    <select
      value={ticket.status}
      onChange={handleStatusUpdate}
      disabled={updatingStatus}
      className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-emerald-500 disabled:opacity-50"
    >
      <option value="OPEN">Open</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="RESOLVED">Resolved</option>
      <option value="CLOSED">Closed</option>
    </select>

    {updatingStatus && (
      <p className="text-sm text-slate-500">
        Updating status...
      </p>
    )}

    {statusMessage && (
      <p className="text-sm text-emerald-700">
        {statusMessage}
      </p>
    )}
  </div>
)}

        {ticket.ai_suggested_steps && (
          <div>
            <h2 className="font-semibold text-slate-700 mb-2">
              AI Suggested Steps
            </h2>
            <p className="text-slate-600 whitespace-pre-wrap">
              {Array.isArray(ticket.ai_suggested_steps)
                ? ticket.ai_suggested_steps.join('\n')
                : ticket.ai_suggested_steps}
            </p>
          </div>
        )}
        {/* Ticket Status History */}
<div className="border-t border-slate-200 pt-6 space-y-4">
  <h2 className="text-xl font-bold text-slate-800">
    Status History
  </h2>

  {historyLoading ? (
    <p className="text-sm text-slate-500">
      Loading status history...
    </p>
  ) : statusHistory.length === 0 ? (
    <p className="text-sm text-slate-500">
      No status changes recorded yet.
    </p>
  ) : (
    <div className="space-y-4">
      {statusHistory.map((item) => {
  const config =
    statusConfig[item.new_status] || statusConfig.OPEN

  const StatusIcon = config.icon

  return (
    <div
      key={item.id}
      className={`relative border-l-2 ${config.border} pl-6 pb-5`}
    >
      <div
        className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full ${config.bg} flex items-center justify-center`}
      >
        <StatusIcon size={14} className={config.color} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-700">
            {item.old_status.replace('_', ' ')}
          </span>

          <span className="text-slate-400">→</span>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color} ${config.bg}`}
          >
            {config.label}
          </span>
        </div>

        <p className="text-sm text-slate-600">
          Changed by: {item.changed_by_username || 'Unknown'}
        </p>

        <p className="text-xs text-slate-400">
          {new Date(item.changed_at).toLocaleString()}
        </p>
      </div>
    </div>
  )
})}
    </div>
  )}
</div>
        <div className="border-t border-slate-200 pt-6 space-y-5">
  <h2 className="text-xl font-bold text-slate-800">
    Ticket Conversation
  </h2>

  {/* Existing comments */}
  <div className="space-y-4">
    {comments.length === 0 ? (
      <p className="text-sm text-slate-500">
        No comments yet. Start the conversation.
      </p>
    ) : (
      comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-xl bg-slate-50 p-4"
        >
          <div className="flex justify-between items-center gap-3">
            <p className="font-semibold text-slate-800">
              {comment.author_username}
            </p>

            <p className="text-xs text-slate-500">
              {new Date(comment.created_at).toLocaleString()}
            </p>
          </div>

          <p className="mt-2 text-slate-600 whitespace-pre-wrap">
            {comment.message}
          </p>
        </div>
      ))
    )}
  </div>

  {/* Add comment form */}
  <form onSubmit={handleAddComment} className="space-y-3">
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Write your message..."
      rows={3}
      className="w-full rounded-xl border border-slate-200 bg-white p-3 outline-none focus:border-emerald-500"
    />

    <button
      type="submit"
      disabled={commentLoading || !commentText.trim()}
      className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
    >
      {commentLoading ? 'Sending...' : 'Send Comment'}
    </button>
  </form>
</div>
      </div>
    </div>
  )
}


function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <div className="flex items-center gap-2 text-slate-500 text-sm">
        <Icon size={17} />
        {label}
      </div>
      <p className="font-semibold text-slate-800 mt-2">{value || 'N/A'}</p>
    </div>
  )
}

export default TicketDetails