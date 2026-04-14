/**
 * ReportPage — Fase 1 MVP
 *
 * Apresenta o relatório completo de uma análise:
 * - Anti-Noob Detector: mortes sem util, reload ruim, spray longo
 * - Crosshair Coach: placement médio, % baixo, dica acionável
 *
 * Input: MOCK_REPORT (substituir por API call ao Core Backend)
 */
import { useState } from 'react'
import { FeedbackCard } from '@/components/ui/FeedbackCard'
import { StatCard } from '@/components/ui/StatCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { MOCK_REPORT } from '@/services/mockData'
import { clsx } from 'clsx'
import { Target, ShieldAlert, ChevronDown, ChevronUp, Info } from 'lucide-react'
import type { Feedback } from '@/types'

// CATEGORY_LABELS não está sendo usado no momento na UI deste componente

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70 ? '#22C55E' :
    score >= 50 ? '#F59E0B' : '#EF4444'

  const r = 44
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      <svg width="112" height="112" className="-rotate-90 absolute">
        <circle cx="56" cy="56" r={r} fill="none" stroke="#1A2233" strokeWidth="8" />
        <circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 1s ease-out', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-title-xl font-bold tabular" style={{ color }}>
          {score}
        </span>
        <span className="text-caption-xs text-text-tertiary uppercase tracking-wide">Score</span>
      </div>
    </div>
  )
}

function AnalyzerSection({
  title,
  icon,
  feedbacks,
  defaultExpanded = true,
}: {
  title: string
  icon: string
  feedbacks: Feedback[]
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  const errors   = feedbacks.filter((f) => f.severity === 'error').length
  const warnings = feedbacks.filter((f) => f.severity === 'warning').length
  const successes = feedbacks.filter((f) => f.severity === 'success').length

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-surface-raised/50 transition-colors"
      >
        <span className="text-xl">{icon}</span>
        <div className="flex-1 flex items-center gap-3 text-left">
          <h3 className="text-subtitle font-semibold text-text-primary">{title}</h3>
          <div className="flex gap-1.5">
            {errors   > 0 && <Badge severity="error"   label={`${errors} crítico${errors > 1 ? 's' : ''}`} dot />}
            {warnings > 0 && <Badge severity="warning" label={`${warnings} ${warnings > 1 ? 'atenções' : 'atenção'}`} dot />}
            {successes > 0 && <Badge severity="success" label={`${successes} ótimo${successes > 1 ? 's' : ''}`} dot />}
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />}
      </button>

      {/* Content */}
      {expanded && (
        <div className="border-t border-border-subtle px-5 py-4 flex flex-col gap-2 animate-slide-up">
          {feedbacks.length === 0 ? (
            <p className="text-body-sm text-text-tertiary text-center py-4">
              Nenhum feedback gerado por este analyzer nesta partida.
            </p>
          ) : (
            feedbacks.map((fb) => (
              <FeedbackCard key={fb.id} feedback={fb} />
            ))
          )}
        </div>
      )}
    </div>
  )
}

function CrosshairMetrics() {
  // Métricas simuladas de crosshair coach
  const metrics = [
    { label: 'Mira na altura correta', value: 29, color: 'danger' as const },
    { label: 'Pre-aim em ângulos conhecidos', value: 42, color: 'warning' as const },
    { label: 'Headshots obtidos', value: 38, color: 'warning' as const },
    { label: 'Duelos com flick necessário', value: 71, color: 'danger' as const },
  ]

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Target size={15} className="text-primary" />
        <span className="section-title">Métricas — Crosshair Coach</span>
      </div>
      <div className="flex flex-col gap-3">
        {metrics.map(({ label, value, color }) => (
          <ProgressBar
            key={label}
            label={label}
            value={value}
            color={color}
            size="md"
          />
        ))}
      </div>
      <div className="flex gap-2 p-3 bg-primary/5 border border-primary/15 rounded-lg">
        <Info size={14} className="text-primary flex-shrink-0 mt-0.5" />
        <p className="text-caption text-text-secondary">
          Ideal: mira na altura correta em &gt;60% das entradas. Seu score atual indica necessidade de treino de pre-aim.
        </p>
      </div>
    </div>
  )
}

