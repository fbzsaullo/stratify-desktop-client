import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  className?: string
  accent?: 'primary' | 'success' | 'warning' | 'danger'
}

const ACCENT_COLORS = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger:  'text-danger',
}

const TREND_ICONS = {
  up:      '↑',
  down:    '↓',
  neutral: '→',
}

const TREND_COLORS = {
  up:      'text-success',
  down:    'text-danger',
  neutral: 'text-text-tertiary',
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  trend,
  trendLabel,
  className,
  accent,
}: StatCardProps) {
  return (
    <div className={clsx('stat-card', className)}>
      <div className="flex items-start justify-between">
        <span className="stat-label">{label}</span>
        {icon && (
          <span className="text-lg text-text-tertiary">{icon}</span>
        )}
      </div>

      <div className="flex items-end gap-2 mt-1">
        <span className={clsx('stat-value', accent && ACCENT_COLORS[accent])}>
          {value}
        </span>
        {sub && (
          <span className="text-caption text-text-tertiary mb-1">{sub}</span>
        )}
      </div>

      {trend && trendLabel && (
        <div className={clsx('flex items-center gap-1 text-caption-xs', TREND_COLORS[trend])}>
          <span>{TREND_ICONS[trend]}</span>
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  )
}
