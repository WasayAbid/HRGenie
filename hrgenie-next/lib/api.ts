const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const TIMEOUT = 90000

function fetchWithTimeout(url: string, opts: RequestInit = {}) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), TIMEOUT)
  return fetch(url, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(id))
}

export async function generateJD(data: { role: string; department: string; experience: string; skills: string }) {
  const res = await fetchWithTimeout(`${BASE}/jd/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  return res.json() as Promise<{ jd: string }>
}

export async function generateOffer(data: { name: string; position: string; department: string; salary: string; date: string }) {
  const res = await fetchWithTimeout(`${BASE}/offer/generate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  })
  return res.json() as Promise<{ offer_letter: string }>
}

export async function askChat(query: string) {
  const res = await fetchWithTimeout(`${BASE}/chat/ask`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query }),
  })
  return res.json() as Promise<{ answer: string }>
}

export async function getCIOReport() {
  const res = await fetchWithTimeout(`${BASE}/cio/report`)
  return res.json() as Promise<{ report: string; total_candidates: number; avg_score: number }>
}

export async function getAttrition() {
  const res = await fetchWithTimeout(`${BASE}/attrition/predict`)
  return res.json() as Promise<{ results: { employee_id: number; risk: number }[] }>
}

export async function getCandidates() {
  const res = await fetchWithTimeout(`${BASE}/candidates`)
  return res.json() as Promise<any[]>
}
