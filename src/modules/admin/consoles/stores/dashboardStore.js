import { defineStore } from 'pinia'
import api from '@/service/api'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    stats: {
      consolasActivas: 0,
      rentasHoy: 0,
      clientesHoy: 0,
      productosVendidos: 0,
    },

    ingresosDelDia: 0,

    rentasActivas: [],

    ultimasVentas: [],

    loading: false,
  }),

  getters: {
    totalIngresos: (state) =>
      `$${Number(state.ingresosDelDia).toLocaleString('es-MX')}`,
  },

  actions: {

    async cargarDashboard() {
      try {
        this.loading = true

        const [
          stats,
          rentas,
          ingresos,
          ventas,
        ] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/rentas-activas'),
          api.get('/dashboard/ingresos'),
          api.get('/dashboard/ultimas-ventas'),
        ])

        this.stats = stats.data

        this.rentasActivas = rentas.data

        this.ingresosDelDia = ingresos.data.total

        this.ultimasVentas = ventas.data

      } catch (error) {
        console.error('Error dashboard:', error)
      } finally {
        this.loading = false
      }
    },
  },
})