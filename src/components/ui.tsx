'use client'

import type { LucideIcon } from 'lucide-react'
import { Heart, X } from 'lucide-react'
import type { ReactNode } from 'react'

export type Tone = 'blush' | 'lavender' | 'mint' | 'peach' | 'sky' | 'butter'

export const tones: Record<
  Tone,
  { bg: string; soft: string; text: string; solid: string; hex: string }
> = {
  blush: {
    bg: 'bg-blush',
    soft: 'bg-blush/40',
    text: 'text-blush-deep',
    solid: 'bg-blush-deep',
    hex: '#e5809f',
  },
  lavender: {
    bg: 'bg-lavender',
    soft: 'bg-lavender/40',
    text: 'text-lavender-deep',
    solid: 'bg-lavender-deep',
    hex: '#9a84e0',
  },
  mint: {
    bg: 'bg-mint',
    soft: 'bg-mint/40',
    text: 'text-mint-deep',
    solid: 'bg-mint-deep',
    hex: '#57b48a',
  },
  peach: {
    bg: 'bg-peach',
    soft: 'bg-peach/40',
    text: 'text-peach-deep',
    solid: 'bg-peach-deep',
    hex: '#ee9466',
  },
  sky: {
    bg: 'bg-sky',
    soft: 'bg-sky/40',
    text: 'text-sky-deep',
    solid: 'bg-sky-deep',
    hex: '#649fdb',
  },
  butter: {
    bg: 'bg-butter',
    soft: 'bg-butter/50',
    text: 'text-butter-deep',
    solid: 'bg-butter-deep',
    hex: '#d4a92e',
  },
}

export function Card({
  title,
  icon: Icon,
  tone = 'lavender',
  action,
  className = '',
  children,
}: {
  title?: string
  icon?: LucideIcon
  tone?: Tone
  action?: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <section
      className={`rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_8px_30px_-12px_rgba(120,90,150,0.25)] backdrop-blur ${className}`}
    >
      {title && (
        <header className="mb-4 flex items-center gap-3">
          {Icon && (
            <span
              className={`grid size-9 place-items-center rounded-2xl ${tones[tone].bg} ${tones[tone].text}`}
            >
              <Icon size={18} strokeWidth={2.2} />
            </span>
          )}
          <h2 className="flex-1 text-lg font-semibold">{title}</h2>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

export function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-muted text-xs font-semibold tracking-wide uppercase">
        {label}
      </span>
      {children}
    </label>
  )
}

const inputBase =
  'rounded-2xl border border-line bg-white/90 px-3.5 py-2.5 text-ink placeholder:text-muted/60 outline-none transition focus:border-lavender-deep/60 focus:ring-4 focus:ring-lavender/60'

export const inputClass = `w-full ${inputBase}`
export const inputAutoClass = `w-auto ${inputBase}`

export function NumberInput({
  value,
  onChange,
  placeholder,
  step = 'any',
}: {
  value: number | undefined
  onChange: (v: number | undefined) => void
  placeholder?: string
  step?: string
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      className={inputClass}
      placeholder={placeholder}
      value={value ?? ''}
      onChange={(e) =>
        onChange(e.target.value === '' ? undefined : Number(e.target.value))
      }
    />
  )
}

export function Button({
  children,
  onClick,
  tone = 'lavender',
  variant = 'solid',
  type = 'button',
  disabled,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  tone?: Tone
  variant?: 'solid' | 'soft' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const styles = {
    solid: `${tones[tone].solid} text-white shadow-sm hover:brightness-105`,
    soft: `${tones[tone].bg} ${tones[tone].text} hover:brightness-[0.98]`,
    ghost: `text-muted hover:bg-line/60`,
  }[variant]
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  )
}

export function Chip({
  active,
  onClick,
  tone = 'lavender',
  children,
}: {
  active: boolean
  onClick: () => void
  tone?: Tone
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? `${tones[tone].bg} ${tones[tone].text} border-transparent`
          : 'border-line text-muted bg-white/70 hover:bg-white'
      }`}
    >
      {children}
    </button>
  )
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  tone = 'lavender',
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  tone?: Tone
}) {
  return (
    <div className="bg-line/60 inline-flex rounded-2xl p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-xl px-3.5 py-1.5 text-sm font-semibold transition ${
            value === o.value
              ? `bg-white shadow-sm ${tones[tone].text}`
              : 'text-muted hover:text-ink'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function ScorePicker({
  value,
  onChange,
  icon: Icon = Heart,
  tone = 'blush',
}: {
  value: number | undefined
  onChange: (v: number | undefined) => void
  icon?: LucideIcon
  tone?: Tone
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value !== undefined && n <= value
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} out of 5`}
            onClick={() => onChange(value === n ? undefined : n)}
            className={`transition hover:scale-110 ${filled ? tones[tone].text : 'text-line'}`}
          >
            <Icon
              size={30}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={filled ? 1.5 : 2}
              className={filled ? '' : 'text-muted/40'}
            />
          </button>
        )
      })}
      <span className="text-muted ml-2 text-sm font-semibold">
        {value ? `${value}/5` : 'Not rated'}
      </span>
    </div>
  )
}

export function Stat({
  label,
  value,
  tone = 'lavender',
}: {
  label: string
  value: ReactNode
  tone?: Tone
}) {
  return (
    <div className={`rounded-2xl p-4 ${tones[tone].soft}`}>
      <div className="text-muted text-xs font-semibold tracking-wide uppercase">
        {label}
      </div>
      <div className={`mt-1 text-2xl font-bold ${tones[tone].text}`}>
        {value}
      </div>
    </div>
  )
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Delete"
      onClick={onClick}
      className="text-muted/60 hover:bg-blush/60 hover:text-blush-deep grid size-7 shrink-0 place-items-center rounded-full transition"
    >
      <X size={15} />
    </button>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="border-line text-muted rounded-2xl border border-dashed px-4 py-6 text-center text-sm">
      {children}
    </p>
  )
}
