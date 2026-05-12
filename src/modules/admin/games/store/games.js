import { defineStore } from 'pinia'
import Swal from 'sweetalert2'
import api from '../../../../service/api.js'

export const useJuegosStore = defineStore('juegos', {
  state: () => ({
    filtroActivo: 'todos',
    modalAbierto: false,
    isLoading: false,
    juegos: [],
    consolas: [],       // nombres únicos para el select
    consolasRaw: [],    // objetos completos { id, nombre, ... }
    generos: [
      "accion", "deportes", "peleas", "carreras", "aventura", "terror", "multijugador", "otro"
    ],
  }),

  getters: {
    juegosFiltrados(state) {
      if (state.filtroActivo === 'todos') return state.juegos
      if (state.filtroActivo === 'disponible') return state.juegos.filter((j) => j.disponible)
      if (state.filtroActivo === 'ocupado')    return state.juegos.filter((j) => !j.disponible)
      return state.juegos
    },
    resumen(state) {
      return {
        total:       state.juegos.length,
        disponibles: state.juegos.filter((j) =>  j.disponible).length,
        ocupados:    state.juegos.filter((j) => !j.disponible).length,
      }
    },
    ingresosEstimados(state) {
      const total = state.juegos.reduce((acc, j) => acc + j.rentasHoy, 0)
      return `${total} rentas hoy`
    },
  },

  actions: {
    setFiltro(filtro) { this.filtroActivo = filtro },

    abrirModal() {
      this.modalAbierto = true
      this.fetchConsolas()   // frescos cada vez que abre
    },
    cerrarModal() { this.modalAbierto = false },

    _mapear(j) {
      return {
        ...j,
        consola:   j.plataforma,
        rentasHoy: j.rentasHoy ?? 0,
      }
    },

    async fetchJuegos() {
      try {
        this.isLoading = true
        const { data } = await api.get('/juegos')
        this.juegos = data.map(this._mapear)
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los juegos' })
      } finally {
        this.isLoading = false
      }
    },

    async fetchConsolas() {
      try {
        const { data } = await api.get('/consolas')
        this.consolasRaw = data
        // Distinct por nombre
        this.consolas = [...new Set(data.map((c) => c.nombre))]
      } catch (error) {
        console.error(error)
        this.consolas = []
      }
    },

    async agregarJuego(datos) {
      try {
        this.isLoading = true

        // 1. Crear el juego
        const { data: juego } = await api.post('/juegos', {
          nombre:     datos.nombre.trim(),
          plataforma: datos.consola,
          genero:     datos.genero.toLowerCase(),
          disponible: datos.disponible,
        })

        // 2. Consolas físicas que coinciden con la plataforma elegida
        const consolasMatch = this.consolasRaw.filter((c) => c.nombre === datos.consola)

        // 3. Insertar en consola_juegos por cada una
        await Promise.all(
          consolasMatch.map((c) =>
            api.post(`/juegos/${juego.id}/consolas`, { consolaId: c.id })
          )
        )

        // 4. Agregar al estado local
        this.juegos.push(this._mapear(juego))

        Swal.fire({
          icon: 'success',
          title: 'Juego agregado',
          text: consolasMatch.length
            ? `Asignado a ${consolasMatch.length} consola(s)`
            : 'Juego creado sin consolas asignadas',
          showConfirmButton: false,
          timer: 1800,
        })
        this.cerrarModal()
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo agregar el juego' })
      } finally {
        this.isLoading = false
      }
    },

    async toggleDisponibilidad(id) {
      const juego = this.juegos.find((j) => j.id === id)
      if (!juego) return
      try {
        await api.put(`/juegos/${id}`, { disponible: !juego.disponible })
        juego.disponible = !juego.disponible
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cambiar la disponibilidad' })
      }
    },

    async eliminarJuego(id) {
      try {
        await api.delete(`/juegos/${id}`)
        this.juegos = this.juegos.filter((j) => j.id !== id)
        Swal.fire({ icon: 'success', title: 'Eliminado', showConfirmButton: false, timer: 1200 })
      } catch (error) {
        console.error(error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el juego' })
      }
    },
  },
})