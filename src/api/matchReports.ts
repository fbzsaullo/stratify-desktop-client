import { apiClient } from './client'
import type { AnalyzerName, FeedbackCategory } from '@/types'

export interface Feedback {
  id: number
  analyzer: AnalyzerName
  severity: 'info' | 'warning' | 'error' | 'success'
  category: FeedbackCategory
  title: string
  description: string | null
  actionable_tip: string | null
  confidence_score: number
  created_at: string
}

export interface MatchSummary {
  id: string
  map: string
  status: string
  score: string | null
  score_team: number
  score_opponent: number
  result: 'win' | 'loss'
  overall_score: number
  duration_seconds: number | null
  feedback_count: number
  created_at: string
}

export interface FullMatchReport {
  match: MatchSummary
  summary: {
    total_errors: number
    critical_errors: number
    warnings: number
    overall_score: number
    top_category: string
    improvement_areas: string[]
  }
  feedbacks_by_analyzer: Record<string, Feedback[]>
}

export async function fetchMatchReports(): Promise<MatchSummary[]> {
  const res = await apiClient.get<{ data: MatchSummary[] }>('/api/v1/match_reports')
  return res.data.data
}

export async function fetchMatchReport(matchId: string): Promise<FullMatchReport> {
  const res = await apiClient.get<{ data: FullMatchReport }>(`/api/v1/match_reports/${matchId}`)
  return res.data.data
}
