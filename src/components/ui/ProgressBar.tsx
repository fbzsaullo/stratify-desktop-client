import { clsx } from 'clsx'

interface ProgressBarProps {
  value: number      // 0-100
  max?: number
  color?: 'primary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
  label?: string
  className?: string
}

const COLOR_MAP = {
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
}

const SIZE_MAP = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2.5',
}

export function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  animated = false,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-caption text-text-secondary">{label}</span>
          <span className="text-caption font-medium text-text-primary tabular">{Math.round(pct)}</span>
        </div>
      )}
      <div className={clsx('progress-bar', SIZE_MAP[size])}>
        <div
          className={clsx(
            'progress-fill',
            COLOR_MAP[color],
            animated && 'animate-pulse-slow'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// Radar chart via CSS — 6 skill dims
interface SkillRadarProps {
  skills: Record<string, number> // 0-100
  size?: number
}

export function SkillBars({ skills }: SkillRadarProps) {
  const entries = Object.entries(skills)
  const colorFor = (v: number) =>
    v >= 70 ? 'success' : v >= 50 ? 'primary' : v >= 35 ? 'warning' : 'danger'

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {entries.map(([key, value]) => (
        <ProgressBar
          key={key}
          value={value}
          label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
          color={colorFor(value) as any}
          size="md"
        />
      ))}
    </div>
  )
}
