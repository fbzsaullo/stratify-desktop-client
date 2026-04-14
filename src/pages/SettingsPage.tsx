import React, { useState, useEffect, useRef } from 'react'
import { Volume2, Music, Headphones, Speaker, RefreshCw, Play } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import clsx from 'clsx'

export function SettingsPage() {
  const { audioSettings, setAudioVolume, setAudioDevice } = useAppStore()
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const refreshDevices = async () => {
    setIsRefreshing(true)
    try {
      // Request permission first to get labels
      await navigator.mediaDevices.getUserMedia({ audio: true })
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const outputDevices = allDevices.filter(d => d.kind === 'audiooutput')
      setDevices(outputDevices)
    } catch (err) {
      console.error('Erro ao listar dispositivos de áudio:', err)
      // Fallback: list whatever is available
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      setDevices(allDevices.filter(d => d.kind === 'audiooutput'))
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    refreshDevices()
  }, [])

  const handleTestSound = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const text = `Stratify A.I. Coach ativado. Testando saída de áudio em ${audioSettings.volume} por cento.`;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Configurações da Voz
    utterance.volume = audioSettings.volume / 100;
    utterance.rate = 0.9; // Um pouco mais lento para soar mais "coach"
    utterance.pitch = 1.1; // Um pouco mais agudo para clareza

    // Tentar encontrar uma voz em português se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR')) || voices.find(v => v.lang.includes('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-display-sm font-bold text-text-primary mb-2">Configurações</h1>
        <p className="text-body text-text-secondary">Personalize sua experiência de áudio e interface.</p>
      </div>

      {/* Audio Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
            <Volume2 size={24} />
          </div>
          <div>
            <h2 className="text-title font-bold text-text-primary">Áudio e Som</h2>
            <p className="text-caption text-text-tertiary">Configure onde e como você ouve o coach.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-bg-primary p-6 rounded-2xl border border-border-subtle shadow-sm">
          
          {/* Output Device */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-subtitle font-semibold text-text-primary flex items-center gap-2">
                <Headphones size={18} className="text-text-tertiary" />
                Dispositivo de Saída
              </label>
              <button 
                onClick={refreshDevices}
                className={clsx("p-1 text-text-tertiary hover:text-brand-primary transition-colors", isRefreshing && "animate-spin")}
              >
                <RefreshCw size={14} />
              </button>
            </div>
            
            <select
              value={audioSettings.outputDeviceId}
              onChange={(e) => setAudioDevice(e.target.value)}
              className="w-full bg-bg-secondary border border-border-subtle rounded-lg px-3 py-2 text-body text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all cursor-pointer"
            >
              <option value="default">Padrão do Sistema</option>
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Saída Desconhecida (${device.deviceId.slice(0, 5)}...)`}
                </option>
              ))}
            </select>
            <p className="text-caption-xs text-text-tertiary italic">
              * Algumas alterações podem exigir o reinício do app para surtir efeito.
            </p>
          </div>

          {/* Volume Control */}
          <div className="space-y-4">
            <label className="text-subtitle font-semibold text-text-primary flex items-center gap-2">
              <Speaker size={18} className="text-text-tertiary" />
              Volume do Coach
            </label>
            
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={audioSettings.volume}
                onChange={(e) => setAudioVolume(parseInt(e.target.value))}
                className="flex-1 accent-brand-primary cursor-pointer h-1.5 bg-bg-secondary rounded-lg appearance-none"
              />
              <span className="text-subtitle font-mono text-text-primary w-8 text-right">
                {audioSettings.volume}%
              </span>
            </div>

            <button
              onClick={handleTestSound}
              className="flex items-center justify-center gap-2 w-full py-2 bg-brand-primary/10 text-brand-primary rounded-lg font-semibold hover:bg-brand-primary/20 transition-all border border-brand-primary/20"
            >
              <Play size={16} fill="currentColor" />
              Testar Áudio
            </button>
          </div>
        </div>
      </section>

      {/* Other placeholders with glassmorphism feel */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
        <div className="p-6 rounded-2xl border border-dashed border-border-subtle space-y-2">
          <h3 className="text-subtitle font-bold text-text-secondary">Visual & Overlay</h3>
          <p className="text-caption text-text-tertiary">Configurações de interface e HUD em jogo disponíveis em breve.</p>
        </div>
        <div className="p-6 rounded-2xl border border-dashed border-border-subtle space-y-2">
          <h3 className="text-subtitle font-bold text-text-secondary">Conta & Login</h3>
          <p className="text-caption text-text-tertiary">Sincronização com nuvem e estatísticas globais em breve.</p>
        </div>
      </section>
    </div>
  )
}
