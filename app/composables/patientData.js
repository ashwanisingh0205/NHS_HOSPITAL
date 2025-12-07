export const usePatientData=()=>{
   
        const users = ref([])
        const pending = ref(false)
        const error = ref(null)
      
        const fetchUsers = async () => {
          pending.value = true
          try {
            const data = await $fetch('http://localhost:4000/marc/admission')
            users.value = data
          } catch (err) {
            error.value = err
          } finally {
            pending.value = false
          }
        }
      
        // Auto fetch on composable use
        fetchUsers()
      
        return {
          users,
          pending,
          error,
          fetchUsers
        }
      }
      
