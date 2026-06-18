'use client'

import { useEffect, useState } from 'react'
import { getCIOReport, getCandidates } from '@/lib/api'
import { FadeUp, StaggerContainer, StaggerItem } from '@/components/motion-wrapper'
import { PageBg, PageHeader, StatCard, Skeleton, PrimaryButton, CopyButton } from '@/components/ui'

export default function CIOReport() {
  const [data, setData] = useState<{ total_candidates: number; avg_score: number } | null>(null)
  const [highMatch, setHighMatch] = useState(0)
  const [report, setReport] = useState('')
  const [loadingData, setLoadingData] = useState(true)
  const [loadingReport, setLoadingReport] = useState(false)

  useEffect(() => {
    Promise.all([getCIOReport(), getCandidates()])
      .then(([cio, cands]) => { setData({ total_candidates: cio.total_candidates, avg_score: cio.avg_score }); setHighMatch(cands.filter((c: any) => (c.match_score ?? 0) >= 70).length) })
      .catch(() => setData({ total_candidates: 0, avg_score: 0 }))
      .finally(() => setLoadingData(false))
  }, [])

  async function generate() {
    setLoadingReport(true); setReport('')
    try { const cio = await getCIOReport(); setReport(cio.report) }
    catch { setReport('Failed to generate. Make sure the API server is running.') }
    finally { setLoadingReport(false) }
  }

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="Executive Intelligence" title="CIO Reporting" subtitle="AI-generated recruitment intelligence for executive review." />
        </FadeUp>

        {loadingData ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">{[0,1,2].map(i => <Skeleton key={i} className="h-24" />)}</div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <StaggerItem><StatCard label="Total Candidates" value={data?.total_candidates ?? 0} /></StaggerItem>
            <StaggerItem><StatCard label="Avg Match Score" value={(data?.avg_score ?? 0).toFixed(1)} accent /></StaggerItem>
            <StaggerItem><StatCard label="High Match ≥70%" value={highMatch} /></StaggerItem>
          </StaggerContainer>
        )}

        <FadeUp delay={0.1}>
          <div className="flex items-center gap-4 mb-8">
            <PrimaryButton onClick={generate} disabled={loadingReport}>
              {loadingReport ? 'Generating…' : '✦ Generate CIO Report'}
            </PrimaryButton>
            <span className="text-xs text-zinc-600">Powered by Gemini</span>
          </div>
        </FadeUp>

        {loadingReport && <FadeUp><Skeleton className="h-64" /></FadeUp>}

        {report && !loadingReport && (
          <FadeUp delay={0.05}>
            <div className="glow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">CIO Report</span>
                </div>
                <CopyButton text={report} />
              </div>
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed p-6 font-sans">{report}</pre>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  )
}
