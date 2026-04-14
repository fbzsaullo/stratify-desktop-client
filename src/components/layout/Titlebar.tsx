import { X, Minus } from 'lucide-react'
import { appWindow } from '@tauri-apps/api/window'
import clsx from 'clsx'

export function Titlebar() {
  const handleMinimize = async () => {
    await appWindow.minimize()
  }

  const handleClose = async () => {
    await appWindow.close()
  }

  return (
    <div 
      data-tauri-drag-region
      className={clsx(
        "h-8 flex items-center justify-between bg-surface/80 backdrop-blur-md border-b border-border-subtle select-none",
        "fixed top-0 left-0 right-0 z-50 px-4"
      )}
    >
      {/* Brand area inside titlebar (optional) */}
      <div className="flex items-center gap-2 pointer-events-none">
        <div className="w-4 h-4 flex items-center justify-center">
          <img src="/logo.png" alt="" className="w-full h-full object-contain" />
        </div>
        <span className="text-caption-xs font-semibold text-text-tertiary">Stratify</span>
      </div>

      {/* Controls */}
      <div className="flex items-center h-full">
        <button
          onClick={handleMinimize}
          className="h-full px-3 flex items-center justify-center text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary transition-colors"
          title="Minimizar"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3 flex items-center justify-center text-text-tertiary hover:bg-error-main hover:text-white transition-colors"
          title="Fechar"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
