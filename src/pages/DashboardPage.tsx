import { useEffect } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { clsx } from 'clsx'
import { Upload, Play, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { StatCard } from '@/components/ui/StatCard'
import { Badge } from '@/components/ui/Badge'
import { SkillBars } from '@/components/ui/ProgressBar'

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
  const { matches, fetchMatches, setActivePage, fetchReport } = useAppStore()
  const player = useAppStore((s) => s.player)

  // Load real data on first render + polling
  useEffect(() => {
    fetchMatches()
    const int = setInterval(fetchMatches, 10000) // Poll matches every 10s
    return () => clearInterval(int)
  }, [fetchMatches])

  const recentMatches = matches.slice(0, 4)
  const winRate = recentMatches.length > 0 
    ? Math.round((recentMatches.filter((m) => m.result === 'win').length / recentMatches.length) * 100)
    : 0

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-6 max-w-[1200px]">

        {/* === HEADER === */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-title-xl text-text-primary">
              Olá, <span className="text-gradient-primary">{player?.display_name || 'Jogador'}</span> 👋
            </h1>
            <p className="text-body text-text-secondary">
              {player ? `${player.rank} · ${player.total_matches} partidas analisadas` : 'Buscando perfil...'}
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
            value={player?.total_matches || 0}
            icon={<Play size={15} />}
            trend="up"
            trendLabel="Sincronizado"
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
            value={recentMatches[0]?.feedback_count || 0}
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
            {player ? (
              <SkillBars skills={player.skill_radar} />
            ) : (
              <div className="flex flex-1 items-center justify-center text-caption text-text-tertiary">
                Aguardando dados de habilidade...
              </div>
            )}
            <p className="text-caption text-text-tertiary text-center mt-1">
              Baseado nas partidas reais analisadas
            </p>
          </div>

          {/* CENTER — Live Coach Feed */}
          <div className="col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="section-title">Live Coach Feed</span>
              <div className="flex-1 divider" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-[10px] font-bold text-success uppercase tracking-wider">Listening</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-h-[140px]">
              {useAppStore.getState().liveFeedbacks.length === 0 ? (
                <div className="card p-6 flex flex-col items-center justify-center gap-2 text-center border-dashed border-border-subtle bg-transparent">
                  <p className="text-body-sm text-text-tertiary">Aguardando eventos do CS2...</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {useAppStore((s) => s.liveFeedbacks).map((fb) => (
                    <div 
                      key={fb.id} 
                      className="card p-3 bg-surface-raised border-l-4 border-l-primary flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-500"
                    >
                      <div className="text-xl mt-0.5">
                        {fb.severity === 'error' ? '🚫' : fb.severity === 'warning' ? '⚠️' : '🎯'}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-body-sm font-bold text-text-primary">{fb.title}</span>
                        <p className="text-caption text-text-secondary">{fb.actionable_tip || fb.description}</p>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => useAppStore.getState().clearLiveFeed()}
                    className="text-[10px] text-text-tertiary hover:text-text-secondary w-fit ml-auto uppercase tracking-wider"
                  >
                    Limpar Feed
                  </button>
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
                    onClick={() => {
                      fetchReport(match.id)
                      setActivePage('report')
                    }}
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
                        {match.score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-body-sm text-text-secondary tabular">
                        {formatDuration(match.duration_seconds || 0)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-caption text-text-tertiary">
                        {formatDate(match.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={clsx(
                        'text-body-sm font-medium tabular',
                        match.feedback_count >= 5 ? 'text-danger' :
                        match.feedback_count >= 3 ? 'text-warning' : 'text-success'
                      )}>
                        {match.feedback_count}
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
