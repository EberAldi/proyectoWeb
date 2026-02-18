import { defineStore } from 'pinia'
import Swal from 'sweetalert2'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    isAuthenticated: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getUserRole: (state) => state.user?.role ?? null,
  },

  actions: {
    async login(email, password, router) {
      if (!email || !password) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor ingresa tu correo y contraseña',
          confirmButtonColor: '#4F46E5',
        })
        return
      }

      this.isLoading = true

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const usuarios = [
          {
            id: 1,
            email: 'admin@consolas.com',
            password: '123456',
            nombre: 'Administrador',
            role: 'admin',
          },
          {
            id: 2,
            email: 'cajero@consolas.com',
            password: '123456',
            nombre: 'Cajero 1',
            role: 'cajero',
          },
        ]

        const encontrado = usuarios.find((u) => u.email === email && u.password === password)

        if (!encontrado) {
          Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'Correo o contraseña incorrectos',
            confirmButtonColor: '#4F46E5',
          })
          return
        }

        const { password: _, ...usuarioSeguro } = encontrado
        this.user = usuarioSeguro
        this.isAuthenticated = true

        await Swal.fire({
          icon: 'success',
          title: `¡Bienvenido, ${this.user.nombre}!`,
          timer: 1500,
          showConfirmButton: false,
        })

        if (this.user.role === 'admin') {
          router.push('/dashboard')
        } else {
          router.push('/pos')
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'Intenta de nuevo más tarde',
          confirmButtonColor: '#4F46E5',
        })
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
