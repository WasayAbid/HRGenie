'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { PageBg, PrimaryButton } from '@/components/ui'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const spring = { type: 'spring' as const, stiffness: 350, damping: 35 }

interface Message { role: 'user' | 'assistant'; content: string }

function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <motion.div
        className="w-4 h-4 rounded-full border-2 border-indigo-500 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <span className="text-xs text-zinc-500 tracking-wide">HRGenie is thinking…</span>
    </div>
  )
}

function AssistantMessage({ content, streaming }: { content: string; streaming?: boolean }) {
  return (
    <div className="prose prose-sm prose-invert max-w-none
      prose-p:text-zinc-200 prose-p:leading-relaxed prose-p:my-1.5
      prose-strong:text-zinc-100 prose-strong:font-semibold
      prose-ul:text-zinc-300 prose-ul:my-1.5 prose-ul:pl-4
      prose-ol:text-zinc-300 prose-ol:my-1.5 prose-ol:pl-4
      prose-li:my-0.5
      prose-h1:text-zinc-100 prose-h1:text-base prose-h1:font-semibold prose-h1:mt-3 prose-h1:mb-1
      prose-h2:text-zinc-100 prose-h2:text-sm prose-h2:font-semibold prose-h2:mt-3 prose-h2:mb-1
      prose-h3:text-zinc-200 prose-h3:text-sm prose-h3:font-medium prose-h3:mt-2 prose-h3:mb-1
      prose-code:text-indigo-300 prose-code:bg-indigo-500/10 prose-code:px-1 prose-code:rounded
      prose-blockquote:border-l-indigo-500 prose-blockquote:text-zinc-400
      prose-hr:border-zinc-700">
      <ReactMarkdown>{content}</ReactMarkdown>
      {streaming && <span className="inline-block w-1.5 h-3.5 bg-indigo-400 rounded-sm ml-0.5 animate-pulse align-middle" />}
    </div>
  )
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `## Hi, I'm HRGenie\n\nI'm your AI-powered HR Assistant. Here's what I can help you with:\n\n- **Leave & Attendance** — leave policies, sick days, annual leave rules\n- **Work From Home** — WFH eligibility, approval process\n- **Promotions & Appraisals** — promotion criteria, performance reviews\n- **Recruitment** — job descriptions, offer letters, hiring process\n- **HR Documentation** — policies, contracts, onboarding\n\nJust type your question below and I'll answer based on your HR policy documents.`,
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingContent, loading])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = input.trim()
    if (!q || loading) return

    setInput('')
    setMessages(p => [...p, { role: 'user', content: q }])
    setLoading(true)
    setStreamingContent('')

    abortRef.current = new AbortController()

    try {
      const res = await fetch(`${BASE}/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''
      let firstChunk = true

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        full += chunk
        if (firstChunk) {
          setLoading(false)   // only hide spinner once text actually arrives
          firstChunk = false
        }
        setStreamingContent(full)
      }

      setMessages(p => [...p, { role: 'assistant', content: full }])
      setStreamingContent('')
    } catch (err: any) {
      setLoading(false)
      setStreamingContent('')
      if (err.name !== 'AbortError') {
        setMessages(p => [...p, { role: 'assistant', content: 'Something went wrong. Make sure the API server is running.' }])
      }
    }
  }

  return (
    <div className="relative">
      <PageBg />
      <div className="relative z-10 max-w-3xl mx-auto px-6 flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.05 }}
          className="pt-10 pb-6 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <p className="text-xs uppercase tracking-widest text-zinc-500">Policy Assistant</p>
          </div>
          <h1 className="text-[2rem] font-bold tracking-tight text-zinc-50">HRGenie Assistant</h1>
          <p className="text-zinc-500 text-sm mt-1.5">Ask anything about leave, policies, promotions, or hiring.</p>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-3 min-h-0 pb-2">

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'user' ? (
                  <div className="max-w-[78%] rounded-2xl rounded-br-sm px-4 py-3 text-sm bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-3 bg-[#111113] border border-[#1f1f23]">
                    <AssistantMessage content={m.content} />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Thinking indicator while waiting for first chunk */}
          {loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex justify-start">
              <div className="bg-[#111113] border border-indigo-500/20 rounded-2xl rounded-bl-sm">
                <ThinkingIndicator />
              </div>
            </motion.div>
          )}

          {/* Live streaming bubble */}
          {streamingContent && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={spring} className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-3 bg-[#111113] border border-[#1f1f23]">
                <AssistantMessage content={streamingContent} streaming />
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="py-4 shrink-0">
          <div className="flex gap-2 bg-[#111113] border border-[#27272A] focus-within:border-indigo-500/50 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.08)] rounded-xl p-1.5 transition-all duration-200">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask HRGenie…" disabled={loading}
              className="flex-1 bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none disabled:opacity-50" />
            <PrimaryButton type="submit" disabled={loading || !input.trim()} className="rounded-lg px-4 py-2 text-xs">
              {loading ? 'Thinking…' : 'Send'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  )
}
