'use client'

import {
  CalendarDays,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react'
import { useState } from 'react'
import {
  addMonths,
  formatTime,
  monthGrid,
  monthKey,
  prettyDate,
  prettyMonth,
  shortDate,
  todayKey,
} from '@/lib/dates'
import { newId, update } from '@/lib/store'
import type { Data } from '@/lib/types'
import {
  Button,
  Card,
  DeleteButton,
  Empty,
  Field,
  PageHeader,
  inputClass,
} from '../ui'

export default function CalendarPage({ data }: { data: Data }) {
  const today = todayKey()
  const [month, setMonth] = useState(() => monthKey(today))
  const [selected, setSelected] = useState(today)

  const eventsOn = (k: string) =>
    data.events
      .filter((e) => e.date === k)
      .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))

  const upcoming = data.events
    .filter((e) => e.date >= today)
    .sort((a, b) =>
      (a.date + (a.time ?? '')).localeCompare(b.date + (b.time ?? ''))
    )
    .slice(0, 8)

  return (
    <>
      <PageHeader
        title="Calendar"
        subtitle="Plans, dates and everything you've tracked"
      >
        <div className="flex items-center gap-2">
          <Button variant="soft" onClick={() => setMonth(addMonths(month, -1))}>
            <ChevronLeft size={16} />
          </Button>
          <span className="min-w-36 text-center font-semibold">
            {prettyMonth(month)}
          </span>
          <Button variant="soft" onClick={() => setMonth(addMonths(month, 1))}>
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setMonth(monthKey(today))
              setSelected(today)
            }}
          >
            Today
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Card>
          <div className="text-muted mb-2 grid grid-cols-7 text-center text-xs font-semibold tracking-wide uppercase">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid gap-1.5">
            {monthGrid(month).map((week, i) => (
              <div key={i} className="grid grid-cols-7 gap-1.5">
                {week.map((k, j) => {
                  if (!k) return <span key={j} />
                  const evs = eventsOn(k)
                  const day = data.days[k]
                  const worked = data.workouts.some((w) => w.date === k)
                  const rode = data.rides.some((r) => r.date === k)
                  const period = day?.flow && day.flow !== 'spotting'
                  return (
                    <button
                      key={k}
                      onClick={() => setSelected(k)}
                      className={`hover:bg-lavender/40 flex min-h-20 flex-col gap-1 rounded-2xl p-1.5 text-left transition sm:min-h-24 sm:p-2 ${
                        selected === k
                          ? 'bg-lavender/60 ring-lavender-deep/50 ring-2'
                          : 'bg-white/60'
                      }`}
                    >
                      <span
                        className={`grid size-6 place-items-center rounded-full text-xs font-bold ${
                          k === today ? 'bg-lavender-deep text-white' : ''
                        }`}
                      >
                        {Number(k.slice(8))}
                      </span>
                      {evs.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className="bg-lavender text-lavender-deep truncate rounded-md px-1.5 py-0.5 text-[11px] font-semibold"
                        >
                          {e.title}
                        </span>
                      ))}
                      {evs.length > 2 && (
                        <span className="text-muted text-[11px]">
                          +{evs.length - 2} more
                        </span>
                      )}
                      <span className="mt-auto flex gap-1">
                        {period && <Dot className="bg-blush-deep" />}
                        {worked && <Dot className="bg-mint-deep" />}
                        {rode && <Dot className="bg-peach-deep" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="text-muted mt-4 flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <Dot className="bg-blush-deep" /> Period
            </span>
            <span className="flex items-center gap-1.5">
              <Dot className="bg-mint-deep" /> Workout
            </span>
            <span className="flex items-center gap-1.5">
              <Dot className="bg-peach-deep" /> Ride
            </span>
          </div>
        </Card>

        <div className="grid content-start gap-5">
          <DayPanel
            key={selected}
            date={selected}
            events={eventsOn(selected)}
          />
          <Card title="Coming up" icon={CalendarDays} tone="sky">
            {upcoming.length === 0 ? (
              <Empty>No upcoming plans.</Empty>
            ) : (
              <ul className="grid gap-2">
                {upcoming.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => {
                        setSelected(e.date)
                        setMonth(monthKey(e.date))
                      }}
                      className="ring-line hover:bg-sky/40 flex w-full items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 text-left ring-1"
                    >
                      <span className="text-sky-deep w-14 text-xs font-semibold">
                        {e.date === today ? 'Today' : shortDate(e.date)}
                      </span>
                      <span className="flex-1 truncate font-semibold">
                        {e.title}
                      </span>
                      {e.time && (
                        <span className="text-muted text-xs">
                          {formatTime(e.time)}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

function Dot({ className }: { className: string }) {
  return <span className={`size-2 rounded-full ${className}`} />
}

function DayPanel({ date, events }: { date: string; events: Data['events'] }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')

  return (
    <Card title={prettyDate(date)} icon={CalendarHeart} tone="lavender">
      <form
        className="mb-4 grid gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (!title.trim()) return
          update((d) => ({
            ...d,
            events: [
              ...d.events,
              {
                id: newId(),
                date,
                title: title.trim(),
                time: time || undefined,
                notes: notes.trim() || undefined,
              },
            ],
          }))
          setTitle('')
          setTime('')
          setNotes('')
        }}
      >
        <Field label="Plan">
          <input
            className={inputClass}
            placeholder="Dinner with mom, vet appointment..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-[8rem_minmax(0,1fr)] gap-3">
          <Field label="Time">
            <input
              type="time"
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Field>
          <Field label="Notes">
            <input
              className={inputClass}
              placeholder="Optional"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Field>
        </div>
        <Button type="submit" disabled={!title.trim()}>
          Add to calendar
        </Button>
      </form>
      {events.length === 0 ? (
        <Empty>Nothing planned this day.</Empty>
      ) : (
        <ul className="grid gap-2">
          {events.map((e) => (
            <li
              key={e.id}
              className="bg-lavender/40 flex items-start gap-3 rounded-2xl px-4 py-3"
            >
              <div className="flex-1">
                <div className="font-semibold">{e.title}</div>
                {(e.time || e.notes) && (
                  <div className="text-muted flex items-center gap-1.5 text-sm">
                    {e.time && (
                      <>
                        <Clock size={13} /> {formatTime(e.time)}
                      </>
                    )}
                    {e.time && e.notes && ' · '}
                    {e.notes}
                  </div>
                )}
              </div>
              <DeleteButton
                onClick={() =>
                  update((d) => ({
                    ...d,
                    events: d.events.filter((x) => x.id !== e.id),
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
