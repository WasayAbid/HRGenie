'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

const spring = { type: 'spring' as const, stiffness: 350, damping: 35, mass: 1 }

export function FadeUp({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div initial={reduced ? {} : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay }} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div variants={reduced ? {} : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 35 } } }} className={className}>
      {children}
    </motion.div>
  )
}

export function HoverCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div whileHover={reduced ? {} : { y: -2 }} transition={spring} className={className}>
      {children}
    </motion.div>
  )
}
