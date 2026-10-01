'use client'

import { History, Plus } from 'lucide-react'
import { useState } from 'react'
import ChartPanel from '../ChartPanel'
import { rideFocus } from '@/lib/constants'
import { formatMinutes, monthKey, prettyDate, todayKey } from '@/lib/dates'
import { newId, update } from '@/lib/store'
import type { Data } from '@/lib/types'
import { Horseshoe } from '../icons'
import {
  Button,
  Card,
  Chip,
  DeleteButton,
  Empty,
  Field,
  NumberInput,
  PageHeader,
  Stat,
  inputClass,
} from '../ui'

export default function RidingPage({ data }: { data: Data }) {
  const today = todayKey()
  const month = data.rides.filter((r) => monthKey(r.date) === monthKey(today))
  const year = data.rides.filter(
    (r) => r.date.slice(0, 4) === today.slice(0, 4)
  )
  const sum = (rs: typeof month) => rs.reduce((s, r) => s + r.minutes, 0)

  return (
    <>
      <PageHeader title="Riding" subtitle="Every ride counts" />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Rides this month"
          value={new Set(month.map((r) => r.date)).size}
          tone="peach"
        />
        <Stat
          label="Time this month"
          value={formatMinutes(sum(month))}
          tone="butter"
        />
        <Stat
          label="Rides this year"
          value={new Set(year.map((r) => r.date)).size}
          tone="blush"
        />
        <Stat
          label="Time this year"
          value={formatMinutes(sum(year))}
          tone="lavender"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <RideForm data={data} />
        <div className="grid content-start gap-5">
          <ChartPanel data={data} title="Riding graph" metricIds={['riding']} />
          <RideHistory data={data} />
        </div>
      </div>
    </>
  )
}

function RideForm({ data }: { data: Data }) {
  const lastHorse = [...data.rides].sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0]?.horse
  const [date, setDate] = useState(todayKey)
  const [hours, setHours] = useState<number>()
  const [mins, setMins] = useState<number>()
  const [horse, setHorse] = useState(lastHorse ?? '')
  const [focus, setFocus] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const total = (hours ?? 0) * 60 + (mins ?? 0)
  const horses = [
    ...new Set(data.rides.map((r) => r.horse).filter(Boolean)),
  ] as string[]

  const save = () => {
    update((d) => ({
      ...d,
      rides: [
        ...d.rides,
        {
          id: newId(),
          date,
          minutes: total,
          horse: horse.trim() || undefined,
          focus: focus.length ? focus : undefined,
          notes: notes.trim() || undefined,
        },
      ],
    }))
    setHours(undefined)
    setMins(undefined)
    setFocus([])
    setNotes('')
  }

  return (
    <Card title="Log a ride" icon={Plus} tone="peach" className="self-start">
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (total > 0) save()
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date">
            <input
              type="date"
              className={inputClass}
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
            />
          </Field>
          <Field label="Horse">
            <input
              list="horses"
              className={inputClass}
              value={horse}
              placeholder="Name"
              onChange={(e) => setHorse(e.target.value)}
            />
            <datalist id="horses">
              {horses.map((h) => (
                <option key={h} value={h} />
              ))}
            </datalist>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Hours">
            <NumberInput
              value={hours}
              onChange={setHours}
              placeholder="0"
              step="1"
            />
          </Field>
          <Field label="Minutes">
            <NumberInput
              value={mins}
              onChange={setMins}
              placeholder="45"
              step="1"
            />
          </Field>
        </div>
        <Field label="What we worked on">
          <div className="flex flex-wrap gap-2">
            {rideFocus.map((f) => (
              <Chip
                key={f}
                tone="peach"
                active={focus.includes(f)}
                onClick={() =>
                  setFocus((xs) =>
                    xs.includes(f) ? xs.filter((x) => x !== f) : [...xs, f]
                  )
                }
              >
                {f}
              </Chip>
            ))}
          </div>
        </Field>
        <Field label="Notes">
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="How did the ride go?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <Button type="submit" tone="peach" disabled={total <= 0}>
          Save ride{total > 0 && ` · ${formatMinutes(total)}`}
        </Button>
      </form>
    </Card>
  )
}

function RideHistory({ data }: { data: Data }) {
  const sorted = [...data.rides]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 15)
  return (
    <Card title="Recent rides" icon={History} tone="butter">
      {sorted.length === 0 ? (
        <Empty>Your rides will show up here.</Empty>
      ) : (
        <ul className="grid gap-2">
          {sorted.map((r) => (
            <li
              key={r.id}
              className="ring-line flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 ring-1"
            >
              <span className="bg-peach text-peach-deep grid size-8 place-items-center rounded-xl">
                <Horseshoe size={16} />
              </span>
              <div className="flex-1">
                <div className="font-semibold">
                  {r.horse || 'Ride'} · {formatMinutes(r.minutes)}
                </div>
                <div className="text-muted text-xs">
                  {prettyDate(r.date, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                  {r.focus?.length ? ` · ${r.focus.join(', ')}` : ''}
                </div>
                {r.notes && (
                  <p className="text-muted mt-1 text-sm">{r.notes}</p>
                )}
              </div>
              <DeleteButton
                onClick={() =>
                  confirm('Delete this ride?') &&
                  update((d) => ({
                    ...d,
                    rides: d.rides.filter((x) => x.id !== r.id),
                  }))
                }
              />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
