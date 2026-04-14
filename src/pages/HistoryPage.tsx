import { useState } from 'react'
import { MOCK_MATCHES } from '@/services/mockData'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatDuration(s: number) {
  return `${Math.floor(s / 60)}m`
}

export function HistoryPage() {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all')

  const filtered = MOCK_MATCHES.filter((m) =>
    filter === 'all' ? true : m.result === filter
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-5 max-w-[900px]">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-title-lg text-text-primary">Histórico de Partidas</h1>
            <p className="text-body-sm text-text-secondary mt-1">
              {MOCK_MATCHES.length} partidas analisadas
            </p>
          </div>

          {/* Filters */}
          <div className="flex gap-1 p-1 bg-surface rounded-btn border border-border-subtle">
            {(['all', 'win', 'loss'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded text-caption font-medium transition-all',
                  filter === f
                    ? 'bg-surface-raised text-text-primary'
                    : 'text-text-tertiary hover:text-text-secondary'
                )}
              >
                {f === 'all' ? 'Todas' : f === 'win' ? 'Vitórias' : 'Derrotas'}
              </button>
            ))}
          </div>
        </div>

        {/* Match list */}
        <div className="flex flex-col gap-2">
          {filtered.map((match) => (
            <div
              key={match.id}
              className="card card-hover p-4 flex items-center gap-4"
            >
              {/* Result stripe */}
              <div className={clsx(
                'w-1 h-10 rounded-full flex-shrink-0',
                match.result === 'win' ? 'bg-success' : 'bg-danger'
              )} />

              {/* Map */}
              <div className="w-24 flex-shrink-0">
                <p className="text-subtitle font-semibold text-text-primary">
                  {match.map.replace('de_', '').toUpperCase()}
                </p>
                <p className="text-caption text-text-tertiary">{match.mode}</p>
              </div>

              {/* Score */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Badge
                    severity={match.result === 'win' ? 'success' : 'error'}
                    label={match.result === 'win' ? 'Vitória' : 'Derrota'}
                  />
                  <span className="text-body-sm text-text-secondary tabular">
                    {match.score_team} — {match.score_opponent}
                  </span>
                </div>
              </div>

              {/* Overall score */}
              <div className="text-center w-16">
                <p className={clsx(
                  'text-title font-bold tabular',
                  match.overall_score >= 70 ? 'text-success glow-text-success' :
                  match.overall_score >= 50 ? 'text-warning' : 'text-danger'
                )}>
                  {match.overall_score}
                </p>
                <p className="text-caption-xs text-text-tertiary">SCORE</p>
              </div>

              {/* Errors */}
              <div className="text-center w-16">
                <p className={clsx(
                  'text-subtitle font-semibold tabular',
                  match.feedbacks_count >= 5 ? 'text-danger' :
                  match.feedbacks_count >= 3 ? 'text-warning' : 'text-success'
                )}>
                  {match.feedbacks_count}
                </p>
                <p className="text-caption-xs text-text-tertiary">ERROS</p>
              </div>

              {/* Duration & date */}
              <div className="text-right w-24">
                <p className="text-caption text-text-secondary tabular">{formatDuration(match.duration_seconds)}</p>
                <p className="text-caption-xs text-text-tertiary">{formatDate(match.played_at)}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
