'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, animate } from 'framer-motion'
import { StaggerContainer, StaggerItem, HoverCard } from '@/components/motion-wrapper'

const spring = { type: 'spring' as const, stiffness: 350, damping: 35, mass: 1 }

/* ── count-up ── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    const c = animate(0, target, { duration: 1.4, ease: [0.16, 1, 0.3, 1], onUpdate: v => setN(Math.round(v)) })
    return c.stop
  }, [target])
  return <span>{n.toLocaleString()}{suffix}</span>
}

/* ── mini bar chart data ── */
const chartBars = [
  { id: 1023, risk: 84, color: '#ef4444' },
  { id: 1045, risk: 71, color: '#f87171' },
  { id: 1102, risk: 58, color: '#fbbf24' },
  { id: 1078, risk: 43, color: '#fcd34d' },
  { id: 1156, risk: 29, color: '#34d399' },
  { id: 1089, risk: 18, color: '#34d399' },
  { id: 1201, risk: 11, color: '#6ee7b7' },
]

/* ── activity feed ── */
const activity = [
  { icon: '⚠', label: 'Emp #1023', detail: '84% attrition risk detected', time: 'just now', dot: 'bg-red-500' },
  { icon: '✓', label: 'Offer sent', detail: 'Ali Hassan — Sr. Engineer', time: '2m ago', dot: 'bg-emerald-500' },
  { icon: '◆', label: 'JD generated', detail: 'Product Manager · Engineering', time: '5m ago', dot: 'bg-indigo-400' },
  { icon: '◎', label: '91% match', detail: 'Ayesha Siddiqui shortlisted', time: '9m ago', dot: 'bg-indigo-400' },
]

/* ── hero panel ── */
function HeroPanel() {
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  useEffect(() => { const t = setTimeout(() => setVisible(true), 300); return () => clearTimeout(t) }, [])

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay: 0.2 }}
      className="bg-[#111113] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl"
    >
      {/* Panel top bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1f1f23] bg-[#0f0f11]">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-300">HRGenie</span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-zinc-500">Dashboard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs text-emerald-500">Live</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 divide-x divide-[#1f1f23] border-b border-[#1f1f23]">
        {[
          { label: 'Employees', value: 1470, suffix: '' },
          { label: 'At-Risk', value: 237, suffix: '' },
          { label: 'Avg Match', value: 74, suffix: '%' },
        ].map(m => (
          <div key={m.label} className="px-4 py-3.5">
            <div className="text-lg font-bold text-zinc-100 tabular-nums leading-none">
              <CountUp target={m.value} suffix={m.suffix} />
            </div>
            <div className="text-xs text-zinc-600 mt-1">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Mini attrition chart */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1f1f23]">
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Attrition Risk — Top Employees</p>
        <div className="flex items-end gap-1.5 h-14">
          {chartBars.map((b, i) => (
            <motion.div
              key={b.id}
              className="flex-1 rounded-sm relative group"
              style={{ height: `${b.risk}%`, backgroundColor: b.color, opacity: 0.85, transformOrigin: 'bottom' }}
              initial={reduced ? {} : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ ...spring, delay: 0.5 + i * 0.06 }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-[#1f1f23] text-zinc-300 text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
                #{b.id} · {b.risk}%
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-zinc-700">Highest risk</span>
          <span className="text-[10px] text-zinc-700">Lowest risk</span>
        </div>
      </div>

      {/* Activity feed */}
      <div className="px-5 py-4">
        <p className="text-xs text-zinc-600 uppercase tracking-widest mb-3">Recent Activity</p>
        <div className="space-y-3">
          {activity.map((a, i) => (
            <motion.div
              key={i}
              initial={reduced ? {} : { opacity: 0, x: -6 }}
              animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
              transition={{ ...spring, delay: 0.7 + i * 0.15 }}
              className="flex items-start gap-3"
            >
              <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${a.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-xs font-medium text-zinc-300 truncate">{a.label}</span>
                  <span className="text-[10px] text-zinc-600 shrink-0">{a.time}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 truncate">{a.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── features ── */
const features = [
  { href: '/attrition', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>, title: 'Attrition Prediction', desc: 'ML-powered risk scoring across your entire workforce.' },
  { href: '/chatbot', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>, title: 'AI Chatbot', desc: 'Instant policy answers using RAG over your HR docs.' },
  { href: '/jd-generator', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>, title: 'JD Generator', desc: 'AI-written job descriptions in seconds, export as PDF.' },
  { href: '/offer-letter', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>, title: 'Offer Letters', desc: 'Professional, personalised offer letters with one click.' },
  { href: '/cio-report', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>, title: 'CIO Reports', desc: 'Executive-grade hiring intelligence, ready to present.' },
  { href: '/recruitment', icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>, title: 'Recruitment', desc: 'Resume parsing and match scoring against job descriptions.' },
]

export default function Home() {
  return (
    <div className="relative">
      {/* ── Background: dot grid ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(63,63,70,0.45) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 30%, transparent 100%)',
        }}
      />
      {/* ── Background: indigo glow ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed z-0"
        style={{
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* ── Hero ── */}
        <section className="pt-24 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <StaggerContainer>
            <StaggerItem>
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">AI-Powered HR Intelligence</p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="text-5xl font-extrabold tracking-tight leading-[1.08] text-zinc-50">
                The HR platform that{' '}
                <span className="text-indigo-400">thinks</span> ahead.
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-zinc-400 text-lg mt-5 leading-relaxed">
                Predict attrition, screen candidates, generate documents, and get policy answers — all in one intelligent workspace.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="flex items-center gap-3 mt-8">
                <Link href="/dashboard">
                  <button className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150">
                    Explore Dashboard
                  </button>
                </Link>
                <Link href="/chatbot">
                  <button className="border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#18181B] text-zinc-300 rounded-lg px-5 py-2.5 text-sm transition-all duration-150">
                    Ask HRGenie
                  </button>
                </Link>
              </div>
            </StaggerItem>
          </StaggerContainer>

          {/* Right — HR system mockup */}
          <HeroPanel />
        </section>

        {/* ── Divider ── */}
        <div className="border-t border-[#18181B]" />

        {/* ── Features ── */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: 0.1 }}
          >
            <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Everything in one place</p>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50 mb-12">Everything HR needs, unified.</h2>
          </motion.div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => (
              <StaggerItem key={f.href}>
                <Link href={f.href} className="block h-full">
                  <HoverCard className="h-full bg-[#18181B] border border-[#27272A] hover:border-[#3F3F46] rounded-xl p-6 transition-colors duration-150 cursor-pointer">
                    <div className="text-zinc-400 mb-4">{f.icon}</div>
                    <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                  </HoverCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 }}>
            <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-12 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-zinc-50 mb-3">Ready to transform your HR operations?</h2>
              <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">
                Start with the dashboard for an overview, or ask HRGenie a question right now.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/dashboard">
                  <button className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-5 py-2.5 text-sm font-medium transition-colors duration-150">
                    Open Dashboard
                  </button>
                </Link>
                <Link href="/chatbot">
                  <button className="border border-[#27272A] hover:border-[#3F3F46] hover:bg-[#111113] text-zinc-300 rounded-lg px-5 py-2.5 text-sm transition-all duration-150">
                    Ask a question
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
