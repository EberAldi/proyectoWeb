import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import api from '../../../../service/api.js'

export const useConsolasStore = defineStore('consolas', {
  state: () => ({
    filtroActivo: 'todas',
    consolas: [],
    isLoading: false,
    modalVisible: false,       // ← controla el modal
  }),

  getters: {
    consolasFiltradas: (state) => {
      if (state.filtroActivo === 'todas') return state.consolas
      return state.consolas.filter((c) => c.estado === state.filtroActivo)
    },
    resumen: (state) => ({
      disponibles:   state.consolas.filter((c) => c.estado === 'disponible').length,
      ocupadas:      state.consolas.filter((c) => c.estado === 'ocupada').length,
      mantenimiento: state.consolas.filter((c) => c.estado === 'mantenimiento').length,
    }),
    ingresosEstimados: (state) => {
      const total = state.consolas
        .filter((c) => c.estado === 'ocupada')
        .reduce((acc, c) => acc + c.precioPorHora, 0)
      return `$${total.toLocaleString('es-MX')}`
    },
    colorEstado: () => (estado) =>
      ({
        disponible:    { bg: '#d1fae5', text: '#22c55e', barra: '#22c55e' },
        ocupada:       { bg: '#fee2e2', text: '#ef4444', barra: '#ef4444' },
        mantenimiento: { bg: '#fef9c3', text: '#eab308', barra: '#eab308' },
      }[estado] ?? { bg: '#f3f4f6', text: '#6b7280', barra: '#6b7280' }),
  },

  actions: {
    setFiltro(filtro) {
      this.filtroActivo = filtro
    },

    abrirModal() { this.modalVisible = true },
    cerrarModal() { this.modalVisible = false },

    async fetchConsolas() {
      try {
        this.isLoading = true
        const { data } = await api.get('/consolas')
        this.consolas = data.map((c) => ({
          ...c,
          controles: c.controles?.length ?? 0,
        }))
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar las consolas' })
      } finally {
        this.isLoading = false
      }
    },

    // payload = { nombre, marca, precioPorHora }
    // controles = [{ estado: 'disponible' }, { estado: 'dañado' }, ...]
    // consolasStore.js — action crearConsola
async crearConsola(payload, controles = []) {
  try {
    this.isLoading = true

    // Un solo request — backend crea consola y controles juntos
    const { data: consola } = await api.post('/consolas', {
      nombre:        payload.nombre,
      marca:         payload.marca,
      precioPorHora: payload.precioPorHora,
      controles,     // [{ estado: 'disponible' }, { estado: 'dañado' }]
    })

    this.consolas.push({
      ...consola,
      controles: consola.controles?.length ?? 0,
    })

    Swal.fire({ icon: 'success', title: 'Consola creada', showConfirmButton: false, timer: 1500 })
    this.cerrarModal()
  } catch (error) {
    console.error(error)
    Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear la consola' })
  } finally {
    this.isLoading = false
  }
},

    async cambiarEstado(id, estado) {
      try {
        const { data } = await api.patch(`/consolas/${id}/estado`, { estado })
        const index = this.consolas.findIndex((c) => c.id === id)
        if (index !== -1) this.consolas[index].estado = data.estado
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar el estado' })
      }
    },

    async eliminarConsola(id) {
      const confirm = await Swal.fire({
        title: '¿Eliminar consola?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
      })
      if (!confirm.isConfirmed) return
      try {
        await api.delete(`/consolas/${id}`)
        this.consolas = this.consolas.filter((c) => c.id !== id)
        Swal.fire({ icon: 'success', title: 'Eliminada', showConfirmButton: false, timer: 1200 })
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar' })
      }
    },
  },
})