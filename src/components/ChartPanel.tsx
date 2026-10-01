'use client'

import { LineChart as ChartIcon } from 'lucide-react'
import { useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { addDays, daysBetween, fromKey, shortDate, todayKey } from '@/lib/dates'
import { metricById, metrics, type Point } from '@/lib/metrics'
import type { Data } from '@/lib/types'
import { Card, Empty, Segmented, Stat, inputAutoClass, tones } from './ui'

type Range = '7' | '30' | '90' | '365' | 'all'

const ranges: { value: Range; label: string }[] = [
  { value: '7', label: 'Week' },
  { value: '30', label: 'Month' },
  { value: '90', label: '3 mo' },
  { value: '365', label: 'Year' },
  { value: 'all', label: 'All' },
]

const weekStart = (key: string) => addDays(key, -fromKey(key).getDay())

const round = (n: number) => Math.round(n * 10) / 10

function buildSeries(points: Point[], kind: 'sum' | 'level', range: Range) {
  const today = todayKey()
  const earliest = points.reduce(
    (min, p) => (p.date < min ? p.date : min),
    today
  )
  const start =
    range === 'all' ? earliest : addDays(today, -(Number(range) - 1))
  const inRange = points.filter((p) => p.date >= start && p.date <= today)
  const weekly = daysBetween(start, today) > 92

  if (kind === 'level') {
    const byDay: Record<string, number[]> = {}
    for (const p of inRange) (byDay[p.date] ??= []).push(p.value)
    const series = Object.keys(byDay)
      .sort()
      .map((date) => ({
        date,
        value: round(
          byDay[date].reduce((a, b) => a + b, 0) / byDay[date].length
        ),
      }))
    return { series, inRange, weekly: false }
  }

  const bucket = (k: string) => (weekly ? weekStart(k) : k)
  const sums: Record<string, number> = {}
  for (let k = bucket(start); k <= today; k = addDays(k, weekly ? 7 : 1))
    sums[k] = 0
  for (const p of inRange) sums[bucket(p.date)] += p.value
  const series = Object.entries(sums).map(([date, value]) => ({
    date,
    value: round(value),
  }))
  return { series, inRange, weekly }
}

export default function ChartPanel({
  data,
  metricIds,
  title = 'Progress',
  initialMetric,
}: {
  data: Data
  metricIds?: string[]
  title?: string
  initialMetric?: string
}) {
  const available = metricIds
    ? metrics.filter((m) => metricIds.includes(m.id))
    : metrics
  const [metricId, setMetricId] = useState(initialMetric ?? available[0].id)
  const [filter, setFilter] = useState<string | null>(null)
  const [range, setRange] = useState<Range>('30')

  const metric = metricById(metricId)
  const options = metric.filterOptions?.(data) ?? []
  const activeFilter =
    filter && options.includes(filter) ? filter : (options[0] ?? 'All')
  const points = metric.points(data, activeFilter)
  const { series, inRange, weekly } = buildSeries(points, metric.kind, range)
  const color = tones[metric.tone].hex
  const groups = [...new Set(available.map((m) => m.group))]

  const fmt = (v: number) =>
    metric.unit === '$'
      ? `$${v.toLocaleString()}`
      : `${v.toLocaleString()} ${metric.unit}`

  const total = inRange.reduce((s, p) => s + p.value, 0)
  const activeDays = new Set(inRange.map((p) => p.date)).size
  const stats =
    metric.kind === 'sum'
      ? [
          { label: 'Total', value: fmt(round(total)) },
          { label: 'Active days', value: activeDays },
          {
            label: 'Per active day',
            value: activeDays ? fmt(round(total / activeDays)) : '—',
          },
        ]
      : [
          {
            label: 'Latest',
            value: series.length ? fmt(series[series.length - 1].value) : '—',
          },
          {
            label: 'Change',
            value:
              series.length > 1
                ? `${series[series.length - 1].value >= series[0].value ? '+' : ''}${fmt(
                    round(series[series.length - 1].value - series[0].value)
                  )}`
                : '—',
          },
          {
            label: 'Average',
            value: series.length
              ? fmt(
                  round(series.reduce((s, p) => s + p.value, 0) / series.length)
                )
              : '—',
          },
        ]

  const tickFormatter = (k: string) =>
    range === '7'
      ? fromKey(k).toLocaleDateString(undefined, { weekday: 'short' })
      : shortDate(k)

  return (
    <Card title={title} icon={ChartIcon} tone={metric.tone}>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <select
          className={`${inputAutoClass} min-w-52 font-semibold`}
          value={metricId}
          onChange={(e) => {
            setMetricId(e.target.value)
            setFilter(null)
          }}
        >
          {groups.map((g) => (
            <optgroup key={g} label={g}>
              {available
                .filter((m) => m.group === g)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        {metric.filterOptions && options.length > 0 && (
          <select
            aria-label={metric.filterLabel}
            className={`${inputAutoClass} min-w-40`}
            value={activeFilter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {options.map((o) => (
              <option key={o} value={o}>
                {o === 'All' ? `${metric.filterLabel}: All` : o}
              </option>
            ))}
          </select>
        )}
        <div className="ml-auto">
          <Segmented
            value={range}
            options={ranges}
            onChange={setRange}
            tone={metric.tone}
          />
        </div>
      </div>

      {metric.filterOptions && options.length === 0 ? (
        <Empty>
          Log a strength workout with a lift name to see this graph.
        </Empty>
      ) : inRange.length === 0 ? (
        <Empty>Nothing logged in this time range yet.</Empty>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <Stat
                key={s.label}
                label={s.label}
                value={s.value}
                tone={metric.tone}
              />
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {metric.kind === 'sum' ? (
                <BarChart data={series} margin={{ left: -10, right: 8 }}>
                  <CartesianGrid vertical={false} stroke="#f0e6ee" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={tickFormatter}
                    tick={{ fill: '#9188a0', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={16}
                  />
                  <YAxis
                    tick={{ fill: '#9188a0', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: '#f6eff8' }}
                    contentStyle={tooltipStyle}
                    labelFormatter={(k) =>
                      weekly
                        ? `Week of ${shortDate(String(k))}`
                        : shortDate(String(k))
                    }
                    formatter={(v) => [fmt(Number(v)), metric.label]}
                  />
                  <Bar
                    dataKey="value"
                    fill={color}
                    radius={[8, 8, 8, 8]}
                    maxBarSize={36}
                  />
                </BarChart>
              ) : (
                <AreaChart data={series} margin={{ left: -10, right: 8 }}>
                  <defs>
                    <linearGradient
                      id={`fill-${metric.id}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f0e6ee" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={tickFormatter}
                    tick={{ fill: '#9188a0', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={16}
                  />
                  <YAxis
                    domain={metric.unit === '/5' ? [0, 5] : ['auto', 'auto']}
                    tick={{ fill: '#9188a0', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelFormatter={(k) => shortDate(String(k))}
                    formatter={(v) => [fmt(Number(v)), metric.label]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={color}
                    strokeWidth={3}
                    fill={`url(#fill-${metric.id})`}
                    dot={{ r: 4, fill: '#fff', stroke: color, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  )
}

const tooltipStyle = {
  borderRadius: 16,
  border: '1px solid #f0e6ee',
  boxShadow: '0 8px 24px -12px rgba(120,90,150,0.35)',
  fontFamily: 'inherit',
}
