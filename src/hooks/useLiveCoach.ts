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
      received(data: Feedback) {
        console.log('🎙️ Received Feedback:', data)
        addLiveFeedback(data)
        if (voiceEnabled && window.speechSynthesis) {
          const utterance = new SpeechSynthesisUtterance(data.actionable_tip || data.title)
          utterance.lang = 'pt-BR'
          utterance.volume = volume / 100
          window.speechSynthesis.cancel()
          window.speechSynthesis.speak(utterance)
        }
      },
    })

    // New: Subscribe to Raw Game Events for the Session Log
    const eventsSubscription = consumer.subscriptions.create('GameEventsChannel', {
      connected() {
        console.log('📡 Connected to Raw Game Events Channel')
      },
      received(event: any) {
        console.log('🎮 Raw Event Received:', event.event_type)
        useAppStore.getState().pushEvent(event.event_type, event.payload)
      }
    })

    return () => {
      console.log('🔌 Disconnecting from Live Coach...')
      subscription.unsubscribe()
      eventsSubscription.unsubscribe()
      consumer.disconnect()
    }
  }, [addLiveFeedback, voiceEnabled, volume])

  return null
}
