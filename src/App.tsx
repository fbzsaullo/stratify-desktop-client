import React from 'react'
import { Titlebar } from '@/components/layout/Titlebar'
import { SettingsPage } from '@/pages/SettingsPage'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { SessionPage } from '@/pages/SessionPage'
import { ReportPage } from '@/pages/ReportPage'
import { FeaturesPage } from '@/pages/FeaturesPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { useLiveCoach } from '@/hooks/useLiveCoach'
import { useAppStore } from '@/store/useAppStore'

const PAGE_MAP: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  session:   SessionPage,
  report:    ReportPage,
  features:  FeaturesPage,
  history:   HistoryPage,
  settings:  SettingsPage,
}

export default function App() {
  const { activePage } = useAppStore()
  const PageComponent = PAGE_MAP[activePage] ?? DashboardPage

  // Ativa a escuta do Coach em Tempo Real
  useLiveCoach()

  return (
    <div className="flex bg-bg-primary h-screen w-screen overflow-hidden">
      <Titlebar />
      <div className="flex flex-1 pt-8 w-full h-full">
        <Sidebar />
        <main className="flex-1 min-w-0 bg-bg-secondary overflow-hidden">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}
