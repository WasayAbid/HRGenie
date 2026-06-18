'use client'

import { useEffect, useState } from 'react'
import { getCandidates } from '@/lib/api'
import { FadeUp } from '@/components/motion-wrapper'
import { PageBg, PageHeader, Skeleton, RiskBadge } from '@/components/ui'

export default function Recruitment() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCandidates().then(setCandidates).catch(() => setCandidates([])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="Candidate Pipeline" title="Recruitment" subtitle="Candidates processed via the Python recruitment module." />
        </FadeUp>

        {loading ? (
          <div className="space-y-2">{[...Array(6)].map((_, i) => <Skeleton key={i} className="h-11" />)}</div>
        ) : candidates.length === 0 ? (
          <FadeUp>
            <div className="glow-card p-16 text-center">
              <p className="text-zinc-500 text-sm">No candidates in the pipeline yet.</p>
              <p className="text-zinc-600 text-xs mt-1.5">Upload resumes via the Streamlit recruitment module to see data here.</p>
            </div>
          </FadeUp>
        ) : (
          <FadeUp delay={0.05}>
            <div className="glow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f23]">
                    {['Name','Email','Skills','Exp','Score'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c, i) => (
                    <tr key={i} className="border-b border-[#1a1a1d] last:border-0 hover:bg-indigo-500/[0.03] transition-colors">
                      <td className="px-5 py-3 text-zinc-200 font-medium">{c.name ?? '—'}</td>
                      <td className="px-5 py-3 text-zinc-500 text-xs">{c.email ?? '—'}</td>
                      <td className="px-5 py-3 text-zinc-600 text-xs max-w-[180px] truncate">{c.skills ?? '—'}</td>
                      <td className="px-5 py-3 text-zinc-500 tabular-nums">{c.experience_years ?? '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-indigo-300 font-semibold tabular-nums text-xs">{c.match_score ?? 0}</span>
                          <RiskBadge level={(c.match_score ?? 0) >= 70 ? 'high' : (c.match_score ?? 0) >= 40 ? 'medium' : 'low'} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  )
}
