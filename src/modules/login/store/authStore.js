import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import api from '../../../../src/service/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    isGoogleLoading: false,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user?.role ?? null,
  },

  actions: {
    async login(email, password, router) {
      try {
        this.isLoading = true

      const { data } = await api.post('auth/login/', {
      email,
      password
      })

        this.user = data.user
        this.isAuthenticated = true
        router.push('/dashboard')

      } catch (error) {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Credenciales incorrectas'
        })
      } finally {
        this.isLoading = false
      }
    },

    async loginWithGoogle(_router) {
      try {
        this.isGoogleLoading = true

        // Llama al backend para obtener la URL de OAuth de Google
        const { data } = await api.get('auth/google/')
        // El backend devuelve la URL de redirección de Google
        if (data.url) {
          window.location.href = data.url
        }
      } catch (error) {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo conectar con Google. Intenta de nuevo.',
        })
      } finally {
        this.isGoogleLoading = false
      }
    },

    async handleGoogleCallback(code, router) {
      try {
        this.isLoading = true
        const { data } = await api.post('/auth/google/callback', { code })
        this.user = data.user
        this.isAuthenticated = true
        router.push('/dashboard')
      } catch (error) {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Autenticación con Google fallida.',
        })
        router.push('/')
      } finally {
        this.isLoading = false
      }
    },

    logout(router) {
      Swal.fire({
        icon: 'question',
        title: '¿Cerrar sesión?',
        showCancelButton: true,
        confirmButtonColor: '#4F46E5',
        cancelButtonColor: '#EF4444',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.user = null
          this.isAuthenticated = false
          router.push('/login')
        }
      })
    },
  },
})
