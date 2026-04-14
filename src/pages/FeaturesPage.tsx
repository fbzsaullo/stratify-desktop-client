/**
 * FeaturesPage — Gerenciamento de features (toggles)
 * Usuário ativa/desativa analyzers por aqui
 */
import { useAppStore } from '@/store/useAppStore'
import { Badge } from '@/components/ui/Badge'
import { clsx } from 'clsx'
import { Lock } from 'lucide-react'
import type { FeatureConfig } from '@/types'

const PHASE_MAP: Record<string, { phase: string; badge: 'success' | 'info' | 'warning' | 'neutral' }> = {
  'anti-noob-detector':  { phase: 'Fase 1', badge: 'success' },
  'crosshair-coach':     { phase: 'Fase 1', badge: 'success' },
  'utility-coach':       { phase: 'Fase 2', badge: 'info' },
  'round-iq-analyzer':   { phase: 'Fase 2', badge: 'info' },
  'clutch-analyzer':     { phase: 'Fase 2', badge: 'info' },
  'auto-clip-coach':     { phase: 'Fase 3', badge: 'warning' },
  'pro-player-comparison':{ phase: 'Fase 3', badge: 'warning' },
  'real-time-coach':     { phase: 'Fase 4', badge: 'neutral' },
  'roast-mode':          { phase: 'Fase 4', badge: 'neutral' },
}

function ToggleSwitch({ enabled, onChange, disabled }: { enabled: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={disabled ? undefined : onChange}
      disabled={disabled}
      className={clsx(
        'toggle-track w-11 h-6 focus-visible:ring-2 focus-visible:ring-primary/50',
        enabled ? 'bg-primary shadow-glow-primary' : 'bg-surface-overlay border border-border',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={clsx(
          'toggle-thumb',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  )
}

function FeatureRow({ feature }: { feature: FeatureConfig }) {
  const { toggleFeature } = useAppStore()
  const phaseInfo = PHASE_MAP[feature.id]
  const isPhase1 = phaseInfo?.phase === 'Fase 1'
  const isLocked = !isPhase1

  return (
    <div
      className={clsx(
        'flex items-start gap-4 p-4 rounded-card border transition-all duration-200',
        feature.enabled
          ? 'bg-primary/5 border-primary/25 shadow-sm'
          : 'bg-surface border-border-subtle',
        isLocked && 'opacity-60'
      )}
    >
      {/* Emoji icon */}
      <div className={clsx(
        'w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 mt-0.5',
        feature.enabled ? 'bg-primary/15' : 'bg-surface-raised'
      )}>
        {feature.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-subtitle font-semibold text-text-primary">{feature.name}</h3>
          {phaseInfo && (
            <Badge severity={phaseInfo.badge as any} label={phaseInfo.phase} />
          )}
          {isLocked && (
            <Badge severity="neutral" label="Em breve" />
          )}
        </div>
        <p className="text-body-sm text-text-secondary mt-1 leading-relaxed">
          {feature.description}
        </p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3 flex-shrink-0 mt-1">
        {isLocked && <Lock size={13} className="text-text-tertiary" />}
        <ToggleSwitch
          enabled={feature.enabled}
          onChange={() => toggleFeature(feature.id)}
          disabled={isLocked}
        />
      </div>
    </div>
  )
}

export function FeaturesPage() {
  const { features } = useAppStore()

  const phase1 = features.filter((f) => PHASE_MAP[f.id]?.phase === 'Fase 1')
  const phase2 = features.filter((f) => PHASE_MAP[f.id]?.phase === 'Fase 2')
  const phase3plus = features.filter((f) =>
    ['Fase 3', 'Fase 4'].includes(PHASE_MAP[f.id]?.phase ?? '')
  )

  function FeatureGroup({ title, items, description }: { title: string; items: FeatureConfig[]; description: string }) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="section-title">{title}</span>
          <div className="flex-1 divider" />
          <span className="text-caption-xs text-text-tertiary">{description}</span>
        </div>
        <div className="flex flex-col gap-2">
          {items.map((f) => <FeatureRow key={f.id} feature={f} />)}
        </div>
      </div>
    )
  }

  const activeCount = features.filter((f) => f.enabled).length

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 flex flex-col gap-6 max-w-[800px]">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-title-lg text-text-primary">Configurar Features</h1>
            <p className="text-body-sm text-text-secondary">
              Ative ou desative os analyzers. Cada feature consome eventos independentemente.
            </p>
          </div>
          <div className="card px-4 py-2 flex items-center gap-2">
            <span className="text-success text-lg">●</span>
            <span className="text-caption text-text-secondary">
              <span className="text-text-primary font-semibold">{activeCount}</span> ativa{activeCount !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Phase groups */}
        <FeatureGroup
          title="Fase 1 — MVP"
          items={phase1}
          description="Disponível agora"
        />
        <FeatureGroup
          title="Fase 2 — Análise Avançada"
          items={phase2}
          description="Em desenvolvimento"
        />
        <FeatureGroup
          title="Fases 3 & 4 — Real-Time"
          items={phase3plus}
          description="Planejado"
        />

        {/* Info footer */}
        <div className="card p-4 flex gap-3 bg-primary/5 border-primary/20">
          <span className="text-primary text-lg">ℹ️</span>
          <div className="flex flex-col gap-1">
            <p className="text-body-sm text-text-primary font-medium">Cada feature é independente</p>
            <p className="text-caption text-text-secondary">
              Features desativadas não consomem recursos. O backend processa apenas os eventos das features ativas.
              Isso é garantido pela arquitetura event-driven — cada analyzer é um worker autônomo.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
