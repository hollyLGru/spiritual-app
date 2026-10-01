'use client'

import {
  Angry,
  CalendarHeart,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Dumbbell,
  Frown,
  Laugh,
  Meh,
  Moon,
  Scale,
  Smile,
  Sparkles,
  Star,
  Utensils,
  Wine,
} from 'lucide-react'
import { useState } from 'react'
import { feelings, flows, symptoms } from '@/lib/constants'
import {
  addDays,
  formatMinutes,
  formatTime,
  prettyDate,
  todayKey,
} from '@/lib/dates'
import { newId, update, updateDay } from '@/lib/store'
import type { Data, DayLog } from '@/lib/types'
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
  ScorePicker,
  inputAutoClass,
  inputClass,
} from '../ui'

const moods = [
  { value: 1, label: 'Rough', icon: Angry },
  { value: 2, label: 'Low', icon: Frown },
  { value: 3, label: 'Okay', icon: Meh },
  { value: 4, label: 'Good', icon: Smile },
  { value: 5, label: 'Great', icon: Laugh },
]

const toggle = (list: string[] | undefined, item: string) =>
  list?.includes(item)
    ? list.filter((x) => x !== item)
    : [...(list ?? []), item]

export default function TodayPage({ data }: { data: Data }) {
  const [date, setDate] = useState(todayKey)
  const day: DayLog = data.days[date] ?? {}
  const set = (patch: Partial<DayLog>) => updateDay(date, patch)
  const isToday = date === todayKey()

  return (
    <>
      <PageHeader
        title={isToday ? 'Today' : prettyDate(date, { weekday: 'long' })}
        subtitle={prettyDate(date)}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="soft"
            tone="butter"
            onClick={() => setDate(addDays(date, -1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <input
            type="date"
            className={`${inputAutoClass}`}
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
          <Button
            variant="soft"
            tone="butter"
            onClick={() => setDate(addDays(date, 1))}
          >
            <ChevronRight size={16} />
          </Button>
          {!isToday && (
            <Button variant="ghost" onClick={() => setDate(todayKey())}>
              Today
            </Button>
          )}
        </div>
      </PageHeader>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <div className="grid gap-5">
          <Card title="Meals" icon={Utensils} tone="butter">
            <div className="grid gap-3">
              {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map(
                (meal) => (
                  <Field key={meal} label={meal}>
                    <textarea
                      rows={2}
                      className={`${inputClass} resize-none`}
                      placeholder={`What did you have for ${meal}?`}
                      value={day[meal] ?? ''}
                      onChange={(e) => set({ [meal]: e.target.value })}
                    />
                  </Field>
                )
              )}
              <div className="bg-butter/50 mt-2 rounded-2xl p-4">
                <div className="mb-2 text-sm font-semibold">
                  How well did I eat?
                </div>
                <ScorePicker
                  value={day.mealScore}
                  onChange={(v) => set({ mealScore: v })}
                  icon={Star}
                  tone="butter"
                />
              </div>
            </div>
          </Card>
          <WeightCard data={data} date={date} day={day} set={set} />
          <MovementCard data={data} date={date} />
          <PlansCard data={data} date={date} />
        </div>

        <div className="grid gap-5">
          <Card title="Water & alcohol" icon={Droplets} tone="sky">
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleTile
                on={!!day.water}
                onClick={() => set({ water: !day.water })}
                icon={Droplets}
                onLabel="Water goal hit!"
                offLabel="Hit my water goal?"
                tone="sky"
              />
              <ToggleTile
                on={!!day.alcohol}
                onClick={() =>
                  set({
                    alcohol: !day.alcohol,
                    drinks: day.alcohol ? undefined : 1,
                  })
                }
                icon={Wine}
                onLabel="Had alcohol"
                offLabel="No alcohol"
                tone="blush"
              />
            </div>
            {day.alcohol && (
              <div className="mt-3 flex items-center gap-3 text-sm">
                <span className="text-muted">How many drinks?</span>
                <div className="w-24">
                  <NumberInput
                    value={day.drinks}
                    onChange={(v) => set({ drinks: v })}
                    step="1"
                  />
                </div>
              </div>
            )}
            <p className="text-muted mt-3 text-sm">
              Water streak:{' '}
              <span className="text-sky-deep font-semibold">
                {waterStreak(data, date)} days
              </span>
            </p>
          </Card>

          <Card title="How I feel" icon={Sparkles} tone="lavender">
            <div className="mb-4 grid grid-cols-5 gap-2">
              {moods.map(({ value, label, icon: Icon }) => {
                const active = day.mood === value
                return (
                  <button
                    key={value}
                    onClick={() => set({ mood: active ? undefined : value })}
                    className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-xs font-semibold transition ${
                      active
                        ? 'bg-lavender text-lavender-deep shadow-sm'
                        : 'text-muted hover:bg-lavender/40'
                    }`}
                  >
                    <Icon size={28} strokeWidth={1.8} />
                    {label}
                  </button>
                )
              })}
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              {feelings.map((f) => (
                <Chip
                  key={f}
                  active={!!day.feelings?.includes(f)}
                  onClick={() => set({ feelings: toggle(day.feelings, f) })}
                >
                  {f}
                </Chip>
              ))}
            </div>
            <textarea
              rows={2}
              className={`${inputClass} resize-none`}
              placeholder="Anything on your mind?"
              value={day.moodNote ?? ''}
              onChange={(e) => set({ moodNote: e.target.value })}
            />
          </Card>

          <Card title="Cycle" icon={Moon} tone="blush">
            <div className="mb-1 text-sm font-semibold">Period today?</div>
            <div className="mb-4 flex flex-wrap gap-2">
              {flows.map((f) => (
                <Chip
                  key={f.value}
                  tone="blush"
                  active={day.flow === f.value}
                  onClick={() =>
                    set({ flow: day.flow === f.value ? undefined : f.value })
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
                  onClick={() => set({ symptoms: toggle(day.symptoms, s) })}
                >
                  {s}
                </Chip>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

function ToggleTile({
  on,
  onClick,
  icon: Icon,
  onLabel,
  offLabel,
  tone,
}: {
  on: boolean
  onClick: () => void
  icon: typeof Droplets
  onLabel: string
  offLabel: string
  tone: 'sky' | 'blush'
}) {
  const onStyle =
    tone === 'sky' ? 'bg-sky text-sky-deep' : 'bg-blush text-blush-deep'
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-2xl border p-4 text-left font-semibold transition ${
        on
          ? `${onStyle} border-transparent shadow-sm`
          : 'border-line text-muted bg-white/70'
      }`}
    >
      <Icon size={24} fill={on ? 'currentColor' : 'none'} fillOpacity={0.25} />
      {on ? onLabel : offLabel}
    </button>
  )
}

function waterStreak(data: Data, date: string) {
  let streak = 0
  let k = data.days[date]?.water ? date : addDays(date, -1)
  while (data.days[k]?.water) {
    streak++
    k = addDays(k, -1)
  }
  return streak
}

function WeightCard({
  data,
  date,
  day,
  set,
}: {
  data: Data
  date: string
  day: DayLog
  set: (p: Partial<DayLog>) => void
}) {
  const previous = Object.keys(data.days)
    .filter((k) => k < date && data.days[k].weight)
    .sort()
    .pop()
  const prevWeight = previous ? data.days[previous].weight : undefined
  const diff = day.weight && prevWeight ? day.weight - prevWeight : undefined

  return (
    <Card title="Weight" icon={Scale} tone="sky">
      <div className="flex items-center gap-3">
        <div className="w-32">
          <NumberInput
            value={day.weight}
            onChange={(v) => set({ weight: v })}
            placeholder="lbs"
          />
        </div>
        <span className="text-muted">lbs</span>
        {diff !== undefined && (
          <span
            className={`ml-auto rounded-full px-3 py-1 text-sm font-semibold ${
              diff <= 0 ? 'bg-mint text-mint-deep' : 'bg-peach text-peach-deep'
            }`}
          >
            {diff > 0 ? '+' : ''}
            {Math.round(diff * 10) / 10} lbs since last weigh-in
          </span>
        )}
      </div>
    </Card>
  )
}

function MovementCard({ data, date }: { data: Data; date: string }) {
  const workouts = data.workouts.filter((w) => w.date === date)
  const rides = data.rides.filter((r) => r.date === date)
  return (
    <Card title="Movement" icon={Dumbbell} tone="mint">
      {workouts.length + rides.length === 0 ? (
        <Empty>No workouts or rides yet. Add them in Exercise or Riding.</Empty>
      ) : (
        <ul className="grid gap-2">
          {workouts.map((w) => (
            <li
              key={w.id}
              className="bg-mint/40 flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <Dumbbell size={18} className="text-mint-deep" />
              <span className="font-semibold">
                {w.kind === 'cardio' ? w.activity : w.cycle || 'Strength'}
              </span>
              <span className="text-muted text-sm">
                {w.kind === 'cardio'
                  ? [
                      w.miles && `${w.miles} mi`,
                      w.minutes && formatMinutes(w.minutes),
                      w.calories && `${w.calories} cal`,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  : `${w.lifts.length} lifts`}
              </span>
            </li>
          ))}
          {rides.map((r) => (
            <li
              key={r.id}
              className="bg-peach/40 flex items-center gap-3 rounded-2xl px-4 py-3"
            >
              <span className="text-peach-deep">
                <Horseshoe size={18} />
              </span>
              <span className="font-semibold">
                Rode {r.horse || 'my horse'}
              </span>
              <span className="text-muted text-sm">
                {formatMinutes(r.minutes)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function PlansCard({ data, date }: { data: Data; date: string }) {
  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const events = data.events
    .filter((e) => e.date === date)
    .sort((a, b) => (a.time ?? '').localeCompare(b.time ?? ''))

  const add = () => {
    if (!title.trim()) return
    update((d) => ({
      ...d,
      events: [
        ...d.events,
        { id: newId(), date, title: title.trim(), time: time || undefined },
      ],
    }))
    setTitle('')
    setTime('')
  }

  return (
    <Card title="Plans" icon={CalendarHeart} tone="lavender">
      <form
        className="mb-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          add()
        }}
      >
        <input
          className={inputClass}
          placeholder="Add a plan..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="w-36 shrink-0">
          <input
            type="time"
            className={inputClass}
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <Button type="submit">Add</Button>
      </form>
      {events.length === 0 ? (
        <Empty>Nothing planned.</Empty>
      ) : (
        <ul className="grid gap-2">
          {events.map((ev) => (
            <li
              key={ev.id}
              className="bg-lavender/40 flex items-center gap-3 rounded-2xl px-4 py-2.5"
            >
              {ev.time && (
                <span className="text-lavender-deep text-sm font-semibold">
                  {formatTime(ev.time)}
                </span>
              )}
              <span className="flex-1">{ev.title}</span>
              <DeleteButton
                onClick={() =>
                  update((d) => ({
                    ...d,
                    events: d.events.filter((x) => x.id !== ev.id),
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
