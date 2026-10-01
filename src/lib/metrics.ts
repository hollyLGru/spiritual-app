import type { Tone } from '@/components/ui'
import type { Data } from './types'

export type Point = { date: string; value: number }

export type Metric = {
  id: string
  label: string
  group: string
  unit: string
  tone: Tone
  /** 'sum' metrics are bars added up per day/week; 'level' metrics are lines of recorded values. */
  kind: 'sum' | 'level'
  filterLabel?: string
  /** First option is the default. 'All' means no filter. */
  filterOptions?: (d: Data) => string[]
  points: (d: Data, filter: string) => Point[]
}

const uniq = (xs: string[]) =>
  [...new Set(xs.filter(Boolean))].sort((a, b) => a.localeCompare(b))

const activityOptions = (d: Data) => [
  'All',
  ...uniq(
    d.workouts.map((w) => (w.kind === 'cardio' ? w.activity : 'Strength'))
  ),
]

const liftNames = (d: Data) =>
  uniq(
    d.workouts.flatMap((w) =>
      w.kind === 'strength' ? w.lifts.map((l) => l.name.trim()) : []
    )
  )

const matchesActivity = (w: Data['workouts'][number], filter: string) =>
  filter === 'All' ||
  (w.kind === 'cardio' ? w.activity === filter : filter === 'Strength')

const fromDays = (
  d: Data,
  pick: (day: Data['days'][string]) => number | undefined
) =>
  Object.entries(d.days).flatMap(([date, day]) => {
    const v = pick(day)
    return v === undefined ? [] : [{ date, value: v }]
  })

