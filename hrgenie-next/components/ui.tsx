'use client'

import { ReactNode, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const spring = { type: 'spring' as const, stiffness: 350, damping: 35, mass: 1 }

/* ── Buttons ─────────────────────────────────────────────── */

export function PrimaryButton({ children, onClick, disabled, type = 'button', className = '' }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduced ? {} : { scale: 0.97 }}
      transition={spring}
      className={`relative overflow-hidden inline-flex items-center gap-2
        bg-indigo-600 hover:bg-indigo-500
        border border-indigo-500/40
        text-white text-sm font-medium tracking-[-0.01em]
        px-5 py-2.5 rounded-lg
        transition-all duration-200
        hover:shadow-[0_0_22px_rgba(99,102,241,0.28)]
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        btn-shimmer
        ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  )
}

export function GhostButton({ children, onClick, disabled, type = 'button', className = '' }: {
  children: ReactNode; onClick?: () => void; disabled?: boolean; type?: 'button' | 'submit'; className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileTap={reduced ? {} : { scale: 0.97 }}
      transition={spring}
      className={`relative overflow-hidden inline-flex items-center gap-2
        bg-transparent hover:bg-[#18181B]
        border border-[#27272A] hover:border-[#3F3F46]
        text-zinc-400 hover:text-zinc-200 text-sm font-medium
        px-5 py-2.5 rounded-lg
        transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </motion.button>
  )
}

/* ── Page background (dot grid + glow) ──────────────────── */

export function PageBg() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(63,63,70,0.4) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 20%, transparent 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed z-0"
        style={{
          top: '-160px', left: '50%', transform: 'translateX(-50%)',
          width: '800px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.065) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />
    </>
  )
}

/* ── Page header ─────────────────────────────────────────── */

export function PageHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-1 h-1 rounded-full bg-indigo-400" />
        <p className="text-xs uppercase tracking-widest text-zinc-500">{eyebrow}</p>
      </div>
      <h1 className="text-[2rem] font-bold tracking-tight text-zinc-50 leading-tight">{title}</h1>
      {subtitle && <p className="text-zinc-400 text-sm mt-2">{subtitle}</p>}
    </div>
  )
}

/* ── Stat card ───────────────────────────────────────────── */

export function StatCard({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="glow-card p-5">
      <div className={`text-2xl font-bold tabular-nums leading-none ${accent ? 'text-indigo-300' : 'text-zinc-50'}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-zinc-500 mt-2">{label}</div>
    </div>
  )
}

/* ── Skeleton ────────────────────────────────────────────── */

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[#1f1f23] rounded-xl ${className}`} />
}

/* ── Risk badge ──────────────────────────────────────────── */

export function RiskBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const map = {
    high:   'bg-red-500/8 text-red-400 border-red-500/20',
    medium: 'bg-amber-500/8 text-amber-400 border-amber-500/20',
    low:    'bg-emerald-500/8 text-emerald-400 border-emerald-500/20',
  }
  return (
    <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-md border font-medium ${map[level]}`}>
      {level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

/* ── Score badge ─────────────────────────────────────────── */

export function ScoreBadge({ score }: { score: number }) {
  const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low'
  return <RiskBadge level={level} />
}

/* ── Thin progress bar ───────────────────────────────────── */

export function Bar({ value, color = 'bg-indigo-500' }: { value: number; color?: string }) {
  return (
    <div className="h-1 bg-[#27272A] rounded-full overflow-hidden w-full">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ ...spring, delay: 0.1 }}
      />
    </div>
  )
}

/* ── Copy button ─────────────────────────────────────────── */

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      className="text-xs text-zinc-500 hover:text-indigo-400 transition-colors duration-150 flex items-center gap-1"
    >
      {copied ? <><CheckIcon />Copied</> : <><ClipIcon />Copy</>}
    </button>
  )
}

function ClipIcon() {
  return <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
}

function CheckIcon() {
  return <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
}
