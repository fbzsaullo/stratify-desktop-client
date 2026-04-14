import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardPage } from '@/pages/DashboardPage'
import { SessionPage } from '@/pages/SessionPage'
import { ReportPage } from '@/pages/ReportPage'
import { FeaturesPage } from '@/pages/FeaturesPage'
import { HistoryPage } from '@/pages/HistoryPage'
import { useAppStore } from '@/store/useAppStore'

function SettingsPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-5xl">⚙️</span>
        <h2 className="text-title text-text-primary">Configurações</h2>
        <p className="text-body text-text-secondary max-w-[300px]">
          Configurações de sistema, áudio, overlay e conta serão implementadas na Fase 2.
        </p>
      </div>
    </div>
  )
}

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

  return (
    <div className="flex h-screen w-screen bg-bg-primary overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-bg-secondary">
        <PageComponent />
      </main>
    </div>
  )
}
