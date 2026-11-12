
import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  Users,
  UserCheck,
  Headset,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react'

function Team() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/accounts/team/')

      setMembers(response.data.members || [])
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to load team members.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const employeeCount = members.filter(
    (member) => member.role === 'EMPLOYEE'
  ).length

  const agentCount = members.filter(
    (member) => member.role === 'AGENT'
  ).length

  const staffCount = members.filter(
    (member) =>
      ['TEAM_LEAD', 'MANAGER', 'ADMIN'].includes(member.role)
  ).length

  const stats = [
    {
      title: 'Total Members',
      count: members.length,
      icon: Users,
    },
    {
      title: 'Employees',
      count: employeeCount,
      icon: UserCheck,
    },
    {
      title: 'Support Agents',
      count: agentCount,
      icon: Headset,
    },
    {
      title: 'Management',
      count: staffCount,
      icon: ShieldCheck,
    },
  ]

  const getRoleStyle = (role) => {
    const styles = {
      EMPLOYEE: 'bg-blue-100 text-blue-700',
      AGENT: 'bg-purple-100 text-purple-700',
      TEAM_LEAD: 'bg-orange-100 text-orange-700',
      MANAGER: 'bg-green-100 text-green-700',
      ADMIN: 'bg-red-100 text-red-700',
    }

    return styles[role] || 'bg-gray-100 text-gray-700'
  }

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-gray-500">Loading team members...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Team Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your organization members.
          </p>
        </div>

        <button
          onClick={fetchTeamMembers}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {stat.title}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    {stat.count}
                  </h2>
                </div>

                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                  <Icon size={23} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Members Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold text-gray-800">
            Team Members
          </h2>
        </div>

        {members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No team members found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-5 py-4">Member</th>
                  <th className="px-5 py-4">Email</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Joined Date</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">
                        {member.first_name || member.username}{' '}
                        {member.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        @{member.username}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {member.email || 'Not provided'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getRoleStyle(member.role)}`}
                      >
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {new Date(member.date_joined).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          member.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {member.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default Team
