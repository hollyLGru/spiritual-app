'use client'

import {
  CalendarDays,
  Download,
  Dumbbell,
  Flower2,
  Moon,
  Sun,
  TrendingUp,
  Upload,
  Wallet,
} from 'lucide-react'
import { useRef, useState, type ComponentType } from 'react'
import { emptyData, setData, useData } from '@/lib/store'
import { todayKey } from '@/lib/dates'
import { Horseshoe } from './icons'
import CalendarPage from './sections/CalendarPage'
import CyclePage from './sections/CyclePage'
import ExercisePage from './sections/ExercisePage'
import MoneyPage from './sections/MoneyPage'
import ProgressPage from './sections/ProgressPage'
import RidingPage from './sections/RidingPage'
import TodayPage from './sections/TodayPage'
import { tones, type Tone } from './ui'

type Tab =
  | 'today'
  | 'exercise'
  | 'riding'
  | 'money'
  | 'cycle'
  | 'calendar'
  | 'progress'

const nav: {
  id: Tab
  label: string
  icon: ComponentType<{ size?: number; strokeWidth?: number }>
  tone: Tone
}[] = [
  { id: 'today', label: 'Today', icon: Sun, tone: 'butter' },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell, tone: 'mint' },
  { id: 'riding', label: 'Riding', icon: Horseshoe, tone: 'peach' },
  { id: 'money', label: 'Money', icon: Wallet, tone: 'sky' },
  { id: 'cycle', label: 'Cycle', icon: Moon, tone: 'blush' },
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, tone: 'lavender' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, tone: 'mint' },
]

export default function App() {
  const data = useData()
  const [tab, setTab] = useState<Tab>('today')
  const fileRef = useRef<HTMLInputElement>(null)

  if (!data) {
    return (
      <div className="text-muted grid min-h-screen place-items-center">
        <Flower2 className="text-blush-deep animate-spin" />
      </div>
    )
  }

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `bloom-backup-${todayKey()}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importBackup = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text())
      if (confirm('Replace everything in the app with this backup?'))
        setData({ ...emptyData(), ...parsed })
    } catch {
      alert("That file doesn't look like a Bloom backup.")
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
      <aside className="bg-cream/80 sticky top-0 z-20 border-b border-white/70 backdrop-blur lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0 lg:pb-6">
        <div className="flex items-center gap-2.5 px-5 pt-5 pb-3 lg:pt-8 lg:pb-6">
          <span className="from-blush to-lavender text-blush-deep grid size-10 place-items-center rounded-2xl bg-gradient-to-br">
            <Flower2 size={22} />
          </span>
          <span className="font-display text-2xl font-semibold">Bloom</span>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4">
          {nav.map(({ id, label, icon: Icon, tone }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex shrink-0 items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? `${tones[tone].bg} ${tones[tone].text} shadow-sm`
                    : 'text-muted hover:text-ink hover:bg-white/70'
                }`}
              >
                <Icon size={18} strokeWidth={2.2} />
                {label}
              </button>
            )
          })}
        </nav>
        <div className="mt-auto hidden gap-2 px-4 pt-6 lg:flex lg:flex-col">
          <p className="text-muted px-2 text-xs">
            Your data is saved in this browser. Download a backup now and then.
          </p>
          <button
            onClick={exportBackup}
            className="text-muted flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70"
          >
            <Download size={16} /> Download backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="text-muted flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/70"
          >
            <Upload size={16} /> Restore backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importBackup(f)
              e.target.value = ''
            }}
          />
        </div>
      </aside>

      <main className="flex-1 px-4 py-6 sm:px-8 lg:py-10">
        {tab === 'today' && <TodayPage data={data} />}
        {tab === 'exercise' && <ExercisePage data={data} />}
        {tab === 'riding' && <RidingPage data={data} />}
        {tab === 'money' && <MoneyPage data={data} />}
        {tab === 'cycle' && <CyclePage data={data} />}
        {tab === 'calendar' && <CalendarPage data={data} />}
        {tab === 'progress' && <ProgressPage data={data} />}
      </main>
    </div>
  )
}
