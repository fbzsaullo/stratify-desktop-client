import { clsx } from 'clsx'
import type { Feedback } from '@/types'
import { SeverityBadge } from './Badge'

interface FeedbackCardProps {
  feedback: Feedback
  compact?: boolean
  className?: string
}

const ANALYZER_LABELS: Record<string, string> = {
  'crosshair-coach':     'Crosshair Coach',
  'anti-noob-detector':  'Anti-Noob Detector',
  'utility-coach':       'Utility Coach',
  'round-iq-analyzer':   'Round IQ',
  'clutch-analyzer':     'Clutch Analyzer',
}

const CATEGORY_ICONS: Record<string, string> = {
  aim:             '🎯',
  utility:         '💣',
  decision_making: '🧠',
  positioning:     '📍',
  economy:         '💰',
  clutch:          '⚡',
  movement:        '🏃',
}

const SEVERITY_LEFT_BORDER: Record<string, string> = {
  error:   'border-l-danger',
  warning: 'border-l-warning',
  success: 'border-l-success',
  info:    'border-l-primary',
}

const SEVERITY_BG: Record<string, string> = {
  error:   'bg-danger/5',
  warning: 'bg-warning/5',
  success: 'bg-success/5',
  info:    'bg-primary/5',
}

export function FeedbackCard({ feedback, compact = false, className }: FeedbackCardProps) {
  return (
    <div
      className={clsx(
        'feedback-item border-l-2',
        SEVERITY_LEFT_BORDER[feedback.severity],
        SEVERITY_BG[feedback.severity],
        className
      )}
    >
      {/* Category icon */}
      <div className="text-xl flex-shrink-0 mt-0.5">
        {CATEGORY_ICONS[feedback.category] || '📊'}
      </div>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-body font-medium text-text-primary leading-tight">
            {feedback.title}
          </h4>
          <SeverityBadge severity={feedback.severity} />
        </div>

        {/* Analyzer tag */}
        <span className="text-caption-xs text-text-tertiary font-medium uppercase tracking-wider">
          {ANALYZER_LABELS[feedback.analyzer] || feedback.analyzer}
          {feedback.related_round && ` · Round ${feedback.related_round}`}
        </span>

        {/* Description */}
        {!compact && (
          <p className="text-body-sm text-text-secondary leading-relaxed" data-selectable>
            {feedback.description}
          </p>
        )}

        {/* Actionable tip */}
        {!compact && (
          <div className="flex gap-2 mt-1 p-2.5 bg-surface-raised rounded-lg border border-border-subtle">
            <span className="text-primary text-base flex-shrink-0">💡</span>
            <p className="text-body-sm text-text-secondary" data-selectable>
              <span className="text-primary font-medium">O que fazer: </span>
              {feedback.actionable_tip}
            </p>
          </div>
        )}

        {/* Confidence */}
        {!compact && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="h-1 w-16 bg-surface-overlay rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full"
                style={{ width: `${feedback.confidence_score * 100}%` }}
              />
            </div>
            <span className="text-caption-xs text-text-tertiary tabular">
              {Math.round(feedback.confidence_score * 100)}% confiança
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
