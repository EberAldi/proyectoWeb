import { defineStore } from 'pinia'
import api from '../../../../service/api.js'

export const useSesionesStore = defineStore(
  'sesiones',
  {
    state: () => ({
      activas: [],
      loading: false,
      refreshInterval: null,
    }),

    actions: {

      // ─────────────────────────────
      // OBTENER SESIONES ACTIVAS
      // ─────────────────────────────
      async obtenerActivas() {

        try {

          this.loading = true

          const { data } = await api.get(
            '/sesiones/activas'
          )

          this.activas = data

        } catch (error) {

          console.error(error)

        } finally {

          this.loading = false
        }
      },

      // ─────────────────────────────
      // AUTO REFRESH
      // ─────────────────────────────
      iniciarAutoRefresh() {

        this.obtenerActivas()

        if (this.refreshInterval) {

          clearInterval(this.refreshInterval)
        }

        // refresca backend cada 15 segundos
        this.refreshInterval = setInterval(() => {

          this.obtenerActivas()

        }, 15000)
      },

      detenerAutoRefresh() {

        if (this.refreshInterval) {

          clearInterval(this.refreshInterval)
        }
      },

      // ─────────────────────────────
      // AGREGAR HORA
      // ─────────────────────────────
      async agregarHora(id) {

        try {

          await api.patch(
            `/sesiones/${id}/agregar-hora`
          )

          await this.obtenerActivas()

        } catch (error) {

          console.error(error)
        }
      },

      // ─────────────────────────────
      // FINALIZAR
      // ─────────────────────────────
      async finalizarSesion(id) {

        try {

          await api.patch(
            `/sesiones/${id}/cerrar`
          )

          await this.obtenerActivas()

        } catch (error) {

          console.error(error)
        }
      },

      // ─────────────────────────────
      // TIEMPO RESTANTE
      // ─────────────────────────────
      tiempoRestante(sesion) {

        if (!sesion.inicio) return '--:--'

        const inicio = new Date(
          sesion.inicio
        ).getTime()

        const horas = sesion.duracionHoras || 1

        const fin =
          inicio + (horas * 60 * 60 * 1000)

        const ahora = Date.now()

        const restante = fin - ahora

        // sesión terminada
        if (restante <= 0) {

          return 'TERMINADA'
        }

        const hrs = Math.floor(
          restante / (1000 * 60 * 60)
        )

        const mins = Math.floor(
          (restante % (1000 * 60 * 60)) /
          (1000 * 60)
        )

        const secs = Math.floor(
          (restante % (1000 * 60)) / 1000
        )

        return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`
      },

      // ─────────────────────────────
      // PORCENTAJE BARRA
      // ─────────────────────────────
      porcentajeRestante(sesion) {

        const inicio = new Date(
          sesion.inicio
        ).getTime()

        const horas = sesion.duracionHoras || 1

        const total =
          horas * 60 * 60 * 1000

        const fin = inicio + total

        const restante = fin - Date.now()

        if (restante <= 0) {

          return 0
        }

        return (
          (restante / total) * 100
        ).toFixed(0)
      },

      // ─────────────────────────────
      // COLOR DINÁMICO
      // ─────────────────────────────
      colorRestante(sesion) {

        const porcentaje =
          this.porcentajeRestante(sesion)

        if (porcentaje <= 15) {

          return '#dc3545'
        }

        if (porcentaje <= 40) {

          return '#ffc107'
        }

        return '#198754'
      },
    },
  }
)