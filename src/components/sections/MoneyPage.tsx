'use client'

import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  PiggyBank,
  Plus,
  Receipt,
  Settings2,
} from 'lucide-react'
import { useState } from 'react'
import ChartPanel from '../ChartPanel'
import {
  addMonths,
  money,
  monthKey,
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
  NumberInput,
  PageHeader,
  Stat,
  inputAutoClass,
  inputClass,
} from '../ui'

export default function MoneyPage({ data }: { data: Data }) {
  const [month, setMonth] = useState(() => monthKey(todayKey()))

  return (
    <>
      <PageHeader title="Money" subtitle="Budget, spending and savings">
        <div className="flex items-center gap-2">
          <Button
            variant="soft"
            tone="sky"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="min-w-36 text-center font-semibold">
            {prettyMonth(month)}
          </span>
          <Button
            variant="soft"
            tone="sky"
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </PageHeader>
      <div className="grid gap-5 xl:grid-cols-2">
        <BalanceCard data={data} />
        <BudgetCard data={data} month={month} />
        <ExpenseCard data={data} month={month} />
        <ChartPanel
          data={data}
          title="Money graph"
          metricIds={['balance', 'spending']}
        />
      </div>
    </>
  )
}

function BalanceCard({ data }: { data: Data }) {
  const [amount, setAmount] = useState<number>()
  const [date, setDate] = useState(todayKey)
  const sorted = [...data.balances].sort((a, b) => b.date.localeCompare(a.date))
  const [latest, previous] = sorted
  const diff = latest && previous ? latest.amount - previous.amount : undefined

  return (
    <Card title="Bank account" icon={Landmark} tone="mint">
      <div className="from-mint to-sky mb-4 rounded-3xl bg-gradient-to-br p-5">
        <div className="text-mint-deep text-sm font-semibold">
          Current balance
        </div>
        <div className="font-display text-4xl font-semibold">
          {latest ? money(latest.amount) : '—'}
        </div>
        <div className="text-muted mt-1 text-sm">
          {latest
            ? `Updated ${shortDate(latest.date)}`
            : 'Add your balance below'}
          {diff !== undefined &&
            ` · ${diff >= 0 ? '+' : ''}${money(diff)} since ${shortDate(previous.date)}`}
        </div>
      </div>
      <form
        className="flex flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (amount === undefined) return
          update((d) => ({
            ...d,
            balances: [
              ...d.balances.filter((b) => b.date !== date),
              { id: newId(), date, amount },
            ],
          }))
          setAmount(undefined)
        }}
      >
        <div className="min-w-32 flex-1">
          <NumberInput
            value={amount}
            onChange={setAmount}
            placeholder="$ balance"
          />
        </div>
        <input
          type="date"
          className={`${inputAutoClass}`}
          value={date}
          onChange={(e) => e.target.value && setDate(e.target.value)}
        />
        <Button type="submit" tone="mint" disabled={amount === undefined}>
          Update
        </Button>
      </form>
      {sorted.length > 1 && (
        <ul className="mt-3 grid gap-1 text-sm">
          {sorted.slice(1, 5).map((b) => (
            <li
              key={b.id}
              className="text-muted flex items-center justify-between px-1"
            >
              <span>{shortDate(b.date)}</span>
              <span className="flex items-center gap-2">
                {money(b.amount)}
                <DeleteButton
                  onClick={() =>
                    update((d) => ({
                      ...d,
                      balances: d.balances.filter((x) => x.id !== b.id),
                    }))
                  }
                />
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

function BudgetCard({ data, month }: { data: Data; month: string }) {
  const [editing, setEditing] = useState(false)
  const spentBy = (id: string) =>
    data.expenses
      .filter((e) => e.categoryId === id && monthKey(e.date) === month)
      .reduce((s, e) => s + e.amount, 0)
  const totalBudget = data.budget.reduce((s, c) => s + c.amount, 0)
  const totalSpent = data.expenses
    .filter((e) => monthKey(e.date) === month)
    .reduce((s, e) => s + e.amount, 0)

  const setCat = (id: string, patch: { name?: string; amount?: number }) =>
    update((d) => ({
      ...d,
      budget: d.budget.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))

  return (
    <Card
      title="Monthly budget"
      icon={PiggyBank}
      tone="sky"
      action={
        <Button variant="ghost" onClick={() => setEditing(!editing)}>
          <Settings2 size={15} /> {editing ? 'Done' : 'Edit'}
        </Button>
      }
    >
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat label="Budget" value={money(totalBudget)} tone="sky" />
        <Stat label="Spent" value={money(totalSpent)} tone="peach" />
        <Stat
          label="Left"
          value={money(totalBudget - totalSpent)}
          tone={totalBudget - totalSpent >= 0 ? 'mint' : 'blush'}
        />
      </div>
      {editing ? (
        <div className="grid gap-2">
          {data.budget.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input
                className={inputClass}
                value={c.name}
                onChange={(e) => setCat(c.id, { name: e.target.value })}
              />
              <div className="w-32">
                <NumberInput
                  value={c.amount}
                  onChange={(v) => setCat(c.id, { amount: v ?? 0 })}
                />
              </div>
              <DeleteButton
                onClick={() =>
                  confirm(`Remove the ${c.name} category?`) &&
                  update((d) => ({
                    ...d,
                    budget: d.budget.filter((x) => x.id !== c.id),
                  }))
                }
              />
            </div>
          ))}
          <Button
            variant="soft"
            tone="sky"
            className="justify-self-start"
            onClick={() =>
              update((d) => ({
                ...d,
                budget: [
                  ...d.budget,
                  { id: newId(), name: 'New category', amount: 0 },
                ],
              }))
            }
          >
            <Plus size={15} /> Add category
          </Button>
        </div>
      ) : (
        <ul className="grid gap-3">
          {data.budget.map((c) => {
            const spent = spentBy(c.id)
            const pct = c.amount
              ? Math.min(100, (spent / c.amount) * 100)
              : spent
                ? 100
                : 0
            const over = spent > c.amount
            return (
              <li key={c.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{c.name}</span>
                  <span
                    className={
                      over ? 'text-blush-deep font-semibold' : 'text-muted'
                    }
                  >
                    {money(spent)} / {money(c.amount)}
                  </span>
                </div>
                <div className="bg-line/70 h-3 overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full transition-all ${over ? 'bg-blush-deep' : 'bg-sky-deep/70'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}

function ExpenseCard({ data, month }: { data: Data; month: string }) {
  const [amount, setAmount] = useState<number>()
  const [categoryId, setCategoryId] = useState(data.budget[0]?.id ?? '')
  const [date, setDate] = useState(todayKey)
  const [note, setNote] = useState('')
  const cat = data.budget.some((c) => c.id === categoryId)
    ? categoryId
    : data.budget[0]?.id
  const expenses = data.expenses
    .filter((e) => monthKey(e.date) === month)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Card title="Spending" icon={Receipt} tone="peach">
      <form
        className="mb-4 grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!amount || !cat) return
          update((d) => ({
            ...d,
            expenses: [
              ...d.expenses,
              {
                id: newId(),
                date,
                amount,
                categoryId: cat,
                note: note.trim() || undefined,
              },
            ],
          }))
          setAmount(undefined)
          setNote('')
        }}
      >
        <Field label="Amount">
          <NumberInput
            value={amount}
            onChange={setAmount}
            placeholder="$0.00"
          />
        </Field>
        <Field label="Category">
          <select
            className={inputClass}
            value={cat}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {data.budget.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="What for">
          <input
            className={inputClass}
            value={note}
            placeholder="Trader Joe's"
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
        <Field label="Date">
          <input
            type="date"
            className={inputClass}
            value={date}
            onChange={(e) => e.target.value && setDate(e.target.value)}
          />
        </Field>
        <Button
          type="submit"
          tone="peach"
          disabled={!amount || !cat}
          className="sm:col-span-2"
        >
          Add expense
        </Button>
      </form>
      {expenses.length === 0 ? (
        <Empty>No spending logged for {prettyMonth(month)}.</Empty>
      ) : (
        <ul className="grid gap-1.5">
          {expenses.map((e) => (
            <li
              key={e.id}
              className="ring-line flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2.5 ring-1"
            >
              <span className="text-muted w-14 text-xs">
                {shortDate(e.date)}
              </span>
              <span className="flex-1">
                <span className="font-semibold">{e.note || 'Expense'}</span>{' '}
                <span className="text-muted text-xs">
                  {data.budget.find((c) => c.id === e.categoryId)?.name ??
                    'Uncategorized'}
                </span>
              </span>
              <span className="font-semibold">{money(e.amount)}</span>
              <DeleteButton
                onClick={() =>
                  update((d) => ({
                    ...d,
                    expenses: d.expenses.filter((x) => x.id !== e.id),
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
