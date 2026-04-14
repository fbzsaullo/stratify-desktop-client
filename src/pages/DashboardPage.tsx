import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { StatCard } from '@/components/ui/StatCard'
import { FeedbackCard } from '@/components/ui/FeedbackCard'
import { SkillBars } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import {
  MOCK_PLAYER,
  MOCK_MATCHES,
  MOCK_REPORT,
} from '@/services/mockData'
import { clsx } from 'clsx'
import { Upload, Play, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

// Format seconds to mm:ss
function formatDuration(s: number) {
  const m = Math.floor(s / 60)
  const remaining = s % 60
  return `${m}m ${remaining}s`
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffH = Math.floor(diffMs / 3600000)
  if (diffH < 1) return 'Agora há pouco'
  if (diffH < 24) return `${diffH}h atrás`
  const diffD = Math.floor(diffH / 24)
  return `${diffD}d atrás`
}

export function DashboardPage() {
  const { setPlayer, matches, addMatch } = useAppStore()

  // Load mock data on first render
  useEffect(() => {
    setPlayer(MOCK_PLAYER)
    if (matches.length === 0) {
      MOCK_MATCHES.forEach(addMatch)
    }
  }, [])

  const player = MOCK_PLAYER
  const recentMatches = MOCK_MATCHES.slice(0, 4)
  const topFeedbacks = MOCK_REPORT.feedbacks_by_analyzer['anti-noob-detector']?.slice(0, 2) || []
  const crosshairFeedbacks = MOCK_REPORT.feedbacks_by_analyzer['crosshair-coach']?.slice(0, 1) || []
  const criticalFeedbacks = [...topFeedbacks, ...crosshairFeedbacks]

  const winRate = Math.round(
    (recentMatches.filter((m) => m.result === 'win').length / recentMatches.length) * 100
  )

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-6 max-w-[1200px]">

        {/* === HEADER === */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-title-xl text-text-primary">
              Olá, <span className="text-gradient-primary">{player.display_name}</span> 👋
            </h1>
            <p className="text-body text-text-secondary">
              {player.rank} · {player.total_matches} partidas analisadas
            </p>
          </div>

          <button className="btn-primary gap-2">
            <Upload size={15} />
            Analisar Demo
          </button>
        </div>

        {/* === STATS ROW === */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Partidas Analisadas"
            value={player.total_matches}
            icon={<Play size={15} />}
            trend="up"
            trendLabel="+3 esta semana"
          />
          <StatCard
            label="Win Rate (recente)"
            value={`${winRate}%`}
            icon={<TrendingUp size={15} />}
            accent={winRate >= 50 ? 'success' : 'danger'}
            trend={winRate >= 50 ? 'up' : 'down'}
            trendLabel={winRate >= 50 ? 'Positivo' : 'Melhorar'}
          />
          <StatCard
            label="Score Médio"
            value="67"
            sub="/ 100"
            icon={<CheckCircle size={15} />}
            accent="primary"
            trend="up"
            trendLabel="+5 pts esta semana"
          />
          <StatCard
            label="Erros Críticos"
            value={MOCK_REPORT.summary.critical_errors}
            icon={<AlertTriangle size={15} />}
            accent="danger"
            trend="down"
            trendLabel="vs. última partida"
          />
        </div>

        {/* === MAIN GRID === */}
        <div className="grid grid-cols-3 gap-4">

          {/* LEFT — Skill Radar */}
          <div className="card p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="section-title">Habilidades</span>
              <div className="flex-1 divider" />
            </div>
            <SkillBars skills={player.skill_radar} />
            <p className="text-caption text-text-tertiary text-center mt-1">
              Baseado nas últimas {player.total_matches} partidas
            </p>
          </div>

          {/* CENTER + RIGHT — Feedbacks críticos */}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="section-title">Principais Erros Detectados</span>
              <div className="flex-1 divider" />
              <Badge severity="error" label="Fase 1 MVP" />
            </div>

            <div className="flex flex-col gap-2">
              {criticalFeedbacks.map((fb) => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}

              {criticalFeedbacks.length === 0 && (
                <div className="card p-8 flex flex-col items-center gap-2 text-center">
                  <span className="text-3xl">🎮</span>
                  <p className="text-subtitle text-text-primary">Nenhuma partida analisada ainda</p>
                  <p className="text-body-sm text-text-secondary">Arraste um arquivo .dem ou inicie uma sessão de gravação</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === MATCH HISTORY === */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="section-title">Partidas Recentes</span>
            <div className="flex-1 divider" />
            <button className="btn-ghost btn-sm text-caption">Ver todas →</button>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-subtle">
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Resultado</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Mapa</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Score</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Placar</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Duração</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Quando</th>
                  <th className="text-left px-4 py-3 text-caption text-text-tertiary font-medium">Erros</th>
                </tr>
              </thead>
              <tbody>
                {recentMatches.map((match, i) => (
                  <tr
                    key={match.id}
                    className={clsx(
                      'border-b border-border-subtle hover:bg-surface-raised transition-colors cursor-pointer',
                      i === recentMatches.length - 1 && 'border-0'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Badge
                        severity={match.result === 'win' ? 'success' : 'error'}
                        label={match.result === 'win' ? 'Vitória' : 'Derrota'}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-body-sm text-text-primary font-medium">
                        {match.map.replace('de_', '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={clsx(
                            'text-subtitle font-bold tabular',
                            match.overall_score >= 70 ? 'text-success' :
                            match.overall_score >= 50 ? 'text-warning' : 'text-danger'
                          )}
                        >
                          {match.overall_score}
                        </span>
                        <span className="text-caption text-text-tertiary">/ 100</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-body-sm tabular text-text-secondary">
                        {match.score_team} — {match.score_opponent}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-body-sm text-text-secondary tabular">
                        {formatDuration(match.duration_seconds)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-caption text-text-tertiary">
                        {formatDate(match.played_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        'text-body-sm font-medium tabular',
                        match.feedbacks_count >= 5 ? 'text-danger' :
                        match.feedbacks_count >= 3 ? 'text-warning' : 'text-success'
                      )}>
                        {match.feedbacks_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
