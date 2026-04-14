/**
 * Mock data para desenvolvimento local (Fase 1 — sem backend)
 * Substitua por chamadas à API REST do Core Backend (Rails) quando disponível
 */
import type { Match, PlayerStats, MatchReport, Feedback } from '@/types'

// ----------------------------------------------------------------
// PLAYER MOCK
// ----------------------------------------------------------------
export const MOCK_PLAYER: PlayerStats = {
  id: 'player-1',
  display_name: 'FabrizioCS',
  steam_id: '76561198000000000',
  rank: 'Master Guardian Elite',
  total_matches: 47,
  total_hours: 342,
  skill_radar: {
    aim: 62,
    utility: 45,
    game_sense: 58,
    clutch: 41,
    economy: 70,
    positioning: 53,
  },
  top_errors: [
    { category: 'aim', count: 23, trend: 'improving' },
    { category: 'utility', count: 18, trend: 'worsening' },
    { category: 'decision_making', count: 14, trend: 'stable' },
  ],
}

// ----------------------------------------------------------------
// FEEDBACKS MOCK
// ----------------------------------------------------------------
export const MOCK_FEEDBACKS: Feedback[] = [
  {
    id: 'fb-001',
    analyzer: 'crosshair-coach',
    severity: 'warning',
    category: 'aim',
    title: 'Crosshair consistentemente baixo — 71% dos duelos',
    description:
      'Sua mira estava abaixo da cintura em 71% das entradas em ângulo nesta partida. Isso gera um flick adicional médio de ~13°, equivalente a ~80ms de desvantagem.',
    actionable_tip:
      'Mantenha a crosshair na altura da cabeça ao aproximar-se de ângulos conhecidos. Pratique no mapa "Aim Botz" focando em pre-aim.',
    confidence_score: 0.88,
    related_round: 7,
    occurred_at: new Date().toISOString(),
    match_id: 'match-001',
    player_id: 'player-1',
  },
  {
    id: 'fb-002',
    analyzer: 'anti-noob-detector',
    severity: 'warning',
    category: 'movement',
    title: 'Reload em posição exposta — detecção múltipla',
    description:
      'Você recarregou a arma enquanto estava em linha de visão inimiga 6 vezes. No Round 4, você recarregou no meio do Meio (Dust2) sem cobertura.',
    actionable_tip:
      'Sempre recue para cobertura antes de recarregar. Se não há cobertura, troque para a pistola.',
    confidence_score: 0.82,
    related_round: 4,
    occurred_at: new Date().toISOString(),
    match_id: 'match-001',
    player_id: 'player-1',
  },
  {
    id: 'fb-003',
    analyzer: 'anti-noob-detector',
    severity: 'error',
    category: 'economy',
    title: 'Morte com utilidade intacta — 4 vezes',
    description:
      'Você morreu com smokes ou flashes intactos 4 vezes. No Round 12, você morreu com 1 smoke e 2 flashes no bolso sem usá-los.',
    actionable_tip:
      'Utilize suas granadas defensivamente antes de pecar. Granadas guardadas em uma morte são perda de dinheiro.',
    confidence_score: 0.95,
    related_round: 12,
    occurred_at: new Date().toISOString(),
    match_id: 'match-001',
    player_id: 'player-1',
  },
  {
    id: 'fb-004',
    analyzer: 'anti-noob-detector',
    severity: 'warning',
    category: 'aim',
    title: 'Spray longo fora do alcance (AK-47)',
    description:
      'Em 9 de 15 mortes com AK-47, a distância era superior a 750 unidades. AK tem acurácia efetiva até ~500u em burst.',
    actionable_tip: 'Tente bursts de 3 tiros em distâncias longas em vez de segurar o spray.',
    confidence_score: 0.89,
    related_round: 15,
    occurred_at: new Date().toISOString(),
    match_id: 'match-001',
    player_id: 'player-1',
  },
]

// ----------------------------------------------------------------
// MATCH MOCK
// ----------------------------------------------------------------
export const MOCK_MATCH: Match = {
  id: 'match-001',
  game: 'cs2',
  map: 'de_dust2',
  mode: 'Competitive',
  played_at: new Date(Date.now() - 3600000).toISOString(),
  duration_seconds: 3840,
  result: 'loss',
  score_team: 11,
  score_opponent: 16,
  overall_score: 62,
  feedbacks_count: MOCK_FEEDBACKS.length,
  feedbacks: MOCK_FEEDBACKS,
}

// ----------------------------------------------------------------
// MATCH REPORT MOCK
// ----------------------------------------------------------------
export const MOCK_REPORT: MatchReport = {
  match: MOCK_MATCH,
  summary: {
    total_errors: 4,
    critical_errors: 1,
    warnings: 3,
    top_category: 'aim',
    overall_score: 62,
    improvement_areas: ['Crosshair placement', 'Spray control', 'Utility usage'],
  },
  feedbacks_by_category: {
    aim: MOCK_FEEDBACKS.filter((f) => f.category === 'aim'),
    economy: MOCK_FEEDBACKS.filter((f) => f.category === 'economy'),
    movement: MOCK_FEEDBACKS.filter((f) => f.category === 'movement'),
  },
  feedbacks_by_analyzer: {
    'crosshair-coach': MOCK_FEEDBACKS.filter((f) => f.analyzer === 'crosshair-coach'),
    'anti-noob-detector': MOCK_FEEDBACKS.filter((f) => f.analyzer === 'anti-noob-detector'),
  },
}

// ----------------------------------------------------------------
// MATCH HISTORY MOCK
// ----------------------------------------------------------------
export const MOCK_MATCHES: Match[] = [
  MOCK_MATCH,
  {
    id: 'match-002',
    game: 'cs2',
    map: 'de_inferno',
    mode: 'Competitive',
    played_at: new Date(Date.now() - 86400000).toISOString(),
    duration_seconds: 4200,
    result: 'win',
    score_team: 16,
    score_opponent: 13,
    overall_score: 74,
    feedbacks_count: 3,
    feedbacks: [],
  },
  {
    id: 'match-003',
    game: 'cs2',
    map: 'de_mirage',
    mode: 'Competitive',
    played_at: new Date(Date.now() - 172800000).toISOString(),
    duration_seconds: 3600,
    result: 'win',
    score_team: 16,
    score_opponent: 8,
    overall_score: 81,
    feedbacks_count: 2,
    feedbacks: [],
  },
  {
    id: 'match-004',
    game: 'cs2',
    map: 'de_nuke',
    mode: 'Competitive',
    played_at: new Date(Date.now() - 259200000).toISOString(),
    duration_seconds: 4500,
    result: 'loss',
    score_team: 9,
    score_opponent: 16,
    overall_score: 45,
    feedbacks_count: 7,
    feedbacks: [],
  },
]
