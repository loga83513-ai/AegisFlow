
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  LockKeyhole,
  UserPlus,
  Mail
} from 'lucide-react'

import api from '../../services/api'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import welcomeAnimation from '../../assets/images/auth-welcome.lottie'
function Register() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/accounts/register/', formData)

      setSuccess('Account created successfully! Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1200)
    } catch (err) {
      const data = err.response?.data

      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([field, value]) => {
            const text = Array.isArray(value) ? value.join(', ') : value
            return `${field}: ${text}`
          })
          .join(' | ')

        setError(messages || 'Registration failed. Please try again.')
      } else {
        setError('Unable to connect to the server. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
   <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-teal-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">

      {/* Background effects */}


    <div className="relative w-full max-w-6xl min-h-[650px] grid lg:grid-cols-2 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[32px] overflow-hidden shadow-[0_20px_80px_rgba(16,185,129,0.12)]">
    {/* Emerald glass background effects */}
<div className="absolute w-96 h-96 bg-emerald-300/25 rounded-full blur-[100px] -top-32 -left-20 pointer-events-none" />

<div className="absolute w-96 h-96 bg-teal-300/25 rounded-full blur-[100px] -bottom-32 -right-20 pointer-events-none" />

        {/* LEFT - Story section */}
       <div className="relative bg-gradient-to-br from-emerald-50/90 via-white/80 to-teal-50/90 border-r border-emerald-100/70 text-slate-900 p-8 sm:p-12 flex flex-col justify-between overflow-hidden">

          <div className="absolute w-80 h-80 border border-emerald-300/10 rounded-full -right-28 -top-24" />
          <div className="absolute w-64 h-64 border border-emerald-300/10 rounded-full -left-28 bottom-10" />

          <div className="relative z-10">

            <div className="flex items-center gap-3">
              <div className="bg-emerald-400/15 p-3 rounded-2xl">
                <ShieldCheck className="text-emerald-300" size={28} />
              </div>

              <h2 className="text-2xl font-bold">
                Aegis<span className="text-emerald-300">Flow</span>
              </h2>
            </div>

            <div className="mt-14">

              <p className="text-emerald-300 text-sm font-semibold tracking-[3px] uppercase">
                A new chapter begins
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mt-5">
                Start your journey.
                <br />
                <span className="text-emerald-300">
                  Build better. Together.
                </span>
              </h1>

              <p className="text-emerald-50/70 mt-5 max-w-md leading-7">
                Join a smarter workspace where collaboration,
                intelligent support and meaningful solutions
                come together.
              </p>

            </div>
          </div>

          {/* Walking character */}
          <div className="relative z-10 flex justify-center items-center py-5">

            <DotLottieReact
  src={welcomeAnimation}
  autoplay
  loop
  style={{ width: '100%', height: '100%' }}
/>

          </div>

          <div className="relative z-10 flex items-center gap-3 text-sm text-emerald-100/70">
            <Sparkles size={17} className="text-emerald-300" />
            <span>Your next chapter starts with one step.</span>
          </div>

        </div>

        {/* RIGHT - Register form */}
        <div className="bg-white/55 backdrop-blur-xl p-8 sm:p-12 lg:p-14 flex flex-col justify-center">

          <div className="max-w-md w-full mx-auto">

            <div className="mb-8">

              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
                <UserPlus className="text-emerald-600" size={24} />
              </div>

              <p className="text-emerald-600 text-sm font-semibold">
                CREATE YOUR ACCOUNT
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Join AegisFlow
              </h2>

              <p className="text-slate-500 mt-2">
                Create your account and become part of our team.
              </p>

            </div>

            <form onSubmit={handleRegister} className="space-y-4">

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>

                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <Mail
                    size={19}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600"
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />
                    }
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                  {error}
                </p>
              )}

              {/* Success message */}
              {success && (
                <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                  {success}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !!success}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20 disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}

                {!loading && <ArrowRight size={19} />}
              </button>

            </form>

            <div className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-emerald-700 font-bold hover:text-emerald-900"
              >
                Sign in
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 mt-7">
              Protected workspace · Your journey matters
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Register