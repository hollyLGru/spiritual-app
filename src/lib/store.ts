'use client'

import { useSyncExternalStore } from 'react'
import type { Data, DayLog } from './types'

const STORAGE_KEY = 'bloom-data-v1'

export const emptyData = (): Data => ({
  days: {},
  workouts: [],
  rides: [],
  budget: [
    { id: 'groceries', name: 'Groceries', amount: 400 },
    { id: 'eating-out', name: 'Eating out', amount: 150 },
    { id: 'horse', name: 'Horse', amount: 300 },
    { id: 'fun', name: 'Fun', amount: 100 },
  ],
  expenses: [],
  balances: [],
  events: [],
  settings: { cycleLength: 28, periodLength: 5 },
})

let state: Data | null = null
const listeners = new Set<() => void>()

function load(): Data {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...emptyData(), ...JSON.parse(raw) }
  } catch {
    // fall through to empty data if storage is unreadable
  }
  return emptyData()
}

function getSnapshot(): Data {
  if (!state) state = load()
  return state
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function setData(next: Data) {
  state = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

export function update(fn: (d: Data) => Data) {
  setData(fn(getSnapshot()))
}

export function updateDay(date: string, patch: Partial<DayLog>) {
  update((d) => ({
    ...d,
    days: { ...d.days, [date]: { ...d.days[date], ...patch } },
  }))
}

export function useData(): Data | null {
  return useSyncExternalStore(subscribe, getSnapshot, () => null)
}

export const newId = () => crypto.randomUUID()
