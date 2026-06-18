'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import clsx from 'clsx'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/attrition', label: 'Attrition' },
  { href: '/chatbot', label: 'Chatbot' },
  { href: '/jd-generator', label: 'Generate' },
  { href: '/cio-report', label: 'CIO Report' },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <header className="sticky top-0 z-50 w-full">
      {/* frosted bar */}
      <div className="backdrop-blur-md bg-[#09090B]/75 border-b border-[#ffffff08]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span className="text-sm font-semibold text-zinc-100 tracking-tight group-hover:text-white transition-colors">
              HRGenie
            </span>
            <span className="w-1 h-1 rounded-full bg-indigo-400 mb-2 group-hover:bg-indigo-300 transition-colors" />
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href} className="relative px-3 py-1.5 rounded-md group">
                  <span className={clsx(
                    'relative z-10 text-sm transition-colors duration-150',
                    active ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-200'
                  )}>
                    {label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md bg-[#1f1f23] border border-[#2a2a30]"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <Link href="/chatbot">
            <button className="relative overflow-hidden btn-shimmer bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/40 text-white rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 hover:shadow-[0_0_18px_rgba(99,102,241,0.28)]">
              <span className="relative z-10">Ask HRGenie</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  )
}