export const metrics: Metric[] = [
  {
    id: 'miles',
    label: 'Miles',
    group: 'Exercise',
    unit: 'mi',
    tone: 'mint',
    kind: 'sum',
    filterLabel: 'Activity',
    filterOptions: (d) => [
      'All',
      ...uniq(
        d.workouts.flatMap((w) => (w.kind === 'cardio' ? [w.activity] : []))
      ),
    ],
    points: (d, f) =>
      d.workouts.flatMap((w) =>
        w.kind === 'cardio' && w.miles && matchesActivity(w, f)
          ? [{ date: w.date, value: w.miles }]
          : []
      ),
  },
  {
    id: 'calories',
    label: 'Calories burned',
    group: 'Exercise',
    unit: 'cal',
    tone: 'peach',
    kind: 'sum',
    filterLabel: 'Activity',
    filterOptions: activityOptions,
    points: (d, f) =>
      d.workouts.flatMap((w) =>
        w.calories && matchesActivity(w, f)
          ? [{ date: w.date, value: w.calories }]
          : []
      ),
  },
  {
    id: 'exercise-minutes',
    label: 'Exercise time',
    group: 'Exercise',
    unit: 'min',
    tone: 'sky',
    kind: 'sum',
    filterLabel: 'Activity',
    filterOptions: activityOptions,
    points: (d, f) =>
      d.workouts.flatMap((w) =>
        w.minutes && matchesActivity(w, f)
          ? [{ date: w.date, value: w.minutes }]
          : []
      ),
  },
  {
    id: 'lift-weight',
    label: 'Heaviest weight (per lift)',
    group: 'Strength',
    unit: 'lb',
    tone: 'lavender',
    kind: 'level',
    filterLabel: 'Lift',
    filterOptions: liftNames,
    points: (d, f) => {
      const best: Record<string, number> = {}
      for (const w of d.workouts) {
        if (w.kind !== 'strength') continue
        for (const l of w.lifts) {
          if (l.name.trim() === f && l.weight)
            best[w.date] = Math.max(best[w.date] ?? 0, l.weight)
        }
      }
      return Object.entries(best).map(([date, value]) => ({ date, value }))
    },
  },
  {
    id: 'lift-reps',
    label: 'Total reps (per lift)',
    group: 'Strength',
    unit: 'reps',
    tone: 'blush',
    kind: 'sum',
    filterLabel: 'Lift',
    filterOptions: (d) => ['All', ...liftNames(d)],
    points: (d, f) =>
      d.workouts.flatMap((w) =>
        w.kind === 'strength'
          ? w.lifts
              .filter((l) => l.reps && (f === 'All' || l.name.trim() === f))
              .map((l) => ({
                date: w.date,
                value: (l.sets || 1) * (l.reps || 0),
              }))
          : []
      ),
  },
  {
    id: 'lift-volume',
    label: 'Volume lifted (sets × reps × lb)',
    group: 'Strength',
    unit: 'lb',
    tone: 'lavender',
    kind: 'sum',
    filterLabel: 'Workout cycle',
    filterOptions: (d) => [
      'All',
      ...uniq(
        d.workouts.flatMap((w) => (w.kind === 'strength' ? [w.cycle] : []))
      ),
    ],
    points: (d, f) =>
      d.workouts.flatMap((w) =>
        w.kind === 'strength' && (f === 'All' || w.cycle === f)
          ? [
              {
                date: w.date,
                value: w.lifts.reduce(
                  (s, l) => s + (l.sets || 1) * (l.reps || 0) * (l.weight || 0),
                  0
                ),
              },
            ]
          : []
      ),
  },
  {
    id: 'weight',
    label: 'Body weight',
    group: 'Body',
    unit: 'lb',
    tone: 'sky',
    kind: 'level',
    points: (d) => fromDays(d, (day) => day.weight),
  },
  {
    id: 'meal-score',
    label: 'Eating score',
    group: 'Daily',
    unit: '/5',
    tone: 'butter',
    kind: 'level',
    points: (d) => fromDays(d, (day) => day.mealScore),
  },
  {
    id: 'mood',
    label: 'Mood',
    group: 'Daily',
    unit: '/5',
    tone: 'lavender',
    kind: 'level',
    points: (d) => fromDays(d, (day) => day.mood),
  },
  {
    id: 'water',
    label: 'Water goal hit',
    group: 'Daily',
    unit: 'days',
    tone: 'sky',
    kind: 'sum',
    points: (d) => fromDays(d, (day) => (day.water ? 1 : undefined)),
  },
  {
    id: 'drinks',
    label: 'Alcoholic drinks',
    group: 'Daily',
    unit: 'drinks',
    tone: 'blush',
    kind: 'sum',
    points: (d) =>
      fromDays(d, (day) => (day.alcohol ? day.drinks || 1 : undefined)),
  },
  {
    id: 'riding',
    label: 'Riding time',
    group: 'Horse',
    unit: 'min',
    tone: 'peach',
    kind: 'sum',
    filterLabel: 'Horse',
    filterOptions: (d) => ['All', ...uniq(d.rides.map((r) => r.horse ?? ''))],
    points: (d, f) =>
      d.rides
        .filter((r) => f === 'All' || r.horse === f)
        .map((r) => ({ date: r.date, value: r.minutes })),
  },
  {
    id: 'balance',
    label: 'Bank balance',
    group: 'Money',
    unit: '$',
    tone: 'mint',
    kind: 'level',
    points: (d) => d.balances.map((b) => ({ date: b.date, value: b.amount })),
  },
  {
    id: 'spending',
    label: 'Spending',
    group: 'Money',
    unit: '$',
    tone: 'peach',
    kind: 'sum',
    filterLabel: 'Category',
    filterOptions: (d) => ['All', ...d.budget.map((c) => c.name)],
    points: (d, f) =>
      d.expenses
        .filter(
          (e) =>
            f === 'All' ||
            d.budget.find((c) => c.id === e.categoryId)?.name === f
        )
        .map((e) => ({ date: e.date, value: e.amount })),
  },
]

export const metricById = (id: string) =>
  metrics.find((m) => m.id === id) ?? metrics[0]
