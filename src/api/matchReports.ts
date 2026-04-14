import { apiClient } from './client'

export interface Feedback {
  id: number
  analyzer: string
  severity: 'info' | 'warning' | 'error' | 'success'
  category: string
  title: string
  description: string | null
  actionable_tip: string | null
  confidence_score: number
  created_at: string
}

export interface MatchReport {
  id: string
  map: string
  status: 'pending' | 'analyzing' | 'complete' | 'failed'
  score: string | null
  duration_seconds: number | null
  feedback_count: number
  created_at: string
  feedbacks?: Feedback[]
}

export async function fetchMatchReports(): Promise<MatchReport[]> {
  const res = await apiClient.get<{ data: MatchReport[] }>('/api/v1/match_reports')
  return res.data.data
}

export async function fetchMatchReport(matchId: string): Promise<MatchReport> {
  const res = await apiClient.get<{ data: MatchReport }>(`/api/v1/match_reports/${matchId}`)
  return res.data.data
}

export async function fetchFeedbacks(matchId: string): Promise<Feedback[]> {
  const res = await apiClient.get<{ data: Feedback[] }>(`/api/v1/match_reports/${matchId}/feedbacks`)
  return res.data.data
}
