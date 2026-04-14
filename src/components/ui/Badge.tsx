import { clsx } from 'clsx'
import type { FeedbackSeverity } from '@/types'

interface BadgeProps {
  severity?: FeedbackSeverity
  label: string
  dot?: boolean
  className?: string
}

const SEVERITY_MAP: Record<FeedbackSeverity, string> = {
  error:   'badge-error',
  warning: 'badge-warning',
  success: 'badge-success',
  info:    'badge-info',
  neutral: 'badge-neutral',
}

const SEVERITY_LABELS: Record<FeedbackSeverity, string> = {
  error:   'Crítico',
  warning: 'Atenção',
  success: 'Ótimo',
  info:    'Info',
  neutral: '...',
}

const DOT_COLORS: Record<FeedbackSeverity, string> = {
  error:   'bg-danger',
  warning: 'bg-warning',
  success: 'bg-success',
  info:    'bg-primary',
  neutral: 'bg-text-tertiary',
}

export function Badge({ severity = 'info', label, dot = false, className }: BadgeProps) {
  return (
    <span className={clsx(SEVERITY_MAP[severity], className)}>
      {dot && (
        <span className={clsx('severity-dot', DOT_COLORS[severity])} />
      )}
      {label || SEVERITY_LABELS[severity]}
    </span>
  )
}

export function SeverityBadge({ severity }: { severity: FeedbackSeverity }) {
  return <Badge severity={severity} label={SEVERITY_LABELS[severity]} dot />
}
