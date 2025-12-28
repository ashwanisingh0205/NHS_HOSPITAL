export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Try to restore session from localStorage
  // This will load user from localStorage and refresh the access token
  try {
    await authStore.restoreSession()
  } catch (error) {
    // If restore fails, user will be logged out automatically
    console.error('Failed to restore session on app load:', error)
  }
})

