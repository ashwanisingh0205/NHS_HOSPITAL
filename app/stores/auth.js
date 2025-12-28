import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const accessToken = ref(null)
  const user = ref(null)
  const isRefreshing = ref(false)
  const refreshPromise = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  // Actions
  async function login(credentials) {
    const { $axios } = useNuxtApp()
    const response = await $axios.post('/auth/login', credentials)
    
    accessToken.value = response.data.accessToken
    user.value = response.data.user
    
    // Persist user data for page refresh
    if (process.client) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    
    return response.data.user
  }

  async function refreshToken() {
    // Prevent concurrent refresh calls
    if (isRefreshing.value && refreshPromise.value) {
      return refreshPromise.value
    }

    isRefreshing.value = true
    refreshPromise.value = (async () => {
      try {
        const { $axios } = useNuxtApp()
        const response = await $axios.post('/auth/refresh')
        
        accessToken.value = response.data.accessToken
        
        // Update user if provided (optional)
        if (response.data.user) {
          user.value = response.data.user
          if (process.client) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }
        }
        
        return response.data.accessToken
      } catch (error) {
        // Clear auth state on refresh failure
        clearAuth()
        throw error
      } finally {
        isRefreshing.value = false
        refreshPromise.value = null
      }
    })()

    return refreshPromise.value
  }

  async function logout() {
    try {
      const { $axios } = useNuxtApp()
      await $axios.post('/auth/logout')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearAuth()
      navigateTo('/web/login')
    }
  }

  function clearAuth() {
    accessToken.value = null
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
    }
  }

  async function restoreSession() {
    // Load user from localStorage
    if (process.client) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          user.value = JSON.parse(storedUser)
          // Refresh access token using cookie
          await refreshToken()
          return true
        } catch (error) {
          clearAuth()
          return false
        }
      }
    }
    return false
  }

  return {
    // State
    accessToken,
    user,
    isRefreshing,
    // Getters
    isAuthenticated,
    // Actions
    login,
    refreshToken,
    logout,
    restoreSession
  }
})