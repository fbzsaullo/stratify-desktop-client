import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Steam-Id': 'demo_player_76561198000000001',
    'X-Username': 'StratifyPlayer',
  },
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Request failed:', error.message)
    return Promise.reject(error)
  }
)
