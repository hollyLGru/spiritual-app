'use client'

import { Dumbbell, Footprints, History, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import ChartPanel from '../ChartPanel'
import { cardioActivities } from '@/lib/constants'
import { addDays, formatMinutes, prettyDate, todayKey } from '@/lib/dates'
import { newId, update } from '@/lib/store'
import type { Data, Lift, Workout } from '@/lib/types'
import {
  Button,
  Card,
  DeleteButton,
  Empty,
  Field,
  NumberInput,
  PageHeader,
  Segmented,
  Stat,
  inputAutoClass,
  inputClass,
} from '../ui'

const blankLift = (): Lift => ({ id: newId(), name: '' })

export default function ExercisePage({ data }: { data: Data }) {
  const weekAgo = addDays(todayKey(), -6)
  const thisWeek = data.workouts.filter((w) => w.date >= weekAgo)
  const weekMiles = thisWeek.reduce(
    (s, w) => s + (w.kind === 'cardio' ? (w.miles ?? 0) : 0),
    0
  )
  const weekCalories = thisWeek.reduce((s, w) => s + (w.calories ?? 0), 0)
  const weekMinutes = thisWeek.reduce((s, w) => s + (w.minutes ?? 0), 0)

  return (
    <>
      <PageHeader
        title="Exercise"
        subtitle="Log your workouts and watch yourself get stronger"
      />
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Workouts (7 days)" value={thisWeek.length} tone="mint" />
        <Stat
          label="Miles (7 days)"
          value={Math.round(weekMiles * 10) / 10}
          tone="sky"
        />
        <Stat
          label="Calories (7 days)"
          value={weekCalories.toLocaleString()}
          tone="peach"
        />
        <Stat
          label="Time (7 days)"
          value={formatMinutes(weekMinutes)}
          tone="lavender"
        />
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <WorkoutForm data={data} />
        <div className="grid content-start gap-5">
          <ChartPanel
            data={data}
            title="Exercise graph"
            metricIds={[
              'miles',
              'calories',
              'exercise-minutes',
              'lift-weight',
              'lift-reps',
              'lift-volume',
            ]}
          />
          <WorkoutHistory data={data} />
        </div>
      </div>
    </>
  )
}

function WorkoutForm({ data }: { data: Data }) {
  const [kind, setKind] = useState<'cardio' | 'strength'>('cardio')
  const [date, setDate] = useState(todayKey)
  const [activity, setActivity] = useState('Treadmill')
  const [miles, setMiles] = useState<number>()
  const [minutes, setMinutes] = useState<number>()
  const [calories, setCalories] = useState<number>()
  const [notes, setNotes] = useState('')
  const [cycle, setCycle] = useState('')
  const [lifts, setLifts] = useState<Lift[]>([blankLift()])

  const pastCycles = [
    ...new Set(
      data.workouts.flatMap((w) =>
        w.kind === 'strength' && w.cycle ? [w.cycle] : []
      )
    ),
  ]
  const pastLifts = [
    ...new Set(
      data.workouts.flatMap((w) =>
        w.kind === 'strength' ? w.lifts.map((l) => l.name) : []
      )
    ),
  ]
  const pastActivities = [
    ...new Set([
      ...cardioActivities,
      ...data.workouts.flatMap((w) =>
        w.kind === 'cardio' ? [w.activity] : []
      ),
    ]),
  ]
  const lastOfCycle = [...data.workouts]
    .filter((w) => w.kind === 'strength' && w.cycle === cycle)
    .sort((a, b) => b.date.localeCompare(a.date))[0]

  const setLift = (id: string, patch: Partial<Lift>) =>
    setLifts((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)))

  const reset = () => {
    setMiles(undefined)
    setMinutes(undefined)
    setCalories(undefined)
    setNotes('')
    setLifts([blankLift()])
  }

  const canSave =
    kind === 'cardio'
      ? activity.trim() !== ''
      : lifts.some((l) => l.name.trim()) || cycle.trim() !== ''

  const save = () => {
    const base = {
      id: newId(),
      date,
      minutes,
      calories,
      notes: notes.trim() || undefined,
    }
    const workout: Workout =
      kind === 'cardio'
        ? { ...base, kind, activity: activity.trim(), miles }
        : {
            ...base,
            kind,
            cycle: cycle.trim(),
            lifts: lifts
              .filter((l) => l.name.trim())
              .map((l) => ({ ...l, name: l.name.trim() })),
          }
    update((d) => ({ ...d, workouts: [...d.workouts, workout] }))
    reset()
  }

  return (
    <Card
      title="Log a workout"
      icon={Plus}
      tone="mint"
      className="content-start self-start"
    >
      <form
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          if (canSave) save()
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Segmented
            value={kind}
            onChange={setKind}
            tone="mint"
            options={[
              { value: 'cardio', label: 'Cardio' },
              { value: 'strength', label: 'Strength' },
            ]}
          />
          <input
            type="date"
            className={`${inputAutoClass}`}
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </div>

        {kind === 'cardio' ? (
          <>
            <Field label="Activity">
              <input
                list="activities"
                className={inputClass}
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                placeholder="Treadmill, walk, bike..."
              />
              <datalist id="activities">
                {pastActivities.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </Field>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Miles">
                <NumberInput
                  value={miles}
                  onChange={setMiles}
                  placeholder="0.0"
                />
              </Field>
              <Field label="Minutes">
                <NumberInput
                  value={minutes}
                  onChange={setMinutes}
                  placeholder="0"
                />
              </Field>
              <Field label="Calories">
                <NumberInput
                  value={calories}
                  onChange={setCalories}
                  placeholder="0"
                />
              </Field>
            </div>
          </>
        ) : (
          <>
            <Field label="Workout cycle">
              <input
                list="cycles"
                className={inputClass}
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                placeholder="e.g. Leg day, Week 2 Upper"
              />
              <datalist id="cycles">
                {pastCycles.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            {lastOfCycle?.kind === 'strength' && (
              <Button
                variant="soft"
                tone="lavender"
                onClick={() =>
                  setLifts(
                    lastOfCycle.lifts.map((l) => ({ ...l, id: newId() }))
                  )
                }
              >
                <RotateCcw size={15} /> Copy lifts from last {cycle} (
                {prettyDate(lastOfCycle.date, {
                  month: 'short',
                  day: 'numeric',
                })}
                )
              </Button>
            )}
            <div className="grid gap-2">
              <div className="text-muted grid grid-cols-[minmax(0,1fr)_4rem_4rem_5rem_1.75rem] gap-2 px-1 text-xs font-semibold tracking-wide uppercase">
                <span>Exercise</span>
                <span>Sets</span>
                <span>Reps</span>
                <span>Weight</span>
                <span />
              </div>
              <datalist id="lifts">
                {pastLifts.map((l) => (
                  <option key={l} value={l} />
                ))}
              </datalist>
              {lifts.map((l) => (
                <div
                  key={l.id}
                  className="grid grid-cols-[minmax(0,1fr)_4rem_4rem_5rem_1.75rem] items-center gap-2"
                >
                  <input
                    list="lifts"
                    className={inputClass}
                    placeholder="Squat"
                    value={l.name}
                    onChange={(e) => setLift(l.id, { name: e.target.value })}
                  />
                  <NumberInput
                    value={l.sets}
                    onChange={(v) => setLift(l.id, { sets: v })}
                    step="1"
                  />
                  <NumberInput
                    value={l.reps}
                    onChange={(v) => setLift(l.id, { reps: v })}
                    step="1"
                  />
                  <NumberInput
                    value={l.weight}
                    onChange={(v) => setLift(l.id, { weight: v })}
                    placeholder="lb"
                  />
                  <DeleteButton
                    onClick={() =>
                      setLifts((ls) =>
                        ls.length > 1
                          ? ls.filter((x) => x.id !== l.id)
                          : [blankLift()]
                      )
                    }
                  />
                </div>
              ))}
              <Button
                variant="ghost"
                className="justify-self-start"
                onClick={() => setLifts((ls) => [...ls, blankLift()])}
              >
                <Plus size={15} /> Add exercise
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Minutes">
                <NumberInput
                  value={minutes}
                  onChange={setMinutes}
                  placeholder="0"
                />
              </Field>
              <Field label="Calories">
                <NumberInput
                  value={calories}
                  onChange={setCalories}
                  placeholder="0"
                />
              </Field>
            </div>
          </>
        )}

        <Field label="Notes">
          <textarea
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="How did it feel?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </Field>
        <Button type="submit" tone="mint" disabled={!canSave}>
          Save workout
        </Button>
      </form>
    </Card>
  )
}

function WorkoutHistory({ data }: { data: Data }) {
  const [showAll, setShowAll] = useState(false)
  const sorted = [...data.workouts].sort((a, b) => b.date.localeCompare(a.date))
  const shown = showAll ? sorted : sorted.slice(0, 8)

  return (
    <Card title="History" icon={History} tone="sky">
      {sorted.length === 0 ? (
        <Empty>Your workouts will show up here.</Empty>
      ) : (
        <ul className="grid gap-2">
          {shown.map((w) => (
            <li
              key={w.id}
              className="ring-line rounded-2xl bg-white/70 px-4 py-3 ring-1"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`grid size-8 place-items-center rounded-xl ${
                    w.kind === 'cardio'
                      ? 'bg-mint text-mint-deep'
                      : 'bg-lavender text-lavender-deep'
                  }`}
                >
                  {w.kind === 'cardio' ? (
                    <Footprints size={16} />
                  ) : (
                    <Dumbbell size={16} />
                  )}
                </span>
                <div className="flex-1">
                  <div className="font-semibold">
                    {w.kind === 'cardio' ? w.activity : w.cycle || 'Strength'}
                  </div>
                  <div className="text-muted text-xs">
                    {prettyDate(w.date, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                    {[
                      w.kind === 'cardio' && w.miles ? `${w.miles} mi` : '',
                      w.minutes ? formatMinutes(w.minutes) : '',
                      w.calories ? `${w.calories} cal` : '',
                    ]
                      .filter(Boolean)
                      .map((s) => ` · ${s}`)}
                  </div>
                </div>
                <DeleteButton
                  onClick={() =>
                    confirm('Delete this workout?') &&
                    update((d) => ({
                      ...d,
                      workouts: d.workouts.filter((x) => x.id !== w.id),
                    }))
                  }
                />
              </div>
              {w.kind === 'strength' && w.lifts.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-11">
                  {w.lifts.map((l) => (
                    <span
                      key={l.id}
                      className="bg-lavender/50 rounded-full px-2.5 py-1 text-xs"
                    >
                      <span className="font-semibold">{l.name}</span>{' '}
                      {[
                        l.sets && l.reps
                          ? `${l.sets}×${l.reps}`
                          : l.reps && `${l.reps} reps`,
                        l.weight && `${l.weight} lb`,
                      ]
                        .filter(Boolean)
                        .join(' @ ')}
                    </span>
                  ))}
                </div>
              )}
              {w.notes && (
                <p className="text-muted mt-2 pl-11 text-sm">{w.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {sorted.length > 8 && (
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show less' : `Show all ${sorted.length}`}
        </Button>
      )}
    </Card>
  )
}
