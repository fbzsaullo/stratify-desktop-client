import { useEffect, useRef } from 'react'
import { createConsumer } from '@rails/actioncable'
import { useAppStore } from '@/store/useAppStore'
import { Feedback } from '@/types'

const WS_URL = 'ws://localhost:3001/cable'

export function useLiveCoach() {
  const addLiveFeedback = useAppStore((s) => s.addLiveFeedback)
  const voiceEnabled = useAppStore((s) => s.audioSettings.voiceEnabled)
  const volume = useAppStore((s) => s.audioSettings.volume)
  
  const consumerRef = useRef<any>(null)

  useEffect(() => {
    console.log('🔌 Connecting to Live Coach via WebSocket...')
    const consumer = createConsumer(WS_URL)
    consumerRef.current = consumer

    const subscription = consumer.subscriptions.create('LiveCoachChannel', {
      connected() {
        console.log('✅ Connected to Live Coach Channel')
      },
      disconnected() {
        console.log('❌ Disconnected from Live Coach Channel')
      },
      received(data: Feedback) {
        console.log('🎙️ Live Feedback Received:', data)
        
        // 1. Adiciona ao Store (para UI)
        addLiveFeedback(data)

        // 2. Voz do Coach (TTS)
        if (voiceEnabled && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(data.actionable_tip || data.title)
          utterance.lang = 'pt-BR'
          utterance.volume = volume / 100
          utterance.rate = 1.0
          window.speechSynthesis.speak(utterance)
        }
      },
    })

    return () => {
      console.log('🔌 Disconnecting from Live Coach...')
      subscription.unsubscribe()
      consumer.disconnect()
    }
  }, [addLiveFeedback, voiceEnabled, volume])

  return null
}
