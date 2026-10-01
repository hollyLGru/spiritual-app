import { addDays, daysBetween, todayKey } from './dates'
import type { Data } from './types'

export type Period = {
  start: string
  end: string
  length: number
  cycleLength?: number
}

const avg = (xs: number[]) =>
  Math.round(xs.reduce((a, b) => a + b, 0) / xs.length)

/** Spotting doesn't count as a period day. Gaps of 1 day are bridged. */
export function cycleInfo(data: Data) {
  const flowDays = Object.keys(data.days)
    .filter((k) => data.days[k].flow && data.days[k].flow !== 'spotting')
    .sort()

  const periods: Period[] = []
  for (const k of flowDays) {
    const last = periods[periods.length - 1]
    if (last && daysBetween(last.end, k) <= 2) {
      last.end = k
      last.length = daysBetween(last.start, k) + 1
    } else {
      if (last) last.cycleLength = daysBetween(last.start, k)
      periods.push({ start: k, end: k, length: 1 })
    }
  }

  const cycles = periods
    .map((p) => p.cycleLength)
    .filter((c): c is number => !!c && c >= 18 && c <= 45)
    .slice(-6)
  const cycleLength = cycles.length ? avg(cycles) : data.settings.cycleLength
  const finished = periods
    .slice(0, -1)
    .map((p) => p.length)
    .slice(-6)
  const periodLength = finished.length
    ? avg(finished)
    : data.settings.periodLength

  const today = todayKey()
  const last = periods[periods.length - 1]
  let nextStart: string | undefined
  if (last) {
    nextStart = addDays(last.start, cycleLength)
    while (
      nextStart < today &&
      daysBetween(last.start, today) > cycleLength + 10
    )
      nextStart = addDays(nextStart, cycleLength)
  }
  const ovulation = nextStart ? addDays(nextStart, -14) : undefined

  const predicted = new Set<string>()
  const fertile = new Set<string>()
  if (nextStart && ovulation) {
    for (let c = 0; c < 3; c++) {
      const s = addDays(nextStart, c * cycleLength)
      for (let i = 0; i < periodLength; i++) predicted.add(addDays(s, i))
      const o = addDays(s, -14)
      for (let i = -5; i <= 1; i++) fertile.add(addDays(o, i))
    }
  }

  return {
    periods,
    cycleLength,
    periodLength,
    usingHistory: cycles.length > 0,
    lastStart: last?.start,
    cycleDay: last ? daysBetween(last.start, today) + 1 : undefined,
    nextStart,
    daysUntil: nextStart ? daysBetween(today, nextStart) : undefined,
    ovulation,
    predicted,
    fertile,
  }
}
