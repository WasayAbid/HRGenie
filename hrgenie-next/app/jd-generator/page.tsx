'use client'

import { useState } from 'react'
import { generateJD } from '@/lib/api'
import { FadeUp } from '@/components/motion-wrapper'
import { PageBg, PageHeader, PrimaryButton, CopyButton } from '@/components/ui'

const inp = 'input-field w-full bg-[#0d0d0f] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none transition-all duration-200'
const lbl = 'text-xs text-zinc-500 uppercase tracking-widest mb-2 block'

export default function JDGenerator() {
  const [form, setForm] = useState({ role: '', department: '', experience: 'Fresh', skills: '' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function generate() {
    if (!form.role || !form.department || !form.skills) { setError('Fill in all fields.'); return }
    setError(''); setLoading(true); setOutput('')
    try { const { jd } = await generateJD(form); setOutput(jd) }
    catch { setError('Failed to generate. Make sure the API server is running.') }
    finally { setLoading(false) }
  }

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="AI Document" title="JD Generator" subtitle="Professional job descriptions in seconds." />
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="glow-card p-6 mb-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={lbl}>Job Role</label><input className={inp} placeholder="e.g. Senior Engineer" value={form.role} onChange={e => set('role', e.target.value)} /></div>
              <div><label className={lbl}>Department</label><input className={inp} placeholder="e.g. Engineering" value={form.department} onChange={e => set('department', e.target.value)} /></div>
            </div>
            <div>
              <label className={lbl}>Experience</label>
              <select className={inp} value={form.experience} onChange={e => set('experience', e.target.value)}>
                {['Fresh','1-3 Years','3-5 Years','5+ Years'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Required Skills</label>
              <textarea className={`${inp} resize-none`} rows={3} placeholder="e.g. React, TypeScript, Node.js" value={form.skills} onChange={e => set('skills', e.target.value)} />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <PrimaryButton onClick={generate} disabled={loading}>
              {loading ? 'Generating…' : '✦ Generate JD'}
            </PrimaryButton>
          </div>
        </FadeUp>

        {output && (
          <FadeUp delay={0.05}>
            <div className="glow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Generated JD</span>
                </div>
                <CopyButton text={output} />
              </div>
              <pre className="whitespace-pre-wrap text-sm text-zinc-300 leading-relaxed p-5 font-sans">{output}</pre>
            </div>
          </FadeUp>
        )}
      </div>
    </div>
  )
}
