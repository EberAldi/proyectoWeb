import { defineStore } from 'pinia'

export const useConsolasStore = defineStore('consolas', {
  state: () => ({
    filtroActivo: 'todas',
    consolas: [
      { id: 1, nombre: 'PlayStation 5', marca: 'Sony',      estado: 'disponible',    controles: 2, precioPorHora: 80,  usoHoy: 0   },
      { id: 2, nombre: 'Xbox Series X', marca: 'Microsoft', estado: 'ocupada',       controles: 2, precioPorHora: 80,  usoHoy: 180 },
      { id: 3, nombre: 'Nintendo Switch', marca: 'Nintendo', estado: 'disponible',   controles: 2, precioPorHora: 60,  usoHoy: 60  },
      { id: 4, nombre: 'PlayStation 4', marca: 'Sony',      estado: 'mantenimiento', controles: 1, precioPorHora: 60,  usoHoy: 0   },
      { id: 5, nombre: 'Xbox One',      marca: 'Microsoft', estado: 'ocupada',       controles: 2, precioPorHora: 50,  usoHoy: 120 },
      { id: 6, nombre: 'PlayStation 4 Slim', marca: 'Sony', estado: 'disponible',   controles: 2, precioPorHora: 60,  usoHoy: 30  },
    ],
  }),

  getters: {
    consolasFiltradas: (state) => {
      if (state.filtroActivo === 'todas') return state.consolas
      return state.consolas.filter((c) => c.estado === state.filtroActivo)
    },

    resumen: (state) => ({
      disponibles:    state.consolas.filter((c) => c.estado === 'disponible').length,
      ocupadas:       state.consolas.filter((c) => c.estado === 'ocupada').length,
      mantenimiento:  state.consolas.filter((c) => c.estado === 'mantenimiento').length,
    }),

    ingresosEstimados: (state) => {
      const total = state.consolas
        .filter((c) => c.estado === 'ocupada')
        .reduce((acc, c) => acc + c.precioPorHora, 0)
      return `$${total.toLocaleString('es-MX')}`
    },

    colorEstado: () => (estado) => ({
      disponible:    { bg: '#d1fae5', text: '#22c55e', barra: '#22c55e' },
      ocupada:       { bg: '#fee2e2', text: '#ef4444', barra: '#ef4444' },
      mantenimiento: { bg: '#fef9c3', text: '#eab308', barra: '#eab308' },
    }[estado] ?? { bg: '#f3f4f6', text: '#6b7280', barra: '#6b7280' }),
  },

  actions: {
    setFiltro(filtro) {
      this.filtroActivo = filtro
    },
  },
})