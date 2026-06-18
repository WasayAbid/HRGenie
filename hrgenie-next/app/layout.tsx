import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Nav } from '@/components/nav'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  title: 'HRGenie — AI HR Intelligence',
  description: 'Predict attrition, screen candidates, generate documents, and get policy answers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-[#09090B] text-zinc-50">
        <Nav />
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  )
}
