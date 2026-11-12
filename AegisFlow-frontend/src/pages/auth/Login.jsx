
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'


import { Link, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  LockKeyhole,
  Eye as LookIcon
} from 'lucide-react'
import api from '../../services/api'
import welcomeAnimation from '../../assets/images/auth-welcome.lottie'
import successAnimation from '../../assets/images/auth-success.lottie'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [focusedField, setFocusedField] = useState('')
  const [isCelebrating, setIsCelebrating] = useState(false)
  const [videoStage, setVideoStage] = useState('welcome')
  const [dotLottie, setDotLottie] = useState(null)
  useEffect(() => {
  if (!dotLottie || videoStage !== 'success') return

  const handleComplete = () => {
    console.log('Success animation completed!')
    navigate('/dashboard')
  }

  dotLottie.addEventListener('complete', handleComplete)

  return () => {
    dotLottie.removeEventListener('complete', handleComplete)
  }
}, [dotLottie, videoStage, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()

    setError('')
    setLoading(true)
    setIsCelebrating(false)

    try {
      const response = await api.post('/accounts/login/', {
        username,
        password,
      })

      const { access, refresh, role } = response.data

      if (!access) {
        throw new Error('Access token was not returned by the server.')
      }

      localStorage.setItem('access_token', access)

      if (refresh) {
        localStorage.setItem('refresh_token', refresh)
      }

      login(role)

      // Character celebration before dashboard navigation
      // Play success video before dashboard navigation
setIsCelebrating(true)
setVideoStage('success')
    } catch (err) {
      const data = err.response?.data

      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        err.message ||
        'Login failed. Please check your username and password.'

      setError(
        typeof message === 'string'
          ? message
          : 'Invalid login credentials.'
      )
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

        {/* LEFT STORY SECTION */}
       <div className="relative bg-gradient-to-br from-emerald-50/90 via-white/80 to-teal-50/90 border-r border-emerald-100/70 text-slate-900 p-8 sm:p-12 flex flex-col justify-between overflow-hidden">

          <div className="absolute w-80 h-80 border border-emerald-300/10 rounded-full -right-28 -top-24" />

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-emerald-400/15 p-3 rounded-2xl">
                <ShieldCheck size={28} className="text-emerald-300" />
              </div>

              <h2 className="text-2xl font-bold">
                Aegis<span className="text-emerald-300">Flow</span>
              </h2>
            </div>

            {/* Story text */}
            <div className="mt-10 sm:mt-14">
              <p className="text-emerald-300 text-sm font-semibold tracking-[3px] uppercase">
                Your journey starts here
              </p>

              <h1 className="text-4xl sm:text-5xl font-bold leading-tight mt-5">
                Welcome back.
                <br />
                <span className="text-emerald-300">
                  Your team awaits.
                </span>
              </h1>

              <p className="text-emerald-50/70 mt-5 max-w-md leading-7">
                Step into a smarter workspace where every ticket,
                every conversation and every solution moves your
                team forward.
              </p>
            </div>
          </div>

          {/* CHARACTER SCENE */}
          <div className="relative z-10 flex flex-col items-center justify-center py-5">

            {/* Character reaction */}
            <div
              className={`
                relative w-full max-w-[330px] h-[260px]
                flex items-center justify-center
                character-entry
                ${focusedField === 'username' ? 'character-look' : ''}
                ${focusedField === 'password' ? 'character-shy' : ''}
                ${isCelebrating ? 'character-celebrate' : ''}
              `}
            >
<DotLottieReact
  key={videoStage}
  src={videoStage === 'success' ? successAnimation : welcomeAnimation}
  autoplay
  loop={videoStage === 'welcome'}
  dotLottieRefCallback={setDotLottie}
  style={{
    width: '100%',
    height: '100%',
  }}
/>
              {/* Username reaction */}
              {focusedField === 'username' && !isCelebrating && (
                <div className="absolute top-5 right-5 bg-white text-emerald-700 p-3 rounded-2xl shadow-xl animate-bounce">
                  <LookIcon size={23} />
                </div>
              )}

              {/* Password reaction */}
              {focusedField === 'password' && !isCelebrating && (
                <div className="absolute top-5 right-5 bg-white text-emerald-700 px-4 py-3 rounded-2xl shadow-xl animate-pulse">
                  🙈
                </div>
              )}

              {/* Show password reaction */}
              {focusedField === 'password' && showPassword && !isCelebrating && (
                <div className="absolute top-5 right-5 bg-white text-emerald-700 px-4 py-3 rounded-2xl shadow-xl animate-bounce">
                  👀
                </div>
              )}

              {/* Login success reaction */}
              {isCelebrating && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-5xl animate-bounce">
                    🎉✨
                  </div>
                </div>
              )}

            </div>

            <p className="text-emerald-700 text-sm font-medium mt-1 text-center">
  {isCelebrating
    ? 'Welcome AegisFlow! 🎉'
    : focusedField === 'username'
      ? 'Hey! I am looking at your details.'
      : focusedField === 'password'
        ? showPassword
          ? 'I can see your password now!'
          : 'Your password is safe with me!'
        : 'Ready to move forward with you.'}
</p>

          </div>

          {/* Bottom text */}
          <div className="relative z-10 flex items-center gap-3 text-sm text-emerald-100/70">
            <Sparkles size={17} className="text-emerald-300" />
            One workspace. Smarter possibilities.
          </div>

        </div>

        {/* RIGHT LOGIN FORM */}
       <div className="bg-white/55 backdrop-blur-xl p-8 sm:p-12 lg:p-14 flex flex-col justify-center">

          <div className="max-w-md w-full mx-auto">

            {/* Form heading */}
            <div className="mb-9">

              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5">
                <LockKeyhole className="text-emerald-600" size={24} />
              </div>

              <p className="text-emerald-600 text-sm font-semibold">
                YOUR SECURE WORKSPACE
              </p>

              <h2 className="text-3xl font-bold text-slate-900 mt-2">
                Sign in to AegisFlow
              </h2>

              <p className="text-slate-500 mt-2">
                Enter your details to continue your journey.
              </p>

            </div>

            <form onSubmit={handleLogin} className="space-y-5">

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none transition-all focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword
                      ? <EyeOff size={19} />
                      : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || isCelebrating}
                className="w-full flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-600/20 disabled:opacity-60"
              >
                {loading
                  ? 'Signing in...'
                  : isCelebrating
                    ? 'Welcome aboard!'
                    : 'Enter Workspace'}

                {!loading && !isCelebrating && (
                  <ArrowRight size={19} />
                )}
              </button>

            </form>

            {/* Register link */}
            <div className="mt-8 text-center text-sm text-slate-500">
              New to AegisFlow?{' '}

              <Link
                to="/register"
                className="text-emerald-700 font-bold hover:text-emerald-900"
              >
                Start your journey
              </Link>
            </div>

            <p className="text-center text-xs text-slate-400 mt-8">
              Protected workspace · Secure access
            </p>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
