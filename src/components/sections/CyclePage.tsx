'use client'

import {
  ChevronLeft,
  ChevronRight,
  Droplet,
  History,
  Moon,
  Settings2,
} from 'lucide-react'
import { useState } from 'react'
import { flows, symptoms } from '@/lib/constants'
import { cycleInfo } from '@/lib/cycle'
import {
  addMonths,
  monthGrid,
  monthKey,
  prettyDate,
  prettyMonth,
  shortDate,
  todayKey,
} from '@/lib/dates'
import { update, updateDay } from '@/lib/store'
import type { Data, Flow } from '@/lib/types'
import {
  Button,
  Card,
  Chip,
  Empty,
  Field,
  NumberInput,
  PageHeader,
  Stat,
} from '../ui'

const flowStyle: Record<Flow, string> = {
  spotting: 'bg-blush/50 text-blush-deep',
  light: 'bg-blush text-blush-deep',
  medium: 'bg-blush-deep/70 text-white',
  heavy: 'bg-blush-deep text-white',
}

const nextFlow = (f?: Flow): Flow | undefined => {
  const order: (Flow | undefined)[] = [
    undefined,
    'light',
    'medium',
    'heavy',
    'spotting',
  ]
  return order[(order.indexOf(f) + 1) % order.length]
}

export default function CyclePage({ data }: { data: Data }) {
  const today = todayKey()
  const [month, setMonth] = useState(() => monthKey(today))
  const [selected, setSelected] = useState(today)
  const info = cycleInfo(data)
  const day = data.days[selected] ?? {}

  return (
    <>
      <PageHeader title="Cycle" subtitle="Tap a day to log your flow" />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Cycle day" value={info.cycleDay ?? '—'} tone="blush" />
        <Stat
          label="Next period"
          value={
            info.nextStart
              ? info.daysUntil! > 0
                ? `in ${info.daysUntil} days`
                : info.daysUntil === 0
                  ? 'Today'
                  : `${-info.daysUntil!} days late`
              : '—'
          }
          tone="lavender"
        />
        <Stat
          label="Avg cycle"
          value={`${info.cycleLength} days`}
          tone="peach"
        />
        <Stat
          label="Avg period"
          value={`${info.periodLength} days`}
          tone="butter"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card
          title={prettyMonth(month)}
          icon={Moon}
          tone="blush"
          action={
            <div className="flex gap-1">
              <Button
                variant="soft"
                tone="blush"
                onClick={() => setMonth(addMonths(month, -1))}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="soft"
                tone="blush"
                onClick={() => setMonth(addMonths(month, 1))}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          }
        >
          <div className="text-muted mb-2 grid grid-cols-7 text-center text-xs font-semibold">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="grid gap-1.5">
            {monthGrid(month).map((week, i) => (
              <div key={i} className="grid grid-cols-7 gap-1.5">
                {week.map((k, j) => {
                  if (!k) return <span key={j} />
                  const flow = data.days[k]?.flow
                  const isPredicted =
                    !flow && info.predicted.has(k) && k >= today
                  const isFertile = !flow && info.fertile.has(k) && k >= today
                  return (
                    <button
                      key={k}
                      onClick={() => {
                        if (selected === k)
                          updateDay(k, { flow: nextFlow(flow) })
                        setSelected(k)
                      }}
                      className={`relative aspect-square rounded-2xl text-sm font-semibold transition hover:scale-105 ${
                        flow
                          ? flowStyle[flow]
                          : isPredicted
                            ? 'border-blush-deep/50 text-blush-deep border-2 border-dashed'
                            : isFertile
                              ? 'bg-lavender/60 text-lavender-deep'
                              : 'text-ink bg-white/60'
                      } ${selected === k ? 'ring-lavender-deep ring-2 ring-offset-2' : ''}`}
                    >
                      {Number(k.slice(8))}
                      {k === today && (
                        <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-current" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="text-muted mt-4 flex flex-wrap gap-4 text-xs">
            <Legend className="bg-blush-deep">Period</Legend>
            <Legend className="border-blush-deep/50 border-2 border-dashed">
              Predicted
            </Legend>
            <Legend className="bg-lavender">Fertile window</Legend>
          </div>
          <p className="text-muted mt-2 text-xs">
            Tap a day to select it, tap again to change the flow.
          </p>
        </Card>

        <div className="grid content-start gap-5">
          <Card title={prettyDate(selected)} icon={Droplet} tone="blush">
            <div className="mb-1 text-sm font-semibold">Flow</div>
            <div className="mb-4 flex flex-wrap gap-2">
              {flows.map((f) => (
                <Chip
                  key={f.value}
                  tone="blush"
                  active={day.flow === f.value}
                  onClick={() =>
                    updateDay(selected, {
                      flow: day.flow === f.value ? undefined : f.value,
                    })
                  }
                >
                  {f.label}
                </Chip>
              ))}
            </div>
            <div className="mb-1 text-sm font-semibold">Symptoms</div>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <Chip
                  key={s}
                  tone="blush"
                  active={!!day.symptoms?.includes(s)}
                  onClick={() =>
                    updateDay(selected, {
                      symptoms: day.symptoms?.includes(s)
                        ? day.symptoms.filter((x) => x !== s)
                        : [...(day.symptoms ?? []), s],
                    })
                  }
                >
                  {s}
                </Chip>
              ))}
            </div>
          </Card>

          <Card title="Past periods" icon={History} tone="lavender">
            {info.periods.length === 0 ? (
              <Empty>
                Log your period days and your history will appear here.
              </Empty>
            ) : (
              <ul className="grid gap-1.5 text-sm">
                {[...info.periods]
                  .reverse()
                  .slice(0, 8)
                  .map((p) => (
                    <li
                      key={p.start}
                      className="ring-line flex justify-between rounded-xl bg-white/70 px-3 py-2 ring-1"
                    >
                      <span className="font-semibold">
                        {shortDate(p.start)} – {shortDate(p.end)}
                      </span>
                      <span className="text-muted">
                        {p.length} days
                        {p.cycleLength ? ` · ${p.cycleLength}-day cycle` : ''}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </Card>

          <Card title="Defaults" icon={Settings2} tone="peach">
            <p className="text-muted mb-3 text-sm">
              {info.usingHistory
                ? 'Predictions use your logged history.'
                : 'Used for predictions until you have logged two periods.'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Cycle length">
                <NumberInput
                  value={data.settings.cycleLength}
                  step="1"
                  onChange={(v) =>
                    update((d) => ({
                      ...d,
                      settings: { ...d.settings, cycleLength: v || 28 },
                    }))
                  }
                />
              </Field>
              <Field label="Period length">
                <NumberInput
                  value={data.settings.periodLength}
                  step="1"
                  onChange={(v) =>
                    update((d) => ({
                      ...d,
                      settings: { ...d.settings, periodLength: v || 5 },
                    }))
                  }
                />
              </Field>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

function Legend({
  className,
  children,
}: {
  className: string
  children: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`size-3.5 rounded-md ${className}`} />
      {children}
    </span>
  )
}