function AntiNoobMetrics() {
  const patterns = [
    { icon: '🔄', label: 'Reloads em posição exposta', count: 6, severity: 'warning' as const },
    { icon: '💀', label: 'Mortes com util intacta', count: 4, severity: 'error' as const },
    { icon: '🔫', label: 'Spray fora do alcance', count: 9, severity: 'warning' as const },
  ]

  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <ShieldAlert size={15} className="text-danger" />
        <span className="section-title">Contagem de Erros — Anti-Noob</span>
      </div>
      <div className="flex flex-col gap-2">
        {patterns.map(({ icon, label, count, severity }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-surface-raised hover:bg-surface-overlay transition-colors"
          >
            <span className="text-lg">{icon}</span>
            <span className="flex-1 text-body-sm text-text-secondary">{label}</span>
            <div className="flex items-center gap-2">
              <span className={clsx(
                'text-subtitle font-bold tabular',
                severity === 'error' ? 'text-danger shadow-glow-danger' :
                severity === 'warning' ? 'text-warning' : 'text-success'
              )}>
                {count}x
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReportPage() {
  const report        = MOCK_REPORT
  const { summary }   = report

  const antiNoobFbs   = report.feedbacks_by_analyzer['anti-noob-detector'] || []
  const crosshairFbs  = report.feedbacks_by_analyzer['crosshair-coach']    || []

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-5 max-w-[1200px]">

        {/* === HEADER === */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-title-lg text-text-primary">Relatório da Partida</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              {report.match.map.replace('de_', '').toUpperCase()} · {report.match.mode} ·{' '}
              {new Date(report.match.played_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <Badge
            severity={report.match.result === 'win' ? 'success' : 'error'}
            label={report.match.result === 'win' ? `Vitória ${report.match.score_team}–${report.match.score_opponent}` : `Derrota ${report.match.score_team}–${report.match.score_opponent}`}
          />
        </div>

        {/* === SUMMARY ROW === */}
        <div className="grid grid-cols-5 gap-3">
          {/* Score ring */}
          <div className="card p-4 flex flex-col items-center justify-center gap-1 col-span-1">
            <ScoreRing score={summary.overall_score} />
            <span className="text-caption text-text-tertiary text-center">Desempenho Geral</span>
          </div>

          <StatCard
            label="Erros Críticos"
            value={summary.critical_errors}
            accent="danger"
            icon="🔴"
            trend="down"
            trendLabel="vs. média"
          />
          <StatCard
            label="Avisos"
            value={summary.total_errors - summary.critical_errors}
            accent="warning"
            icon="🟡"
          />
          <StatCard
            label="Feedbacks Gerados"
            value={antiNoobFbs.length + crosshairFbs.length}
            accent="primary"
            icon="📊"
          />
          <StatCard
            label="Área Principal"
            value={summary.top_category === 'aim' ? 'Mira' : summary.top_category}
            sub="para melhorar"
            icon="🎯"
          />
        </div>

        {/* === IMPROVEMENT AREAS === */}
        <div className="card p-4 flex items-center gap-4">
          <span className="text-caption text-text-tertiary whitespace-nowrap">Focar nesta semana:</span>
          <div className="flex gap-2 flex-wrap">
            {summary.improvement_areas.map((area) => (
              <Badge key={area} severity="info" label={area} />
            ))}
          </div>
        </div>

        {/* === METRICS === */}
        <div className="grid grid-cols-2 gap-4">
          <CrosshairMetrics />
          <AntiNoobMetrics />
        </div>

        {/* === DETAILED FEEDBACKS === */}
        <div className="flex flex-col gap-3">
          <span className="section-title">Feedbacks Detalhados</span>

          <AnalyzerSection
            title="Anti-Noob Detector"
            icon="🚫"
            feedbacks={antiNoobFbs}
            defaultExpanded
          />

          <AnalyzerSection
            title="Crosshair Coach"
            icon="🎯"
            feedbacks={crosshairFbs}
            defaultExpanded
          />
        </div>

      </div>
    </div>
  )
}
