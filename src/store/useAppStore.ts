import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  PlayerStats,
  FeatureConfig,
  AnalysisSession,
  Feedback,
} from '@/types'
import { fetchMatchReports, fetchMatchReport, FullMatchReport, MatchSummary } from '@/api/matchReports'

// ================================================================
// MOCK DATA — Fase 1 MVP (substituir por API calls depois)
// ================================================================
const DEFAULT_FEATURES: FeatureConfig[] = [
  {
    id: 'anti-noob-detector',
    name: 'Anti-Noob Detector',
    description: 'Detecta erros recorrentes: reload ruim, morte sem util, spray fora do alcance',
    category: 'Básico',
    enabled: true,
    icon: '🚫',
  },
  {
    id: 'crosshair-coach',
    name: 'Crosshair Coach',
    description: 'Analisa posicionamento da mira e alerta sobre crosshair baixo',
    category: 'Básico',
    enabled: true,
    icon: '🎯',
  },
  {
    id: 'utility-coach',
    name: 'Utility Coach',
    description: 'Analisa efetividade de smokes, flashes e molotovs',
    category: 'Avançado',
    enabled: false,
    icon: '💣',
  },
  {
    id: 'round-iq-analyzer',
    name: 'Round IQ Analyzer',
    description: 'Avalia qualidade das decisões táticas por round',
    category: 'Avançado',
    enabled: false,
    icon: '🧠',
  },
  {
    id: 'clutch-analyzer',
    name: 'Clutch Analyzer',
    description: 'Analisa performance em situações 1vN',
    category: 'Avançado',
    enabled: false,
    icon: '⚡',
  },
]

// ================================================================
// STORE INTERFACES
// ================================================================
interface AppStore {
  // Player
  player: PlayerStats | null
  setPlayer: (player: PlayerStats) => void

  // Matches
  matches: MatchSummary[]
  fetchMatches: () => Promise<void>
  addMatch: (match: MatchSummary) => void

  // Features
  features: FeatureConfig[]
  toggleFeature: (id: string) => void

  // Analysis Session
  session: AnalysisSession
  startAnalysis: () => void
  updateSessionProgress: (progress: number, step?: string) => void
  pushEvent: (type: string, payload: any) => void
  addFeedback: (feedback: Feedback) => void
  finishAnalysis: (matchReport: FullMatchReport) => void
  resetSession: () => void

  // Current Report
  currentReport: FullMatchReport | null
  setCurrentReport: (report: FullMatchReport | null) => void
  fetchReport: (id: string) => Promise<void>

  // UI State
  activePage: string
  setActivePage: (page: string) => void
  sidebarCollapsed: boolean
  toggleSidebar: () => void

  // Audio Settings
  audioSettings: {
    volume: number
    voiceEnabled: boolean
    outputDeviceId: string
  }
  setAudioVolume: (volume: number) => void
  setAudioDevice: (id: string) => void
  toggleVoice: () => void

  // Live Feed
  liveFeedbacks: Feedback[]
  addLiveFeedback: (fb: Feedback) => void
  clearLiveFeed: () => void
}

// ================================================================
// STORE
// ================================================================
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Player
      player: null,
      setPlayer: (player) => set({ player }),

      // Matches
      matches: [],
      fetchMatches: async () => {
        try {
          const matches = await fetchMatchReports()
          set({ matches })
        } catch (err) {
          console.error('Failed to fetch matches', err)
        }
      },
      addMatch: (match) =>
        set((s) => ({ matches: [match, ...s.matches].slice(0, 50) })),

      // Features
      features: DEFAULT_FEATURES,
      toggleFeature: (id) =>
        set((s) => ({
          features: s.features.map((f) =>
            f.id === id ? { ...f, enabled: !f.enabled } : f
          ),
        })),

      // Analysis Session
      session: {
        status: 'idle',
        progress: 0,
        feedbacks: [],
        events: [],
      },
      startAnalysis: () =>
        set({ session: { status: 'analyzing', progress: 0, feedbacks: [], events: [] } }),
      updateSessionProgress: (progress, current_step) =>
        set((s) => ({
          session: { ...s.session, progress, current_step },
        })),
      pushEvent: (type, payload) =>
        set((s) => ({
          session: {
            ...s.session,
            events: [
              { id: crypto.randomUUID(), type, timestamp: new Date().toISOString(), payload },
              ...s.session.events,
            ].slice(0, 50),
          },
        })),
      addFeedback: (feedback) =>
        set((s) => ({
          session: {
            ...s.session,
            feedbacks: [feedback, ...s.session.feedbacks],
          },
        })),
      finishAnalysis: (matchReport) =>
        set((s) => ({
          session: { ...s.session, status: 'done', progress: 100 },
          currentReport: matchReport,
          matches: [matchReport.match, ...s.matches].slice(0, 50),
        })),
      resetSession: () =>
        set({
          session: { status: 'idle', progress: 0, feedbacks: [], events: [] },
        }),

      // Report
      currentReport: null,
      setCurrentReport: (report) => set({ currentReport: report }),
      fetchReport: async (id: string) => {
        try {
          const report = await fetchMatchReport(id)
          set({ currentReport: report })
        } catch (err) {
          console.error('Failed to fetch report', err)
        }
      },

      // UI
      activePage: 'dashboard',
      setActivePage: (page) => set({ activePage: page }),
      sidebarCollapsed: false,
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Audio
      audioSettings: {
        volume: 80,
        voiceEnabled: true,
        outputDeviceId: 'default',
      },
      setAudioVolume: (volume) =>
        set((s) => ({ audioSettings: { ...s.audioSettings, volume } })),
      setAudioDevice: (outputDeviceId) =>
        set((s) => ({ audioSettings: { ...s.audioSettings, outputDeviceId } })),
      toggleVoice: () =>
        set((s) => ({ audioSettings: { ...s.audioSettings, voiceEnabled: !s.audioSettings.voiceEnabled } })),

      // Live Feed
      liveFeedbacks: [],
      addLiveFeedback: (fb) =>
        set((s) => ({ liveFeedbacks: [fb, ...s.liveFeedbacks].slice(0, 5) })),
      clearLiveFeed: () => set({ liveFeedbacks: [] }),
    }),
    {
      name: 'stratify-app-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        features: s.features,
        player: s.player,
        matches: s.matches,
        sidebarCollapsed: s.sidebarCollapsed,
        audioSettings: s.audioSettings,
      }),
    }
  )
)
