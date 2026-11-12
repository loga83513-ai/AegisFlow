
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  BrainCircuit,
  ChartNoAxesCombined,
  Ticket,
  Clock3,
  Users,
  Sparkles,
  CheckCircle2,
  Headset,
  Activity,
  Target,
  TrendingUp
} from 'lucide-react'

import { Link } from 'react-router-dom'
import aiRobot from '../assets/images/ai-robot.png'
import dashboardIllustration from '../assets/images/dashboard-illustration.png'
import { useEffect, useState } from 'react'
import api from '../services/api'

function Home() {
  const features = [
    {
      icon: BrainCircuit,
      title: 'AI Ticket Classification',
      description: 'Automatically analyze and categorize support tickets with intelligent AI.',
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      icon: Zap,
      title: 'Smart Priority Detection',
      description: 'Identify urgent issues and prioritize tickets for faster resolution.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Clock3,
      title: 'SLA Monitoring',
      description: 'Monitor response deadlines and track service-level performance.',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Manage agents, assign tickets and monitor team productivity.',
      color: 'bg-violet-50 text-violet-600'
    }
  ]

  const [homepageStats, setHomepageStats] = useState(null)
const [statsLoading, setStatsLoading] = useState(true)
const [statsError, setStatsError] = useState(false)

useEffect(() => {
  const fetchHomepageStats = async () => {
    try {
      const response = await api.get('/tickets/public-homepage-stats/')

      setHomepageStats(response.data)
      setStatsError(false)
    } catch (error) {
      console.error('Homepage stats error:', error)
      setStatsError(true)
    } finally {
      setStatsLoading(false)
    }
  }

  fetchHomepageStats()
}, [])
const stats = [
  {
    title: 'Total Tickets',
    value: homepageStats?.total_tickets,
    icon: Ticket,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Resolved',
    value: homepageStats?.resolved_tickets,
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    title: 'Critical Tickets',
    value: homepageStats?.critical_tickets,
    icon: Activity,
    color: 'bg-orange-50 text-orange-600',
  },
  {
    title: 'Active Users',
    value: homepageStats?.active_users,
    icon: Users,
    color: 'bg-violet-50 text-violet-600',
  },
]
  function AnimatedText({ text, className = '', delay = 0 }) {
  return (
    <span className={className}>
      {Array.from(text).map((letter, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{
            animationDelay: `${delay + index * 0.045}s`,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  )
}

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-800">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          <Link to="/" className="flex items-center gap-2.5">
            <div className="rounded-xl bg-emerald-500 p-2 text-white shadow-md shadow-emerald-200">
              <ShieldCheck size={23} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Aegis<span className="text-emerald-500">Flow</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-500 md:flex">
            <a href="#home" className="text-emerald-600">Home</a>
            <a href="#features" className="transition hover:text-emerald-600">Features</a>
            <a href="#about" className="transition hover:text-emerald-600">About</a>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold transition hover:border-emerald-400 hover:text-emerald-600"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-600"
            >
              Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>


      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50/70 to-teal-50/60"
      >
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-teal-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 lg:px-8 lg:py-14">


          {/* LEFT CONTENT */}
          <div className="hero-subtitle text-slate-600 ...">


            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-2 text-[11px] font-bold tracking-wide text-emerald-700 shadow-sm">
              <Sparkles size={14} />
              AI-SUPPORTING SYSTEM
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-900 sm:text-5xl xl:text-[62px]">
              Manage Support.
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                Think Smarter.
              </span>
              <br />
              Resolve Faster.
            </h1>
           <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
  <AnimatedText text="Build Smarter." />
  <br />
  <AnimatedText
    text="Work Faster."
    className="text-emerald-600"
    delay={0.3}
  />
</h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Transform your service operations with AI-powered ticket
              classification, intelligent prioritization and seamless
              team collaboration.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="group flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition duration-300 hover:-translate-y-1 hover:bg-emerald-600"
              >
                Get Started
                <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
              >
                Sign In
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                AI-powered insights
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                Real-time monitoring
              </span>
            </div>

            {/* TRUST STATS */}
            <div className="mt-8 grid max-w-md grid-cols-3 border-t border-emerald-100 pt-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">AI</h3>
                <p className="mt-1 text-[11px] text-slate-500">Smart Analysis</p>
              </div>
              <div className="border-x border-emerald-100 px-5">
                <h3 className="text-xl font-extrabold text-slate-900">24/7</h3>
                <p className="mt-1 text-[11px] text-slate-500">Ticket Tracking</p>
              </div>
              <div className="pl-5">
                <h3 className="text-xl font-extrabold text-slate-900">360°</h3>
                <p className="mt-1 text-[11px] text-slate-500">Team Visibility</p>
              </div>
            </div>
          </div>

          {/* RIGHT DASHBOARD */}
         <div className="hero-subtitle text-slate-600 ...">


            <div className="absolute inset-8 rounded-full bg-emerald-200/50 blur-3xl" />

            <div className="relative rounded-3xl border border-white bg-white/95 p-3 shadow-2xl shadow-emerald-900/10 sm:p-4">

              {/* Illustration */}
              <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 sm:h-36">
                <img
                  src={dashboardIllustration}
                  alt="AegisFlow dashboard illustration"
                  className="h-full w-full object-contain p-2"
                  loading="lazy"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-2.5 py-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold text-emerald-700">System Active</span>
                </div>
              </div>

              {/* DASHBOARD HEADER */}
              <div className="mb-3 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                    <ChartNoAxesCombined size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Welcome back</p>
                    <h2 className="text-sm font-bold text-slate-800">Employee Dashboard</h2>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-600">
                  Overview
                </span>
              </div>

              {/* STAT CARDS */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {stats.map((item) => {

                  const Icon = item.icon

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-slate-100 bg-white p-3 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                    >
                      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${item.color}`}>
                        <Icon size={17} />
                      </div>
                      <p className="text-[10px] font-medium text-slate-500">{item.title}</p>
                      <h3 className="mt-0.5 text-xl font-extrabold text-slate-800">{item.value}</h3>
                    </div>
                  )
                  {statsLoading
  ? '...'
  : statsError
    ? '—'
    : (stat.value ?? 0).toLocaleString()}
                })}
              </div>

              {/* AI ASSISTANT */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                  <img
                    src={aiRobot}
                    alt="AI Assistant Robot"
                    className="h-14 w-14 object-contain animate-[float_3s_ease-in-out_infinite]"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-800">AI Smart Assistant</h3>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                      ACTIVE
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-5 text-slate-600">
                    Analyzes tickets, detects priority and helps resolve issues faster.
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                    <Sparkles size={11} /> AI assistance enabled
                  </p>
                </div>
              </div>
            </div>

            {/* SMALL FLOATING STATUS */}
            <div className="absolute -right-2 top-10 hidden items-center gap-2 rounded-xl border border-white bg-white px-3 py-2 shadow-lg sm:flex lg:-right-5">
              <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
                <TrendingUp size={17} />
              </div>
              <div>
                <p className="text-[9px] text-slate-400">Performance</p>
                <p className="text-xs font-bold text-slate-800">Optimized</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px]">

          <div className="mb-8 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Powerful Features
              </span>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Everything Your Support Team Needs
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Smart tools to simplify ticket management, improve productivity
              and deliver better support experiences.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
                >
                  <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${feature.color} transition-transform duration-300 group-hover:scale-105`}>
                    <Icon size={23} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-6 text-slate-500">{feature.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                    Learn more <ArrowRight size={13} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-emerald-50/70 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 md:grid-cols-2">

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Built for better support
            </span>
            <h2 className="mt-2 max-w-xl text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
              Make Every Support Interaction Smarter
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
              Bring employees, support agents and management together
              with an intelligent platform designed to simplify service operations.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <Target size={23} className="mb-3 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-800">Accuracy</h3>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">Smarter classification</p>
            </div>
            <div className="rounded-xl border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <Activity size={23} className="mb-3 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-800">Efficiency</h3>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">Faster resolution</p>
            </div>
            <div className="rounded-xl border border-white bg-white p-3.5 shadow-sm sm:p-4">
              <Headset size={23} className="mb-3 text-violet-500" />
              <h3 className="text-sm font-bold text-slate-800">Teamwork</h3>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">Connected teams</p>
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 text-center shadow-lg shadow-emerald-200/60 sm:flex-row sm:px-10 sm:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Ready to Transform Your Support?
            </h2>
            <p className="mt-2 text-sm text-emerald-50">
              Simplify ticket management and empower your support team with AegisFlow.
            </p>
          </div>
          <Link
            to="/register"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-700 transition hover:-translate-y-0.5 hover:bg-emerald-50"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 sm:flex-row">
          <Link to="/" className="text-lg font-extrabold text-slate-900">
            Aegis<span className="text-emerald-500">Flow</span>
          </Link>
          <p className="text-center text-xs text-slate-400">
            © 2026 AegisFlow. Intelligent Service Management.
          </p>
          <p className="text-xs font-semibold text-emerald-600">
            Smarter Support. Better Experiences.
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Home
