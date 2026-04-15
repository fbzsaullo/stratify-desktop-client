// ================================================================
// STRATIFY — TypeScript Types
// Espelha os JSON Schemas de stratify-shared-contracts
// ================================================================

export type Game = 'cs2' | 'valorant' | 'dota2'

export type FeedbackSeverity = 'info' | 'warning' | 'error' | 'success' | 'neutral'

export type FeedbackCategory =
  | 'aim'
  | 'utility'
  | 'decision_making'
  | 'positioning'
  | 'economy'
  | 'clutch'
  | 'movement'

export type AnalyzerName =
  | 'anti-noob-detector'
  | 'crosshair-coach'
  | 'utility-coach'
  | 'round-iq-analyzer'
  | 'clutch-analyzer'
  | 'auto-clip-coach'
  | 'pro-player-comparison'
  | 'real-time-coach'

// ----------------------------------------------------------------
// Feedback (output de um analyzer)
// ----------------------------------------------------------------
export interface Feedback {
  id: string | number
  analyzer: AnalyzerName
  severity: FeedbackSeverity
  category: FeedbackCategory
  title: string
  description?: string | null
  actionable_tip?: string | null
  confidence_score: number
  related_round?: number
  related_tick?: number
  occurred_at?: string
  match_id?: string
  player_id?: string
}

// ----------------------------------------------------------------
// Feature Config (toggles do usuário)
// ----------------------------------------------------------------
export interface FeatureConfig {
  id: AnalyzerName
  name: string
  description: string
  category: string
  enabled: boolean
  icon: string
}

// ----------------------------------------------------------------
// Match (sessão de partida)
// ----------------------------------------------------------------
export interface Match {
  id: string
  game: Game
  map: string
  mode: string
  played_at: string
  duration_seconds: number
  result: 'win' | 'loss' | 'draw'
  score_team: number
  score_opponent: number
  overall_score: number // 0-100 calculated
  feedbacks_count: number
  feedbacks: Feedback[]
}

// ----------------------------------------------------------------
// Player Stats
// ----------------------------------------------------------------
export interface PlayerStats {
  id: string
  display_name: string
  steam_id?: string
  avatar_url?: string
  rank?: string
  total_matches: number
  total_hours: number
  skill_radar: {
    aim: number          // 0-100
    utility: number
    game_sense: number
    clutch: number
    economy: number
    positioning: number
  }
  top_errors: Array<{
    category: FeedbackCategory
    count: number
    trend: 'improving' | 'worsening' | 'stable'
  }>
}

// ----------------------------------------------------------------
// Session (análise em andamento)
// ----------------------------------------------------------------
export type SessionStatus = 'idle' | 'analyzing' | 'done' | 'error'

export interface AnalysisSession {
  status: SessionStatus
  match_id?: string
  progress: number // 0-100
  current_step?: string
  feedbacks: Feedback[]
  events: Array<{ id: string; type: string; timestamp: string; payload: any }>
  error?: string
}

// ----------------------------------------------------------------
// Report (relatório final da Fase 1)
// ----------------------------------------------------------------
export interface MatchReport {
  match: Match
  summary: {
    total_errors: number
    critical_errors: number
    warnings: number
    top_category: FeedbackCategory
    overall_score: number
    improvement_areas: string[]
  }
  feedbacks_by_category: Partial<Record<FeedbackCategory, Feedback[]>>
  feedbacks_by_analyzer: Partial<Record<AnalyzerName, Feedback[]>>
}
