'use client'

import { useEffect, useState } from 'react'
import { getAttrition } from '@/lib/api'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
import { PageBg, PageHeader, StatCard, Skeleton, RiskBadge } from '@/components/ui'
import { motion } from 'framer-motion'

const spring = { type: 'spring' as const, stiffness: 350, damping: 35 }

export default function Attrition() {
  const [results, setResults] = useState<{ employee_id: number; risk: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttrition().then(d => setResults(d.results ?? [])).catch(() => setResults([])).finally(() => setLoading(false))
  }, [])

  const total = results.length
  const avgRisk = total > 0 ? (results.reduce((s, r) => s + r.risk, 0) / total).toFixed(1) : '0'
  const high = results.filter(r => r.risk > 70).length
  const maxRisk = results.length > 0 ? Math.max(...results.map(r => r.risk)) : 0
  const low = results.filter(r => r.risk < 30).length
  const medium = results.filter(r => r.risk >= 30 && r.risk <= 70).length
  const top10 = [...results].sort((a, b) => b.risk - a.risk).slice(0, 10)

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="ML Predictions" title="Attrition Risk Dashboard" subtitle="Risk scores from the trained IBM attrition model." />
        </FadeUp>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">{[0,1,2,3].map(i => <Skeleton key={i} className="h-24" />)}</div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
            <StaggerItem><StatCard label="Total Employees" value={total} /></StaggerItem>
            <StaggerItem><StatCard label="High Risk" value={high} accent /></StaggerItem>
            <StaggerItem><StatCard label="Avg Risk" value={`${avgRisk}%`} /></StaggerItem>
            <StaggerItem><StatCard label="Max Risk" value={`${maxRisk.toFixed(1)}%`} /></StaggerItem>
          </StaggerContainer>
        )}

        {/* Distribution */}
        <FadeUp delay={0.08}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">Risk Distribution</p>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-12">
            {[
              { label: 'Low Risk', value: low, color: 'text-emerald-400', bar: 'bg-emerald-500', sub: '< 30%' },
              { label: 'Medium Risk', value: medium, color: 'text-amber-400', bar: 'bg-amber-500', sub: '30 – 70%' },
              { label: 'High Risk', value: high, color: 'text-red-400', bar: 'bg-red-500', sub: '> 70%' },
            ].map(b => (
              <div key={b.label} className="glow-card p-5">
                <div className={`text-3xl font-bold tabular-nums ${b.color}`}>{b.value}</div>
                <div className="text-xs uppercase tracking-wide text-zinc-500 mt-1.5">{b.label}</div>
                <div className="text-[10px] text-zinc-700 mt-0.5">{b.sub}</div>
                <div className="mt-3 h-0.5 bg-[#27272A] rounded-full overflow-hidden">
                  <motion.div className={`h-full ${b.bar} rounded-full`} initial={{ width: 0 }} animate={{ width: total ? `${(b.value/total)*100}%` : '0%' }} transition={{ ...spring, delay: 0.3 }} />
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Table */}
        <FadeUp delay={0.14}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">Top 10 Highest-Risk</p>
          </div>
          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-11" />)}</div>
          ) : (
            <div className="glow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f23]">
                    {['Employee ID','Risk','Bar','Level'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {top10.map(r => (
                    <tr key={r.employee_id} className="border-b border-[#1a1a1d] last:border-0 hover:bg-indigo-500/[0.03] transition-colors">
                      <td className="px-5 py-3 text-zinc-400 font-mono text-xs">#{r.employee_id}</td>
                      <td className="px-5 py-3 font-semibold tabular-nums text-indigo-300">{r.risk.toFixed(1)}%</td>
                      <td className="px-5 py-3 w-44">
                        <div className="h-1 bg-[#27272A] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${r.risk > 70 ? 'bg-red-500' : r.risk >= 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            initial={{ width: 0 }} animate={{ width: `${r.risk}%` }} transition={spring}
                          />
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <RiskBadge level={r.risk > 70 ? 'high' : r.risk >= 30 ? 'medium' : 'low'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FadeUp>
      </div>
    </div>
  )
}
