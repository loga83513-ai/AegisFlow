import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Paperclip,
  Send,
  Ticket,
  X,
} from 'lucide-react'
import api from '../../services/api'

function CreateTicket() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
  })

  const [attachment, setAttachment] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  try {
    setLoading(true)
    setError('')

    const response = await api.post('/tickets/', {
  title: formData.title,
  description: formData.description,
  category: formData.category.toUpperCase(),
  priority: formData.priority.toUpperCase(),
})

    console.log('Created ticket:', response.data)

    alert('Ticket created successfully!')

    navigate('/tickets')
  } catch (err) {
    console.error('Ticket creation error:', err.response?.data || err)

    setError(
      err.response?.data?.detail ||
      'Unable to create ticket. Please try again.'
    )
  } finally {
    setLoading(false)
  }
}
  const [loading, setLoading] = useState(false)
const [error, setError] = useState('')

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <button
        onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-emerald-700"
      >
        <ArrowLeft size={18} />
        Back to My Tickets
      </button>

      <div>
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
            <Ticket size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Create New Ticket
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Describe your issue and our support team will assist you.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-white/80 bg-white/65 p-6 md:p-8 shadow-lg shadow-slate-200/40 backdrop-blur-2xl space-y-6"
      >

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Ticket Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Example: Unable to access company email"
            required
            className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain your issue in detail..."
            rows={5}
            required
            className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="">Select category</option>
              <option value="Technical">Technical</option>
              <option value="Software">Software</option>
              <option value="Hardware">Hardware</option>
              <option value="Network">Network</option>
              <option value="Access">Access</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Priority
            </label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white/70 px-4 py-3 text-sm outline-none focus:border-emerald-400"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Attachment (Optional)
          </label>

          <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white/40 px-4 py-6 text-sm text-slate-500 hover:border-emerald-400 hover:bg-emerald-50/50">
            <Paperclip size={20} />
            <span>
              {attachment ? attachment.name : 'Click to upload a file'}
            </span>

            <input
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
              onChange={(e) => setAttachment(e.target.files[0] || null)}
            />
          </label>

          {attachment && (
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="mt-2 flex items-center gap-1 text-xs text-red-500"
            >
              <X size={14} />
              Remove attachment
            </button>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t border-slate-200 pt-5">

          <button
            type="button"
            onClick={() => navigate('/tickets')}
            className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          {error && (
  <p className="text-sm text-rose-600">{error}</p>
)}

          <button
  type="submit"
  disabled={loading}
  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 hover:opacity-90 disabled:opacity-50"
>
  <Send size={17} />
  {loading ? 'Creating Ticket...' : 'Submit Ticket'}

</button>


        </div>

      </form>
    </div>
  )
}

export default CreateTicket