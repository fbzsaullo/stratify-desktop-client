import { useAppStore } from '@/store/useAppStore'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Target,
  History,
  Settings,
  ChevronLeft,
  Zap,
  Activity,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard',          icon: LayoutDashboard },
  { id: 'session',    label: 'Análise Live',       icon: Activity },
  { id: 'report',     label: 'Relatórios',          icon: Target },
  { id: 'features',   label: 'Features',            icon: Zap },
  { id: 'history',    label: 'Histórico',           icon: History },
  { id: 'settings',   label: 'Configurações',       icon: Settings },
]

export function Sidebar() {
  const { activePage, setActivePage, sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={clsx(
        'h-full bg-surface border-r border-border-subtle flex flex-col transition-all duration-200 flex-shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-[220px]'
      )}
    >
      {/* Logo */}
      <div className={clsx(
        'flex items-center gap-3 px-4 py-5 border-b border-border-subtle',
        sidebarCollapsed && 'justify-center px-2'
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow-primary">
          <span className="text-white font-bold text-sm">S</span>
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-subtitle font-bold text-text-primary leading-none">Stratify</span>
            <span className="text-caption-xs text-text-tertiary">AI Coach · v0.0.2-final-ci</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 pt-3 overflow-y-auto">
        {!sidebarCollapsed && (
          <p className="section-title px-3 pb-2">Menu</p>
        )}

        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            title={sidebarCollapsed ? label : undefined}
            className={clsx(
              'nav-item w-full text-left',
              activePage === id && 'nav-item-active',
              sidebarCollapsed && 'justify-center px-2'
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Bottom — collapse toggle */}
      <div className="p-2 border-t border-border-subtle">
        <button
          onClick={toggleSidebar}
          className={clsx(
            'btn-ghost w-full text-text-tertiary',
            sidebarCollapsed && 'justify-center px-2'
          )}
          title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
        >
          <ChevronLeft
            size={14}
            className={clsx('transition-transform duration-200', sidebarCollapsed && 'rotate-180')}
          />
          {!sidebarCollapsed && <span className="text-caption">Colapsar</span>}
        </button>
      </div>
    </aside>
  )
}
