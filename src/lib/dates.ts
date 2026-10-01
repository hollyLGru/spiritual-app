const pad = (n: number) => String(n).padStart(2, '0')

export const toKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const fromKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const todayKey = () => toKey(new Date())

export const addDays = (key: string, n: number) => {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export const daysBetween = (a: string, b: string) =>
  Math.round((fromKey(b).getTime() - fromKey(a).getTime()) / 86_400_000)

export const monthKey = (key: string) => key.slice(0, 7)

export const prettyDate = (key: string, opts?: Intl.DateTimeFormatOptions) =>
  fromKey(key).toLocaleDateString(
    undefined,
    opts ?? { weekday: 'long', month: 'long', day: 'numeric' }
  )

export const shortDate = (key: string) =>
  fromKey(key).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

export const prettyMonth = (mk: string) =>
  fromKey(`${mk}-01`).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })

export const addMonths = (mk: string, n: number) => {
  const d = fromKey(`${mk}-01`)
  d.setMonth(d.getMonth() + n)
  return toKey(d).slice(0, 7)
}

/** Weeks (Sunday-first) covering the month, each day as a key or null for padding. */
export const monthGrid = (mk: string): (string | null)[][] => {
  const first = fromKey(`${mk}-01`)
  const daysInMonth = new Date(
    first.getFullYear(),
    first.getMonth() + 1,
    0
  ).getDate()
  const cells: (string | null)[] = Array(first.getDay()).fill(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(`${mk}-${pad(i)}`)
  while (cells.length % 7) cells.push(null)
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export const formatMinutes = (min: number) => {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  if (!h) return `${m}m`
  return m ? `${h}h ${m}m` : `${h}h`
}

export const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`
}

export const money = (n: number) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
