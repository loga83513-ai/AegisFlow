
import { useEffect, useState } from 'react'
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Lock,
  Save,
  KeyRound,
  RefreshCw,
} from 'lucide-react'
import api from '../services/api'

function Settings() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  })

  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/accounts/profile/')

      setProfile(response.data)
      setForm({
        first_name: response.data.first_name || '',
        last_name: response.data.last_name || '',
        email: response.data.email || '',
      })
    } catch (err) {
      setError('Unable to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)
      setError('')
      setSuccess('')

      const response = await api.patch(
        '/accounts/profile/',
        form
      )

      setProfile(response.data.profile)
      setSuccess('Profile updated successfully!')
    } catch (err) {
      const data = err.response?.data
      setError(
        data?.email?.[0] ||
        'Unable to update profile.'
      )
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()

    try {
      setChangingPassword(true)
      setError('')
      setSuccess('')

      await api.post(
        '/accounts/change-password/',
        passwords
      )

      setPasswords({
        current_password: '',
        new_password: '',
      })

      setSuccess('Password changed successfully!')
    } catch (err) {
      const data = err.response?.data

      const message = data?.error ||
        data?.new_password?.[0] ||
        'Unable to change password.'

      setError(
        Array.isArray(message) ? message.join(' ') : message
      )
    } finally {
      setChangingPassword(false)
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-slate-500">
        Loading settings...
      </p>
    )
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p className="text-rose-600">{error}</p>
        <button
          onClick={fetchProfile}
          className="mt-4 text-emerald-600 font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile and account security.
        </p>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-xl border text-sm ${
          error
            ? 'bg-rose-50 border-rose-200 text-rose-600'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
          {error || success}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <User className="text-emerald-600" size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              My Profile
            </h2>
            <p className="text-sm text-slate-500">
              Update your personal information.
            </p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm text-slate-600 mb-2">
                Username
              </label>
              <input
                value={profile.username}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">
                Account Role
              </label>
              <input
                value={profile.role}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">
                First Name
              </label>
              <input
                value={form.first_name}
                onChange={(e) =>
                  setForm({ ...form, first_name: e.target.value })
                }
                placeholder="Enter first name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-600 mb-2">
                Last Name
              </label>
              <input
                value={form.last_name}
                onChange={(e) =>
                  setForm({ ...form, last_name: e.target.value })
                }
                placeholder="Enter last name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-slate-600 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter email address"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

        </form>
      </div>

      {/* Account Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

        <h2 className="font-bold text-slate-800 mb-5">
          Account Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <div className="flex items-center gap-3">
            <User className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Username</p>
              <p className="font-semibold text-slate-700">
                {profile.username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Account Status</p>
              <p className={`font-semibold ${
                profile.is_active ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {profile.is_active ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="text-emerald-600" size={20} />
            <div>
              <p className="text-xs text-slate-500">Joined Date</p>
              <p className="font-semibold text-slate-700">
                {new Date(profile.date_joined).toLocaleDateString()}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Lock className="text-emerald-600" size={22} />
          </div>

          <div>
            <h2 className="font-bold text-slate-800">
              Change Password
            </h2>
            <p className="text-sm text-slate-500">
              Keep your account secure with a strong password.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-5">

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              Current Password
            </label>
            <input
              type="password"
              required
              value={passwords.current_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  current_password: e.target.value,
                })
              }
              placeholder="Enter current password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={passwords.new_password}
              onChange={(e) =>
                setPasswords({
                  ...passwords,
                  new_password: e.target.value,
                })
              }
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={changingPassword}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 text-white px-5 py-3 rounded-xl font-semibold transition"
          >
            <KeyRound size={18} />
            {changingPassword ? 'Updating...' : 'Update Password'}
          </button>

        </form>
      </div>

    </div>
  )
}

export default Settings
