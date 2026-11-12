
import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
} from 'lucide-react'

function Calendar() {
  const [tickets, setTickets] = useState([])
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/tickets/')
      setTickets(response.data)
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to load calendar events.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  // Convert date into YYYY-MM-DD format
  const getDateKey = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  }

  // Create calendar events from tickets
  const events = tickets.flatMap((ticket) => {
    const ticketEvents = []

    if (ticket.created_at) {
      ticketEvents.push({
        id: `${ticket.id}-created`,
        ticketId: ticket.id,
        title: ticket.title,
        type: 'CREATED',
        date: ticket.created_at,
        priority: ticket.priority,
        status: ticket.status,
      })
    }

    if (ticket.response_deadline) {
      ticketEvents.push({
        id: `${ticket.id}-response`,
        ticketId: ticket.id,
        title: ticket.title,
        type: 'RESPONSE',
        date: ticket.response_deadline,
        priority: ticket.priority,
        status: ticket.status,
        breached: ticket.response_sla_breached,
      })
    }

    if (ticket.resolution_deadline) {
      ticketEvents.push({
        id: `${ticket.id}-resolution`,
        ticketId: ticket.id,
        title: ticket.title,
        type: 'RESOLUTION',
        date: ticket.resolution_deadline,
        priority: ticket.priority,
        status: ticket.status,
        breached: ticket.resolution_sla_breached,
      })
    }

    return ticketEvents
  })

  // Build 42 calendar cells
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  )

  const calendarStart = new Date(
    firstDay.getFullYear(),
    firstDay.getMonth(),
    1 - firstDay.getDay()
  )

  const calendarDays = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart)
    date.setDate(calendarStart.getDate() + index)
    return date
  })

  const getEventsForDate = (date) => {
    const key = getDateKey(date)

    return events.filter(
      (event) => getDateKey(new Date(event.date)) === key
    )
  }

  const selectedEvents = getEventsForDate(selectedDate)

  const todayKey = getDateKey(new Date())

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    )
  }

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    )
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentMonth(today)
    setSelectedDate(today)
  }

  const getEventStyle = (type) => {
    if (type === 'CREATED') {
      return 'bg-blue-100 text-blue-700'
    }

    if (type === 'RESPONSE') {
      return 'bg-orange-100 text-orange-700'
    }

    return 'bg-purple-100 text-purple-700'
  }

  const getEventLabel = (type) => {
    if (type === 'CREATED') return 'Created'
    if (type === 'RESPONSE') return 'Response SLA'
    return 'Resolution SLA'
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center text-gray-500">
        Loading calendar...
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track ticket creation and SLA deadlines.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          Ticket Created
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          Response SLA
        </span>

        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-purple-500" />
          Resolution SLA
        </span>
      </div>

      {/* Calendar */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Month Navigation */}
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentMonth.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
            >
              Today
            </button>

            <button
              onClick={goToPreviousMonth}
              className="rounded-lg border p-2 hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={goToNextMonth}
              className="rounded-lg border p-2 hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 border-b bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
            (day) => (
              <div
                key={day}
                className="py-3 text-center text-xs font-semibold text-gray-600"
              >
                {day}
              </div>
            )
          )}
        </div>

        {/* Calendar Dates */}
        <div className="grid grid-cols-7">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isCurrentMonth =
              date.getMonth() === currentMonth.getMonth()

            const isToday = getDateKey(date) === todayKey
            const isSelected =
              getDateKey(date) === getDateKey(selectedDate)

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(date)}
                className={`min-h-[110px] border-b border-r p-2 text-left transition hover:bg-blue-50 ${
                  !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${
                  isSelected ? 'ring-2 ring-inset ring-blue-500' : ''
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isToday
                      ? 'bg-blue-600 font-semibold text-white'
                      : isCurrentMonth
                      ? 'text-gray-800'
                      : 'text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </span>

                <div className="mt-2 space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={`truncate rounded px-1 py-1 text-[10px] font-medium ${getEventStyle(event.type)}`}
                      title={`Ticket #${event.ticketId}: ${event.title}`}
                    >
                      #{event.ticketId} {getEventLabel(event.type)}
                    </div>
                  ))}

                  {dayEvents.length > 2 && (
                    <p className="text-[10px] text-gray-500">
                      +{dayEvents.length - 2} more
                    </p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Date Events */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <CalendarDays size={20} />
            Events on {selectedDate.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </h2>
        </div>

        {selectedEvents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No events on this date.
          </div>
        ) : (
          <div className="divide-y">
            {selectedEvents
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((event) => (
                <div
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      Ticket #{event.ticketId} - {event.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className={`rounded-full px-2 py-1 ${getEventStyle(event.type)}`}>
                        {getEventLabel(event.type)}
                      </span>

                      <span>{event.priority}</span>
                      <span>{event.status}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    {formatTime(event.date)}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default Calendar
