'use client'

import { useEffect, useState } from 'react'
import { getCandidates } from '@/lib/api'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
import { PageBg, PageHeader, StatCard, Skeleton, RiskBadge, Bar } from '@/components/ui'

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCandidates().then(setCandidates).catch(() => setCandidates([])).finally(() => setLoading(false))
  }, [])

  const total = candidates.length
  const avg = total > 0 ? Math.round(candidates.reduce((s, c) => s + (c.match_score ?? 0), 0) / total) : 0
  const high = candidates.filter(c => (c.match_score ?? 0) >= 70).length
  const top10 = [...candidates].sort((a, b) => (b.match_score ?? 0) - (a.match_score ?? 0)).slice(0, 10)

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="Overview" title="Executive Dashboard" subtitle="Recruitment pipeline at a glance." />
        </FadeUp>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            {[0,1,2].map(i => <Skeleton key={i} className="h-24" />)}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <StaggerItem><StatCard label="Total Candidates" value={total} /></StaggerItem>
            <StaggerItem><StatCard label="Avg Match Score" value={`${avg}%`} accent /></StaggerItem>
            <StaggerItem><StatCard label="High Match ≥70%" value={high} /></StaggerItem>
          </StaggerContainer>
        )}

        <FadeUp delay={0.1}>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">Top Candidates</p>
          </div>

          {loading ? (
            <div className="space-y-2">{[...Array(5)].map((_, i) => <Skeleton key={i} className="h-11" />)}</div>
          ) : top10.length === 0 ? (
            <div className="glow-card p-16 text-center">
              <p className="text-zinc-500 text-sm">No candidates yet.</p>
              <p className="text-zinc-600 text-xs mt-1">Upload resumes via the Recruitment module.</p>
            </div>
          ) : (
            <div className="glow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f23]">
                    {['Name','Email','Score','Match','Level'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {top10.map((c, i) => (
                    <tr key={i} className="border-b border-[#1a1a1d] last:border-0 transition-all duration-150 hover:bg-indigo-500/[0.03] group">
                      <td className="px-5 py-3 text-zinc-200 font-medium">{c.name ?? '—'}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{c.email ?? '—'}</td>
                      <td className="px-5 py-3 text-indigo-300 tabular-nums font-semibold">{c.match_score ?? 0}</td>
                      <td className="px-5 py-3 w-36"><Bar value={c.match_score ?? 0} /></td>
                      <td className="px-5 py-3">
                        <RiskBadge level={(c.match_score ?? 0) >= 70 ? 'high' : (c.match_score ?? 0) >= 40 ? 'medium' : 'low'} />
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
