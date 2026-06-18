'use client'

import { useState } from 'react'
import { generateOffer } from '@/lib/api'
import { FadeUp } from '@/components/motion-wrapper'
import { PageBg, PageHeader, PrimaryButton, CopyButton } from '@/components/ui'

const inp = 'input-field w-full bg-[#0d0d0f] border border-[#27272A] rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-700 outline-none transition-all duration-200'
const lbl = 'text-xs text-zinc-500 uppercase tracking-widest mb-2 block'

export default function OfferLetter() {
  const [form, setForm] = useState({ name: '', position: '', department: '', salary: '', date: '' })
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function generate() {
    if (!form.name || !form.position || !form.department || !form.salary) { setError('Fill in all fields.'); return }
    setError(''); setLoading(true); setOutput('')
    try { const { offer_letter } = await generateOffer({ ...form, date: form.date || new Date().toISOString().split('T')[0] }); setOutput(offer_letter) }
    catch { setError('Failed to generate. Make sure the API server is running.') }
    finally { setLoading(false) }
  }

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        <FadeUp>
          <PageHeader eyebrow="AI Document" title="Offer Letter Generator" subtitle="Personalised offer letters with one click." />
        </FadeUp>

        <FadeUp delay={0.08}>
          <div className="glow-card p-6 mb-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div><label className={lbl}>Candidate Name</label><input className={inp} placeholder="e.g. Sara Ahmed" value={form.name} onChange={e => set('name', e.target.value)} /></div>
              <div><label className={lbl}>Position</label><input className={inp} placeholder="e.g. Product Manager" value={form.position} onChange={e => set('position', e.target.value)} /></div>
              <div><label className={lbl}>Department</label><input className={inp} placeholder="e.g. Product" value={form.department} onChange={e => set('department', e.target.value)} /></div>
              <div><label className={lbl}>Salary (PKR / month)</label><input className={inp} placeholder="e.g. 120,000" value={form.salary} onChange={e => set('salary', e.target.value)} /></div>
            </div>
            <div><label className={lbl}>Joining Date</label><input type="date" className={inp} value={form.date} onChange={e => set('date', e.target.value)} /></div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <PrimaryButton onClick={generate} disabled={loading}>
              {loading ? 'Generating…' : '✦ Generate Offer Letter'}
            </PrimaryButton>
          </div>
        </FadeUp>

        {output && (
          <FadeUp delay={0.05}>
            <div className="glow-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#1f1f23]">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-indigo-400" />
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500">Generated Offer Letter</span>
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
