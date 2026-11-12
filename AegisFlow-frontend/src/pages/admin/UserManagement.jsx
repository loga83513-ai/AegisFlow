
import { useEffect, useState } from 'react'
import { Search, Users, ShieldCheck, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import api from '../../services/api'

function UserManagement() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [selectedRoles, setSelectedRoles] = useState({})

  const fetchUsers = async () => {
    try {
      setLoading(true)

      const response = await api.get('/accounts/team/')

      const data = response.data.members || []
      setUsers(data)

      const roles = {}
      data.forEach(user => {
        roles[user.id] = user.role
      })
      setSelectedRoles(roles)

    } catch (error) {
      toast.error('Unable to load users')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleRoleUpdate = async (userId) => {
    try {
      setUpdatingId(userId)

      const response = await api.patch(
        `/accounts/users/${userId}/role/`,
        { role: selectedRoles[userId] }
      )

      toast.success(response.data.message)
      await fetchUsers()

    } catch (error) {
      toast.error(
        error.response?.data?.error || 'Role update failed'
      )
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter(user =>
    `${user.username} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            User Management
          </h1>
          <p className="text-slate-500 mt-1">
            Manage registered users and their roles
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-sm">Total Users</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {users.length}
              </h2>
            </div>
            <Users className="text-emerald-600" size={30} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-500 text-sm">Admin Accounts</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {users.filter(user => user.role === 'ADMIN').length}
              </h2>
            </div>
            <ShieldCheck className="text-purple-600" size={30} />
          </div>
        </div>

      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">

        <div className="relative mb-5">
          <Search
            className="absolute left-3 top-3 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search username, email or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        {loading ? (
          <p className="text-center py-10 text-slate-500">
            Loading users...
          </p>
        ) : filteredUsers.length === 0 ? (
          <p className="text-center py-10 text-slate-500">
            No users found
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-slate-500 text-sm">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Change Role</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="p-3 font-semibold text-slate-800">
                      {user.username}
                    </td>

                    <td className="p-3 text-slate-600">
                      {user.email}
                    </td>

                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        {user.role}
                      </span>
                    </td>

                    <td className="p-3">
                      <select
                        value={selectedRoles[user.id] || user.role}
                        disabled={user.role === 'ADMIN'}
                        onChange={e =>
                          setSelectedRoles(prev => ({
                            ...prev,
                            [user.id]: e.target.value
                          }))
                        }
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-slate-100"
                      >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="AGENT">AGENT</option>
                        <option value="TEAM_LEAD">TEAM LEAD</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <button
                        disabled={
                          updatingId === user.id ||
                          selectedRoles[user.id] === user.role ||
                          user.role === 'ADMIN'
                        }
                        onClick={() => handleRoleUpdate(user.id)}
                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed"
                      >
                        {updatingId === user.id ? 'Updating...' : 'Update'}
                      </button>
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

export default UserManagement
