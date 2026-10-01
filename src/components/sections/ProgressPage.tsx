'use client'

import ChartPanel from '../ChartPanel'
import { addDays, todayKey } from '@/lib/dates'
import type { Data } from '@/lib/types'
import { PageHeader, Stat } from '../ui'

export default function ProgressPage({ data }: { data: Data }) {
  const today = todayKey()
  const last30 = Array.from({ length: 30 }, (_, i) => addDays(today, -i))
  const logged = last30.map((k) => data.days[k]).filter(Boolean)
  const avg = (xs: (number | undefined)[]) => {
    const ns = xs.filter((x): x is number => x !== undefined)
    return ns.length
      ? (ns.reduce((a, b) => a + b, 0) / ns.length).toFixed(1)
      : '—'
  }

  return (
    <>
      <PageHeader
        title="Progress"
        subtitle="Last 30 days at a glance, plus any graph you want"
      />
      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat
          label="Water goal"
          value={`${logged.filter((d) => d.water).length}/30`}
          tone="sky"
        />
        <Stat
          label="Alcohol-free"
          value={`${30 - logged.filter((d) => d.alcohol).length}/30`}
          tone="mint"
        />
        <Stat
          label="Avg eating"
          value={avg(logged.map((d) => d.mealScore))}
          tone="butter"
        />
        <Stat
          label="Avg mood"
          value={avg(logged.map((d) => d.mood))}
          tone="lavender"
        />
        <Stat
          label="Workout days"
          value={
            new Set(
              data.workouts
                .filter((w) => w.date >= last30[29])
                .map((w) => w.date)
            ).size
          }
          tone="peach"
        />
        <Stat
          label="Ride days"
          value={
            new Set(
              data.rides.filter((r) => r.date >= last30[29]).map((r) => r.date)
            ).size
          }
          tone="blush"
        />
      </div>
      <div className="grid gap-5 2xl:grid-cols-2">
        <ChartPanel data={data} title="Graph" />
        <ChartPanel data={data} title="Compare with" initialMetric="weight" />
      </div>
    </>
  )
}
