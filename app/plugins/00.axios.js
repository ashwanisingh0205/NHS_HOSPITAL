import axios from 'axios'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase,
    headers: {
      'Content-Type': 'application/json'
    },
    withCredentials: true
  })

  // Request interceptor - attach access token
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore()
      if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response interceptor - handle 401 and auto-refresh
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      // Handle 401 - attempt token refresh
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        try {
          const authStore = useAuthStore()
          
          // Refresh token (cookie sent automatically)
          await authStore.refreshToken()
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed - logout user
          const authStore = useAuthStore()
          await authStore.logout()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )

  return {
    provide: {
      axios: api
    }
  }
})