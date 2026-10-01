export type CardioWorkout = {
  id: string
  date: string
  kind: 'cardio'
  activity: string
  miles?: number
  minutes?: number
  calories?: number
  notes?: string
}

export type Lift = {
  id: string
  name: string
  sets?: number
  reps?: number
  weight?: number
}

export type StrengthWorkout = {
  id: string
  date: string
  kind: 'strength'
  cycle: string
  lifts: Lift[]
  minutes?: number
  calories?: number
  notes?: string
}

export type Workout = CardioWorkout | StrengthWorkout

export type Flow = 'spotting' | 'light' | 'medium' | 'heavy'

export type DayLog = {
  breakfast?: string
  lunch?: string
  dinner?: string
  snacks?: string
  mealScore?: number
  water?: boolean
  alcohol?: boolean
  drinks?: number
  mood?: number
  feelings?: string[]
  moodNote?: string
  weight?: number
  flow?: Flow
  symptoms?: string[]
}

export type Ride = {
  id: string
  date: string
  minutes: number
  horse?: string
  focus?: string[]
  notes?: string
}

export type BudgetCategory = { id: string; name: string; amount: number }

export type Expense = {
  id: string
  date: string
  amount: number
  categoryId: string
  note?: string
}

export type BalanceEntry = { id: string; date: string; amount: number }

export type CalEvent = {
  id: string
  date: string
  time?: string
  title: string
  notes?: string
}

export type Data = {
  days: Record<string, DayLog>
  workouts: Workout[]
  rides: Ride[]
  budget: BudgetCategory[]
  expenses: Expense[]
  balances: BalanceEntry[]
  events: CalEvent[]
  settings: { cycleLength: number; periodLength: number }
}
