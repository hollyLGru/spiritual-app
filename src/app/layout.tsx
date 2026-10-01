import type { Metadata } from 'next'
import { Fraunces, Quicksand } from 'next/font/google'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})

export const metadata: Metadata = {
  title: 'Bloom — daily tracker',
  description: 'Track your days, habits and progress',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${fraunces.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
